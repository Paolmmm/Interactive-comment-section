export function randomNum(min, max) {
  return Math.trunc(Math.random() * max) + min;
}

export function calcAge(birthday) {
  const currentYear = new Date().getFullYear();
  return Math.abs(birthday.split("-")[0] - currentYear);
}
