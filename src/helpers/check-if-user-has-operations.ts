import { prisma } from "@/lib/prisma";

export const checkIfUserHasOperations = async (userId?: string) => {
  if (!userId)
    return {
      fiis: false,
      fixedIncomes: false,
    };

  const fiis = await prisma.fiisOperations.findMany({
    where: { userId },
  });
  const fixedIncomes = await prisma.fixedIncomeOperations.findMany({
    where: { userId },
  });

  return {
    fiis: fiis.length > 0,
    fixedIncomes: fixedIncomes.length > 0,
  };
};
