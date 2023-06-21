export function humanizeNetworkBandwidth(bandwidth: number): string {
  const units = ["bps", "Kbps", "Mbps", "Gbps", "Tbps"];
  let index = 0;

  while (bandwidth >= 1024 && index < units.length - 1) {
    bandwidth /= 1024;
    index++;
  }

  return `${bandwidth.toFixed(2)} ${units[index]}`;
}