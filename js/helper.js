export const today = new Date();

export function calcTime(date) {
  const ms = date.getMilliseconds() - today.getMilliseconds();
  const time = Math.abs(Math.ceil(time / 1000));

  // ricalcolo ad ogni aggiunta di commento
  // se sotto il minuto, a few seconds ago
  // se oltre i 60 minuti, num di ore
  return time < 60 ? `${time} seconds` : `${time} minutes`;
}

export function calcNum(arr) {
  const n = Math.trunc(Math.random() * (arr - 1));
  return n > (arr - 1) / 2 ? Math.floor(n) : Math.ceil(n);
}
