import { Pool, PoolClient } from 'pg';

// Pool global singleton (Wave 1 - Connection Pooling)
let globalPool: Pool | null = null;

function getPool(connectionString: string): Pool {
    if (!globalPool) {
        globalPool = new Pool({
            connectionString,
            max: 20, // Máximo de conexões no pool
            idleTimeoutMillis: 30000, // Fechar conexões ociosas após 30s
            connectionTimeoutMillis: 2000, // Timeout para obter conexão
            ssl: { rejectUnauthorized: false }
        });

        globalPool.on('error', (err) => {
            console.error('❌ Erro inesperado no pool PostgreSQL:', err);
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('🔄 SIGTERM recebido, fechando pool PostgreSQL...');
            if (globalPool) {
                await globalPool.end();
                globalPool = null;
            }
        });
    }
    return globalPool;
}

export class PostgresDatabase {
    private connectionString: string;
    private pool: Pool;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
        this.pool = getPool(connectionString);
    }

    prepare(query: string) {
        return new PostgresPreparedStatement(this.pool, query);
    }

    async batch(statements: PostgresPreparedStatement[]) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const results = [];
            for (const stmt of statements) {
                const res = await stmt.runWithClient(client);
                results.push(res);
            }
            await client.query('COMMIT');
            return results;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release(); // Retorna conexão ao pool
        }
    }
}

export class PostgresPreparedStatement {
    private pool: Pool;
    private rawQuery: string;
    private pgQuery: string;
    private params: any[];

    constructor(pool: Pool, query: string, params: any[] = []) {
        this.pool = pool;
        this.rawQuery = query;
        this.params = params;

        // Convert D1's ? positional arguments to Postgres $1, $2
        let paramCount = 1;
        this.pgQuery = query.replace(/\?/g, () => `$${paramCount++}`);
    }

    bind(...params: any[]) {
        return new PostgresPreparedStatement(this.pool, this.rawQuery, params);
    }

    private async executeQuery() {
        const client = await this.pool.connect();
        try {
            return await client.query(this.pgQuery, this.params);
        } finally {
            client.release(); // Retorna conexão ao pool
        }
    }

    async first<T = any>(): Promise<T | null> {
        const res = await this.executeQuery();
        return res.rows.length > 0 ? (res.rows[0] as T) : null;
    }

    async all<T = any>(): Promise<{ results: T[]; success: boolean; meta: any }> {
        const res = await this.executeQuery();
        return {
            results: res.rows as T[],
            success: true,
            meta: { changes: 0 }
        };
    }

    async run() {
        const res = await this.executeQuery();
        return {
            success: true,
            meta: { changes: res.rowCount }
        };
    }

    // Special method for transaction processing in batch()
    async runWithClient(client: PoolClient) {
        const res = await client.query(this.pgQuery, this.params);
        return {
            success: true,
            meta: { changes: res.rowCount }
        };
    }
}
