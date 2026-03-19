-- Script para adicionar índices no banco de dados
-- Wave 1 - Correções Críticas
-- Execução: psql $SUPABASE_URL -f scripts/add-indexes.sql

-- Índice para hub_user_products (se a tabela existir)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hub_user_products_user_id
  ON hub_user_products(user_id);

-- Índice para hub_lesson_progress (se a tabela existir)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hub_lesson_progress_user_id
  ON hub_user_lesson_progress(user_id);

-- Índice composto para hub_lesson_progress
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hub_lesson_progress_composite
  ON hub_user_lesson_progress(user_id, product_id, lesson_id);

-- Índice para projects.category_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_category_id
  ON projects(category_id);

-- Índice para projects.created_at (ordenação DESC)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_created_at
  ON projects(created_at DESC);

-- Índice para hub_comments.lesson_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hub_comments_lesson_id
  ON hub_comments(lesson_id);

-- Índice parcial para notificações não lidas
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hub_notifications_user_id_unread
  ON hub_notifications(user_id) WHERE is_read = FALSE;

-- Índice para hub_lessons.product_id (usado em JOINs)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hub_lessons_product_id
  ON hub_lessons(product_id);

-- Índice para project_sections.project_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_sections_project_id
  ON project_sections(project_id);

-- Índice para project_images.section_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_images_section_id
  ON project_images(section_id);
