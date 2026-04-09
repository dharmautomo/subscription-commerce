import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('deduplicates conflicting tailwind classes', () => {
    // tailwind-merge: last wins
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b')
  })
})
