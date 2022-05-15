export const MAX_AGE = 75;
export const MIN_AGE = 11;
export const MAX_COMMENTS = 50;
export let MAX_INTERVAL = 5;

export function getMaxInterval(num) {
  if (num !== 0 && num % 5 === 0) {
    MAX_INTERVAL += 5;
  }
  return MAX_INTERVAL;
}
