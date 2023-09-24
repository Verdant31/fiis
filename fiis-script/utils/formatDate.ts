const { parse, format } = require("date-fns");

export const convertDate = (date: string | undefined) => {
  const parsed = parse(date, "dd/MM/yyyy", new Date());
  const formatted = format(parsed, "yyyy-MM-dd");

  return formatted;
};
