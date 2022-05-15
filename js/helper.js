export const today = new Date();

export function calcNum(arr) {
  const n = Math.trunc(Math.random() * (arr - 1));
  return n > (arr - 1) / 2 ? Math.floor(n) : Math.ceil(n);
}

export function calcTime(date) {
  const dateTotal = date.getTime();
  const todayTotal = today.getTime();

  const time = Math.trunc((dateTotal - todayTotal) / 1000);

  return time < 60
    ? `${time} ${time < 2 ? "second" : "seconds"} ago`
    : `${Math.trunc(time / 60)} ${time < 120 ? "minute" : "minutes"} ago`;
}
