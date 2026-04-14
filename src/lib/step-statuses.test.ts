import { describe, it, expect } from 'vitest'
import {
  getTwoStepStatuses,
  getSectionStepStatuses,
  areRequiredSectionStepsComplete,
  type SectionStepFlags,
} from './step-statuses'

const none: SectionStepFlags = {
  hasSpec: false,
  hasData: false,
  hasScreenDesigns: false,
  hasScreenshots: false,
}

describe('getTwoStepStatuses', () => {
  it('returns a fixed-length 2-tuple', () => {
    expect(getTwoStepStatuses(false, false)).toHaveLength(2)
  })

  it('step 1 current + step 2 upcoming when nothing is done', () => {
    expect(getTwoStepStatuses(false, false)).toEqual(['current', 'upcoming'])
  })

  it('step 1 completed + step 2 current when design system is done', () => {
    expect(getTwoStepStatuses(true, false)).toEqual(['completed', 'current'])
  })

  it('both completed when design system and shell are done', () => {
    expect(getTwoStepStatuses(true, true)).toEqual(['completed', 'completed'])
  })

  it('handles the unusual "shell before design system" case gracefully', () => {
    // Shouldn't happen through normal UX, but the helper stays defined:
    // step 1 stays 'current' because there's no design system, and
    // step 2 is 'completed' because shell is done.
    expect(getTwoStepStatuses(false, true)).toEqual(['current', 'completed'])
  })
})

describe('getSectionStepStatuses', () => {
  it('returns a fixed-length 4-tuple', () => {
    expect(getSectionStepStatuses(none)).toHaveLength(4)
  })

  it('step 1 current when nothing exists', () => {
    expect(getSectionStepStatuses(none)).toEqual([
      'current',
      'upcoming',
      'upcoming',
      'upcoming',
    ])
  })

  it('advances current to the first incomplete step', () => {
    expect(
      getSectionStepStatuses({ ...none, hasSpec: true })
    ).toEqual(['completed', 'current', 'upcoming', 'upcoming'])

    expect(
      getSectionStepStatuses({ ...none, hasSpec: true, hasData: true })
    ).toEqual(['completed', 'completed', 'current', 'upcoming'])

    expect(
      getSectionStepStatuses({
        ...none,
        hasSpec: true,
        hasData: true,
        hasScreenDesigns: true,
      })
    ).toEqual(['completed', 'completed', 'completed', 'current'])
  })

  it('all completed when every flag is true', () => {
    expect(
      getSectionStepStatuses({
        hasSpec: true,
        hasData: true,
        hasScreenDesigns: true,
        hasScreenshots: true,
      })
    ).toEqual(['completed', 'completed', 'completed', 'completed'])
  })

  it('keeps later incomplete steps as "upcoming" even if an earlier later step is done (gaps)', () => {
    // e.g. user skipped sample data but has screen designs -> data still current.
    expect(
      getSectionStepStatuses({
        hasSpec: true,
        hasData: false,
        hasScreenDesigns: true,
        hasScreenshots: false,
      })
    ).toEqual(['completed', 'current', 'completed', 'upcoming'])
  })
})

describe('areRequiredSectionStepsComplete', () => {
  it('is false when any of spec/data/screenDesigns is missing', () => {
    expect(areRequiredSectionStepsComplete(none)).toBe(false)
    expect(areRequiredSectionStepsComplete({ ...none, hasSpec: true })).toBe(false)
    expect(
      areRequiredSectionStepsComplete({ ...none, hasSpec: true, hasData: true })
    ).toBe(false)
  })

  it('is true when spec + data + screenDesigns are all present (screenshots optional)', () => {
    expect(
      areRequiredSectionStepsComplete({
        hasSpec: true,
        hasData: true,
        hasScreenDesigns: true,
        hasScreenshots: false,
      })
    ).toBe(true)
  })

  it('is still true when screenshots are present as well', () => {
    expect(
      areRequiredSectionStepsComplete({
        hasSpec: true,
        hasData: true,
        hasScreenDesigns: true,
        hasScreenshots: true,
      })
    ).toBe(true)
  })
})
