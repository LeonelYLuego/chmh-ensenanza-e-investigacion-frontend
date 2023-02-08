/**
 * Returns the last day of a month
 * @param year
 * @param month
 * @returns
 */
export function lastDayOfTheMonth(year: number, month: number): number {
  switch (month + 1) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? 29 : 28;
    default:
      return NaN;
  }
}

/**
 * Name of the months
 */
const months = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/**
 * Returns the name of a month
 * @param month
 * @returns
 */
export function monthToString(month: number) {
  return months[month];
}

/**
 * Gets the fist day of a month as string
 * @param date
 * @returns
 */
export function getFirstDayOfMonthAsString(date: Date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  return `1 de ${months[month]} de ${year}`;
}

/**
 * Gets the last day of a month as string
 * @param date
 * @returns
 */
export function getLastDayOfMonthAsString(date: Date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${lastDayOfTheMonth(year, month)} de ${months[month]} de ${year}`;
}
