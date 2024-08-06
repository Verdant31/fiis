export const getMonthName = (month: string) => {
  const monthNumber = parseInt(month);
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', { month: 'long' });
}
