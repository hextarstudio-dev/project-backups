/**
 * Wave 3 - Pagination Helper
 * Provides consistent pagination across all API endpoints
 */

export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Parse pagination parameters from URL
 * @param url Request URL object
 * @returns Pagination parameters with page, limit, and offset
 */
export function parsePaginationParams(url: URL): PaginationParams {
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

/**
 * Create a paginated response
 * @param data Array of items for current page
 * @param total Total number of items across all pages
 * @param params Pagination parameters
 * @returns Formatted paginated response
 */
export function createPaginatedResponse<T>(
    data: T[],
    total: number,
    params: PaginationParams
): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / params.limit);

    return {
        data,
        pagination: {
            page: params.page,
            limit: params.limit,
            total,
            totalPages,
            hasNext: params.page < totalPages,
            hasPrev: params.page > 1
        }
    };
}

/**
 * Generate SQL LIMIT/OFFSET clause
 * @param params Pagination parameters
 * @returns SQL clause string
 */
export function getPaginationSQL(params: PaginationParams): string {
    return `LIMIT ${params.limit} OFFSET ${params.offset}`;
}
