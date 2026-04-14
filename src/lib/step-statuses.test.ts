import { describe, it, expect } from 'vitest'
import { getDesignPageStepStatuses } from './step-statuses'

describe('getDesignPageStepStatuses', () => {
  it('returns a fixed-length 2-tuple', () => {
    expect(getDesignPageStepStatuses(false, false)).toHaveLength(2)
  })

  it('step 1 current + step 2 upcoming when nothing is done', () => {
    expect(getDesignPageStepStatuses(false, false)).toEqual(['current', 'upcoming'])
  })

  it('step 1 completed + step 2 current when design system is done', () => {
    expect(getDesignPageStepStatuses(true, false)).toEqual(['completed', 'current'])
  })

  it('both completed when design system and shell are done', () => {
    expect(getDesignPageStepStatuses(true, true)).toEqual(['completed', 'completed'])
  })

  it('handles the unusual "shell before design system" case gracefully', () => {
    // Shouldn't happen through normal UX, but the helper stays defined:
    // step 1 stays 'current' because there's no design system, and
    // step 2 is 'completed' because shell is done.
    expect(getDesignPageStepStatuses(false, true)).toEqual(['current', 'completed'])
  })
})
