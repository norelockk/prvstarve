export function humanizeNetworkBandwidth(bandwidth: number): string {
  const units = ["bps", "Kbps", "Mbps", "Gbps", "Tbps"];
  let index = 0;

  while (bandwidth >= 1024 && index < units.length - 1) {
    bandwidth /= 1024;
    index++;
  }

  return `${bandwidth.toFixed(2)} ${units[index]}`;
}

export function isTextSelected(input: HTMLInputElement): boolean {
  // @ts-ignore
  return document.getSelection().toString() === input.value;
}

// Shuffles an array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = ~~(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}