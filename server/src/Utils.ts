export const hrtimeMs = () => {
  const time = process.hrtime();
  return time[0] * 1000 + time[1] / 1000000;
};

export function restore_number(num: number): number {
  if (num < 10000)
    return num;
  else if (num >= 10000 && num < 1000000)
    return num / 100 + 10000;
  else if (num >= 1000000)
    return num / 1000 + 20000;
  else
    return 0;
}

export function sliceToBytes(x: number, size: number = 2): number[] {
  let array = new Array<number>(size);

  for (let i = 0; i < size; i++) {
    array[i] = x / Math.pow(256, i);
  }

  return array;
};