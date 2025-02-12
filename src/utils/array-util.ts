
/**
 * Convierte los elementos de un string array a un number array
 */
export function toNumberArray(stringArray: string[]): number[] {
  return stringArray.map(str => Number(str));
}
