export const RandIdx = (min:number, max:number) => {
  return Math.floor(min + Math.random() * (max - min));
}

export const RandBetween = (min:number, max:number) => {
  return min + Math.random() * (max - min);
}