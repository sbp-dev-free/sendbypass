import resolveConfig from 'tailwindcss/resolveConfig'
import mapValues from 'lodash/mapValues'
import toInteger from 'lodash/toInteger'
import tailwindConfig from '../../../tailwind.config'


type CompareResult = -1 | 0 | 1

const config = resolveConfig(tailwindConfig)

export const breakpoints = mapValues(config.theme.screens, (value) => toInteger(value.replace('px', '')))

export type Breakpoint = keyof typeof breakpoints


export const compareBreakpoints = (
  bp1: Breakpoint,
  bp2: Breakpoint,
): CompareResult => {
  const bp1Value = breakpoints[bp1]
  const bp2Value = breakpoints[bp2]

  if (bp1Value < bp2Value) {
    return -1
  }

  if (bp1Value > bp2Value) {
    return 1
  }

  return 0
}

export default config
