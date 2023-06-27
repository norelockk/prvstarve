import axios from 'axios';

export const getIp = async (): Promise<string> => (await axios.get('https://api.ipify.org'))?.data as string;

export const hrtimeMs = (): number => {
  const time = process.hrtime();

  return time[0] * 1000 + time[1] / 1000000;
};

export const restore_number = (num: number): number => {
  if (num < 10000)
    return num;
  else if (num >= 10000 && num < 1000000)
    return num / 100 + 10000;
  else if (num >= 1000000)
    return num / 1000 + 20000;
  else
    return 0;
};

export const sliceToBytes = (x: number, size: number = 2): number[] => {
  let array = new Array<number>(size);

  for (let i = 0; i < size; i++)
    array[i] = x / Math.pow(256, i);

  return array;
};

export const collision = (p1x: number, p1y: number, r1: number, p2x: number, p2y: number, r2: number): boolean => {
  const totalRadius: number = r1 + r2;
  const x: number = p1x - p2x;
  const y: number = p1y - p2y;

  return totalRadius > Math.sqrt((x * x) + (y * y));
};

export class Timer {
  public active: boolean = false;
  public elapsed: number = 0;
  public duration: number = 0;

  start(): void {
    this.active = true;
  }

  stop(): void {
    this.active = false;
  }

  reset(): void {
    this.elapsed = 0;
  }

  setDuration(duration: number): void {
    this.stop();
    this.duration = duration;
    this.reset();
  }

  update(delta: number): void {
    if (this.active) {
      this.elapsed += delta;

      if (this.elapsed >= this.duration) {
        this.stop();
        this.reset();
      }
    }
  }
}