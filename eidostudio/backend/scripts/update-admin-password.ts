/**
 * Script para atualizar senha do admin com hash bcrypt
 * Wave 1 - Correções Críticas
 *
 * Execução: npx tsx scripts/update-admin-password.ts
 */

import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const NOVA_SENHA = 'S3nh@F0rt3!Adm1n2026';
const EMAIL_ADMIN = 'adminraquel@eidostudio.com.br';

async function main() {
    console.log('🔐 Iniciando atualização de senha do admin...\n');

    if (!process.env.SUPABASE_URL) {
        console.error('❌ SUPABASE_URL não encontrado no .env');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.SUPABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        // Gerar hash da nova senha
        console.log('1️⃣ Gerando hash bcrypt da nova senha...');
        const hash = await bcrypt.hash(NOVA_SENHA, 10);
        console.log(`   ✅ Hash gerado: ${hash.substring(0, 20)}...`);

        // Atualizar senha no banco
        console.log('\n2️⃣ Atualizando senha no banco de dados...');
        const result = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email, name',
            [hash, EMAIL_ADMIN]
        );

        if (result.rowCount === 0) {
            console.error('❌ Admin não encontrado no banco!');
            process.exit(1);
        }

        console.log('   ✅ Senha atualizada com sucesso!');
        console.log(`   Usuário: ${result.rows[0].name} (${result.rows[0].email})`);

        console.log('\n✅ CONCLUÍDO!');
        console.log('\n📝 Informações de acesso:');
        console.log(`   Email: ${EMAIL_ADMIN}`);
        console.log(`   Nova Senha: ${NOVA_SENHA}`);
        console.log('\n⚠️  Guarde essas credenciais em local seguro!');

    } catch (error) {
        console.error('❌ Erro ao atualizar senha:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
