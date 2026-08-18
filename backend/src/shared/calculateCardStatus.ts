export function calculateCardStatus(
  quantidade: number
): 'faltando' | 'adquirida' | 'repetida' {
  if (quantidade === 0) return 'faltando'
  if (quantidade === 1) return 'adquirida'
  return 'repetida'
}