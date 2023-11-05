export function add_in(x: number, add: number, min: number, max: number) {
  if (x + add < min) return min;
  if (x + add > max) return max;
  return x + add;
}
