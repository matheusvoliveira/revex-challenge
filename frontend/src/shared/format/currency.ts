export function formatBrlFromCents(cents: number): string {
  const negative = cents < 0
  const absolute = Math.abs(cents)
  const whole = Math.trunc(absolute / 100)
  const fraction = absolute % 100
  const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${negative ? '-' : ''}R$ ${grouped},${fraction.toString().padStart(2, '0')}`
}

export function formatSalaryNumber(value: number): string {
  return formatBrlFromCents(Math.round(value * 100))
}

export function maskSalaryInput(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 0) {
    return ''
  }
  return formatBrlFromCents(Number.parseInt(digits, 10))
}

export function parseSalaryMask(masked: string): number | null {
  const digits = masked.replace(/\D/g, '')
  if (digits.length === 0) {
    return null
  }
  return Number.parseInt(digits, 10) / 100
}
