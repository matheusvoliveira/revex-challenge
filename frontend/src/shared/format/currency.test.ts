import { describe, expect, it } from 'vitest'
import { formatSalaryNumber, maskSalaryInput, parseSalaryMask } from './currency'

describe('currency', () => {
  it('formats number as Brazilian currency', () => {
    expect(formatSalaryNumber(1234.56)).toBe('R$ 1.234,56')
    expect(formatSalaryNumber(0)).toBe('R$ 0,00')
  })

  it('masks digits while typing', () => {
    expect(maskSalaryInput('123456')).toBe('R$ 1.234,56')
    expect(maskSalaryInput('R$ 1.234,56')).toBe('R$ 1.234,56')
  })

  it('parses masked value back to JSON number', () => {
    expect(parseSalaryMask('R$ 1.234,56')).toBe(1234.56)
    expect(parseSalaryMask('')).toBeNull()
  })
})
