import * as Tape from './Tape'
import * as TapeValue from './TapeValue'

export class Base {
}

export function Parse(expression: String) : Base {
  return new Base();
}

export function Assignment(target: TapeValue.Symbol, value: TapeValue.Base) : Base {
  return new Base();
}