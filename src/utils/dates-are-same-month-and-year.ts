export const datesAreSameMonthAndYear = (date1: Date, date2: Date) => {
  if (date1 >= date2) {
    return true;
  } else {
    return (
      date1.getMonth() >= date2.getMonth() &&
      date1.getFullYear() >= date2.getFullYear()
    );
  }
};
