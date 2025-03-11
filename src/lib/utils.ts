/**
 * Utilitário para combinar nomes de classes CSS
 * @param classes Classes CSS a serem combinadas
 * @returns String com as classes combinadas
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utilitário para formatar datas
 * @param date Data a ser formatada
 * @param locale Localidade para formatação
 * @returns String com a data formatada
 */
export function formatDate(date: Date, locale: string = 'pt-BR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Utilitário para formatar moeda
 * @param value Valor a ser formatado
 * @param locale Localidade para formatação
 * @param currency Moeda para formatação
 * @returns String com o valor formatado como moeda
 */
export function formatCurrency(
  value: number,
  locale: string = 'pt-BR',
  currency: string = 'BRL'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Utilitário para formatar porcentagem
 * @param value Valor a ser formatado (0-1)
 * @param locale Localidade para formatação
 * @returns String com o valor formatado como porcentagem
 */
export function formatPercentage(value: number, locale: string = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Utilitário para gerar um ID único
 * @param prefix Prefixo para o ID
 * @returns String com o ID único
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Utilitário para truncar texto
 * @param text Texto a ser truncado
 * @param maxLength Comprimento máximo
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Utilitário para verificar se um valor é vazio
 * @param value Valor a ser verificado
 * @returns Boolean indicando se o valor é vazio
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Utilitário para debounce de funções
 * @param fn Função a ser executada
 * @param delay Tempo de espera em ms
 * @returns Função com debounce
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Utilitário para throttle de funções
 * @param fn Função a ser executada
 * @param limit Tempo limite em ms
 * @returns Função com throttle
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Utilitário para agrupar itens de um array por uma propriedade
 * @param array Array a ser agrupado
 * @param key Chave para agrupamento
 * @returns Objeto com os itens agrupados
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    result[groupKey] = result[groupKey] || [];
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Utilitário para ordenar um array por uma propriedade
 * @param array Array a ser ordenado
 * @param key Chave para ordenação
 * @param direction Direção da ordenação
 * @returns Array ordenado
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA === valueB) return 0;
    
    const comparison = valueA < valueB ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Utilitário para filtrar um array por uma propriedade
 * @param array Array a ser filtrado
 * @param key Chave para filtragem
 * @param value Valor para filtragem
 * @returns Array filtrado
 */
export function filterBy<T>(array: T[], key: keyof T, value: any): T[] {
  return array.filter((item) => item[key] === value);
}

/**
 * Utilitário para verificar se um elemento está visível na viewport
 * @param element Elemento a ser verificado
 * @returns Boolean indicando se o elemento está visível
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Utilitário para converter string para slug
 * @param text Texto a ser convertido
 * @returns String convertida para slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
