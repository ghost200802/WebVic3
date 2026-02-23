import { CORE_VERSION } from '../src/index'

describe('Core Module', () => {
  it('should export CORE_VERSION', () => {
    expect(CORE_VERSION).toBe('1.0.0')
  })
})
