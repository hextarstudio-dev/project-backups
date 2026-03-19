/**
 * Wave 5 - Error Handling Utilities
 * Helpers para tratamento consistente de erros em toda aplicação
 */

/**
 * Extrai mensagem de erro de qualquer tipo de erro
 * @param error - Erro capturado (unknown)
 * @returns Mensagem de erro formatada
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'Unknown error occurred';
}

/**
 * Log de erro estruturado (apenas em desenvolvimento)
 * @param context - Contexto onde o erro ocorreu
 * @param error - Erro capturado
 */
export function logError(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}

/**
 * Log de debug (apenas em desenvolvimento)
 * @param context - Contexto do log
 * @param data - Dados para log
 */
export function logDebug(context: string, ...data: unknown[]): void {
  if (import.meta.env.DEV) {
    console.info(`[${context}]`, ...data);
  }
}

/**
 * Exibe erro amigável ao usuário
 * @param error - Erro capturado
 * @param fallbackMessage - Mensagem padrão caso erro não tenha mensagem
 */
export function showUserError(error: unknown, fallbackMessage = 'Ocorreu um erro'): void {
  const message = getErrorMessage(error);
  alert(`${fallbackMessage}: ${message}`);
}

/**
 * Wrapper para async operations com tratamento de erro
 * @param operation - Função async a executar
 * @param context - Contexto para logging
 * @param onError - Callback opcional para erro
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context: string,
  onError?: (error: unknown) => void
): Promise<T | null> {
  try {
    return await operation();
  } catch (error: unknown) {
    logError(context, error);
    if (onError) {
      onError(error);
    }
    return null;
  }
}
