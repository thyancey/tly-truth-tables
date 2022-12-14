export const RandIdx = (min:number, max:number) => {
  return Math.floor(min + Math.random() * (max - min));
}

export const RandBetween = (min:number, max:number) => {
  return min + Math.random() * (max - min);
}

export const RandFromArray = (array: any[]): any | null => {
  if(array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)]
}

export const RandIdxFromArray = (array: any[]): number => {
  if(array.length === 0) return -1;
  return Math.floor(Math.random() * array.length)
}
export const roundTo = (num:number, decimals:number = 2) => {
  // @ts-ignore
  return +(Math.round(num + `e+${decimals}`) + `e-${decimals}`);
}
export const clamp = (num:number, min:number, max:number) => Math.min(Math.max(num, min), max);