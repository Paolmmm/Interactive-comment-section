export const today = new Date();

export function calcNum(arr) {
  const n = Math.trunc(Math.random() * (arr - 1));
  return n > (arr - 1) / 2 ? Math.floor(n) : Math.ceil(n);
}

// DEPRECATA
export function calcTime(date) {
  const dateTotal = +(
    date.getMinutes().toString() + date.getSeconds().toString().padStart(2, 0)
  );
  const todayTotal = +(
    today.getMinutes().toString() + today.getSeconds().toString().padStart(2, 0)
  );

  const time = date.getSeconds() - today.getSeconds();

  return time < 60 ? `${time} seconds ago` : `${time} minutes ago`;
}


