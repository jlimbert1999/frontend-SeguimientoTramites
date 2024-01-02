const ordinales = require('ordinales-js');
export function toOrdinal(value: number): string {
  return ordinales.toOrdinal(value);
}
