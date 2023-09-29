import { Fii } from "@prisma/client";
import { isAfter, parse } from "date-fns";
import { By } from "selenium-webdriver";
import { driver } from "./driver";
import { prisma } from "./prisma";

const userName = process.argv[2];

const saveFiisToDb = async (fiis: Fii[]) => {
  return await Promise.all(
    fiis.map(async (fii) => {
      const { id, ...fiiRest } = fii;
      return await prisma.fii.upsert({
        where: {
          id: fii.id,
        },
        create: fiiRest,
        update: {
          lastIncomeDate: fii.lastIncomeDate,
          lastIncomeValue: fii.lastIncomeValue,
          quotationValue: fii.quotationValue,
          yield: fii.yield,
          initialValue: fii.initialValue,
        },
      });
    })
  );
};

const updateFiisPaymentDate = async (updatedFiis: Fii[], closures: { [key: string]: number }) => {
  const userFiisPurchases = await prisma.fiisPurchases.findMany({
    where: {
      userName,
    },
  });

  await Promise.all(
    userFiisPurchases.map(async (userFiiPurchase) => {
      const foundFii = updatedFiis.find((fii) => fii.name === userFiiPurchase.fiiName);

      if (!foundFii) return;

      const alreadyPaid = await prisma.paymentHistory.findFirst({
        where: {
          fiisPurchasesId: userFiiPurchase.id,
          AND: { date: { equals: foundFii?.lastIncomeDate } },
        },
      });

      const lastIncomeDate = parse(foundFii?.lastIncomeDate ?? "", "dd/MM/yyyy", new Date());
      const fiiPurchaseDateParsed = parse(userFiiPurchase.purchaseDate, "dd/MM/yyyy", new Date());

      if (alreadyPaid || isAfter(fiiPurchaseDateParsed, lastIncomeDate)) return;

      return await prisma.paymentHistory.create({
        data: {
          fiisPurchasesId: userFiiPurchase.id,
          closure: closures[foundFii.name],
          date: foundFii.lastIncomeDate,
          value: foundFii.lastIncomeValue,
          qty: userFiiPurchase.qty,
        },
      });
    })
  ).then((res) =>
    console.log(
      "Payment history updated",
      res.filter((r) => r)
    )
  );
};

const main = async () => {
  const fiis = await prisma.fii.findMany();
  const urls = fiis.map((fii) => "https://fiis.com.br/" + fii.name + "/");

  console.log("Urls que serão acessadas", urls);

  const data = [];
  let index = 0;
  let closures: { [key: string]: number } = {};

  for (const url of urls) {
    driver.get(url);

    const indicatorsContainer = await driver.findElement(By.className("indicators"));
    const [yieldElement, lastIncomeElement] = await indicatorsContainer.findElements(By.className("indicators__box "));
    const yieldValue = await yieldElement.findElement(By.css("b")).then((el) => el.getText());
    const lastIncomeValue = await lastIncomeElement.findElement(By.css("b")).then((el) => el.getText());

    const incomesContainer = await driver.findElement(By.css("[data-category='rendimento']"));
    const lastIncomeDate = await incomesContainer
      .findElement(By.css("p"))
      .then((el) => el.getText())
      .then((str) => str.match(/\d{2}\/\d{2}\/\d{4}/)?.[0]);

    const quotationContainer = await driver.findElement(By.className("item quotation"));
    const quotationValue = await quotationContainer.findElement(By.className("value")).then((el) => el.getText());

    const closureValue = await incomesContainer
      .findElements(By.css("li"))
      .then((el) => el[1].getText())
      .then((value) => {
        return value.match(/[\d,]+/)?.[0];
      });

    closures[fiis[index]?.name] = parseFloat(closureValue?.replace(",", ".") ?? "0");

    data.push({
      id: fiis[index]?.id,
      name: fiis[index]?.name,
      yield: parseFloat(yieldValue?.replace(",", ".") ?? "0"),
      lastIncomeDate: lastIncomeDate ?? "",
      lastIncomeValue: parseFloat(lastIncomeValue?.replace(",", ".") ?? "0"),
      quotationValue: parseFloat(quotationValue?.replace(",", ".") ?? "0"),
      initialValue: fiis[index]?.initialValue !== 0 ? fiis[index]?.initialValue : parseFloat(quotationValue?.replace(",", ".") ?? "0"),
    });
    index += 1;
  }
  await saveFiisToDb(data).then(async (res) => await updateFiisPaymentDate(res, closures));
};

main();
