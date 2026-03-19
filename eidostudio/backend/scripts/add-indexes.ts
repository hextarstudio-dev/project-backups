/**
 * Script para adicionar índices no banco de dados
 * Wave 1 - Correções Críticas
 *
 * Execução: npx tsx scripts/add-indexes.ts
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const indexes = [
    {
        name: 'idx_projects_category_id',
        sql: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_category_id ON projects(category_id)',
        description: 'Índice para projects.category_id'
    },
    {
        name: 'idx_projects_created_at',
        sql: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC)',
        description: 'Índice para projects.created_at (ordenação DESC)'
    },
    {
        name: 'idx_hub_comments_lesson_id',
        sql: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hub_comments_lesson_id ON hub_comments(lesson_id)',
        description: 'Índice para hub_comments.lesson_id'
    },
    {
        name: 'idx_hub_notifications_user_id_unread',
        sql: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hub_notifications_user_id_unread ON hub_notifications(user_id) WHERE is_read = FALSE',
        description: 'Índice parcial para notificações não lidas'
    },
    {
        name: 'idx_hub_lessons_product_id',
        sql: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hub_lessons_product_id ON hub_lessons(product_id)',
        description: 'Índice para hub_lessons.product_id (JOINs)'
    },
    {
        name: 'idx_project_sections_project_id',
        sql: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_sections_project_id ON project_sections(project_id)',
        description: 'Índice para project_sections.project_id'
    },
    {
        name: 'idx_project_images_section_id',
        sql: 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_images_section_id ON project_images(section_id)',
        description: 'Índice para project_images.section_id'
    }
];

async function main() {
    console.log('📊 Criando índices no banco de dados...\n');

    if (!process.env.SUPABASE_URL) {
        console.error('❌ SUPABASE_URL não encontrado no .env');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.SUPABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    let created = 0;
    let skipped = 0;
    let errors = 0;

    try {
        for (const index of indexes) {
            try {
                console.log(`🔨 ${index.description}...`);
                await pool.query(index.sql);
                console.log(`   ✅ ${index.name} criado\n`);
                created++;
            } catch (error: any) {
                if (error.message.includes('already exists')) {
                    console.log(`   ⏭️  ${index.name} já existe\n`);
                    skipped++;
                } else {
                    console.error(`   ❌ Erro ao criar ${index.name}:`, error.message);
                    errors++;
                }
            }
        }

        console.log('═══════════════════════════════════════════');
        console.log(`✅ Criados: ${created}`);
        console.log(`⏭️  Já existiam: ${skipped}`);
        console.log(`❌ Erros: ${errors}`);
        console.log('═══════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Erro geral:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
