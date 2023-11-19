export default function useClamp(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
}
