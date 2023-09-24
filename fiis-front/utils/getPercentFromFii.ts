import { Fii } from "@prisma/client";

export const getPercentFromFii = (fii: Fii) => {
  return parseFloat((((fii?.quotationValue - fii?.initialValue) * 100) / fii?.initialValue).toFixed(1));
};
