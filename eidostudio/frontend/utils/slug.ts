/**
 * Utility functions for generating and parsing URL-friendly slugs
 * Consolidated from multiple implementations across the codebase
 */

/**
 * Convert text to URL-friendly slug
 * @param text - Text to slugify
 * @returns URL-safe slug (lowercase, no accents, hyphenated)
 *
 * @example
 * slugify('Olá Mundo!') // 'ola-mundo'
 * slugify('Design & Branding') // 'design-branding'
 */
export function slugify(text: string = ''): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
}

/**
 * Create project slug with title and ID
 * @param project - Project object with title and id
 * @returns Slug in format: "title-slug-projectid"
 *
 * @example
 * createProjectSlug({ id: '123', title: 'Meu Projeto' })
 * // Returns: 'meu-projeto-123'
 */
export function createProjectSlug(project: { id: string; title: string }): string {
  const titleSlug = slugify(project.title);
  return titleSlug ? `${titleSlug}-${project.id}` : project.id;
}

/**
 * Extract project ID from slug
 * @param slug - Project slug in format "title-slug-projectid"
 * @returns Project ID or null if not found
 *
 * @example
 * extractIdFromSlug('meu-projeto-123') // '123'
 * extractIdFromSlug('invalid') // null
 */
export function extractIdFromSlug(slug: string): string | null {
  // Match last segment after final hyphen
  const match = slug.match(/-([^-]+)$/);
  return match ? match[1] : null;
}

/**
 * Generate folder name for project storage
 * @param project - Project object with title and id
 * @returns Folder name for R2/S3 storage
 *
 * @example
 * getProjectFolderName({ id: '123', title: 'Brand XYZ' })
 * // Returns: 'brand-xyz-123'
 */
export function getProjectFolderName(project: { id: string; title: string }): string {
  return createProjectSlug(project);
}
