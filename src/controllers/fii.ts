/* eslint-disable @typescript-eslint/no-unused-vars */
import { FiisPriceChartOptions } from "@/components/fiis/fiis-home-chart";
import { DateInRangeModeType } from "@/components/select-interval";
import { filterDividendsFromDate } from "@/helpers/filter-dividends-from-date";
import { ParsedCloduflareResponse } from "@/queries/use-cloudflare-model";
import {
  DividendPeriods,
  FiisHistory,
  FiiGroupedOperations,
  FiiSummary,
  FiiDividends,
  Dividend,
} from "@/types/fiis";
import { StatementsFiltersData } from "@/types/extracts";
import { FiisOperations } from "@prisma/client";
import {
  differenceInDays,
  differenceInMonths,
  format,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import _ from "lodash";

export class FiisController {
  public history: FiisHistory[] = [];
  public operations: FiiGroupedOperations[] = [];
  public dividends: FiiDividends[] = [];
  public summary: FiiSummary[] = [];

  constructor(data: Partial<FiisController>) {
    Object.assign(this, data);
  }

  getTotalValueInvested() {
    return this.operations.reduce((acc, fiiOperations) => {
      const total = fiiOperations.operations.reduce(
        (operationAcc, operation) => {
          if (operation.type === "sale") {
            operationAcc -= operation.qty * operation.quotationValue;
          } else {
            operationAcc += operation.qty * operation.quotationValue;
          }
          return operationAcc;
        },
        0,
      );
      acc += total;
      return acc;
    }, 0);
  }

  getTotalDividendsPerMonth(period: DividendPeriods) {
    const now = new Date();

    let months: string[] = [];
    if (period === DividendPeriods.Total) {
      const flatOperations = this.operations
        .map((fii) => fii.operations)
        .flat();
      const firstFiiPurchase = _.minBy(flatOperations, (o) => o.date);
      if (!firstFiiPurchase) {
        return [];
      }
      const periodFromTheBegin = differenceInMonths(now, firstFiiPurchase.date);

      months = _.range(periodFromTheBegin)
        .map((_, i) => format(subMonths(now, i), "MM/yyyy"))
        .toReversed();
    } else {
      months = _.range(period)
        .map((_, i) => format(subMonths(now, i), "MM/yyyy"))
        .toReversed();
    }
    const chartData = months.map((date) => {
      const monthDividends = this.dividends.reduce((acc, fii) => {
        const dividend = fii.monthlyDividends[date]?.total;
        if (dividend) {
          acc += dividend;
        }
        return acc;
      }, 0);
      return { date, total: monthDividends };
    });

    return chartData;
  }

  getTotalDividends() {
    return this.dividends.reduce((acc, fiiDividends) => {
      const months = Object.keys(fiiDividends.monthlyDividends);
      const totalFiiDividends = months.reduce((acc, month) => {
        acc += fiiDividends.monthlyDividends[month].total;
        return acc;
      }, 0);

      acc += totalFiiDividends;
      return acc;
    }, 0);
  }

  formatHistoryToChartData(
    fiiFilter?: string,
    cloudflareData?: ParsedCloduflareResponse,
  ) {
    if (!(this.history?.length > 0))
      return {
        chartData: [],
        yAxisDomain: [],
      };
    let chartType = "line";
    const filter = fiiFilter ?? this.history[0].fiiName;
    const flatDates = this.history[0].history.map((h) =>
      format(new Date(h.date), "dd/MM/yyyy"),
    );

    let filteredFiis = this.history.filter((fii) => fii.fiiName === filter);
    let filteredFlatDates = flatDates;

    const filterIsCustomOption = Object.values(FiisPriceChartOptions).includes(
      filter as FiisPriceChartOptions,
    );

    if (cloudflareData) {
      filteredFiis =
        cloudflareData.funds[0] === "all"
          ? this.history
          : this.history.filter((fii) =>
              cloudflareData?.funds.includes(fii.fiiName),
            );
      switch (cloudflareData?.context) {
        case "price history": {
          filteredFlatDates = flatDates.filter((date) =>
            cloudflareData?.period.includes(date.slice(3, 10)),
          );
          break;
        }
        case "dividends": {
          filteredFlatDates = cloudflareData.period;
          const filteredDividends =
            cloudflareData.funds[0] === "all"
              ? this.dividends
              : this.dividends.filter((fii) =>
                  cloudflareData?.funds.includes(fii.fiiName),
                );
          filteredFiis = filteredDividends.map((fiiDividend) => {
            return {
              fiiName: fiiDividend.fiiName,
              history: cloudflareData.period.map((month) => ({
                close: fiiDividend.monthlyDividends[month].total,
                date: new Date(),
              })),
            };
          });
          chartType = "bar";
        }
      }
    } else if (filterIsCustomOption) {
      switch (filter) {
        case FiisPriceChartOptions.AllBaseTen:
          filteredFiis = this.history.filter(
            (fii) => fii.history[0].close < 30,
          );
          break;
        case FiisPriceChartOptions.AllBaseOneHundred:
          filteredFiis = this.history.filter(
            (fii) => fii.history[0].close >= 100,
          );
          break;
        case FiisPriceChartOptions.AllBaseNinety:
          filteredFiis = this.history.filter(
            (fii) => fii.history[0].close > 30 && fii.history[0].close < 100,
          );
          break;
      }
    }

    const chartData = filteredFlatDates.map((date, index) => {
      const fiisPricingAtDateIndex = filteredFiis.reduce(
        (acc: { [key: string]: number }, fii) => {
          const close = fii.history[index]?.close;
          if (close && close > 0) {
            acc[fii.fiiName] = close;
          }
          return acc;
        },
        {},
      );
      Object.keys(fiisPricingAtDateIndex).forEach((fii) => {
        if (
          fiisPricingAtDateIndex[fii] === undefined ||
          fiisPricingAtDateIndex[fii] === 0
        ) {
          delete fiisPricingAtDateIndex[fii];
        }
      });
      return { date, ...fiisPricingAtDateIndex };
    });

    if (filteredFiis.length === 0)
      return {
        chartData: [],
        yAxisDomain: [],
      };

    const yAxisDomain = [
      (_.min(
        _.map(
          filteredFiis[0].history.filter((h) =>
            filteredFlatDates.includes(format(h.date, "dd/MM/yyyy")),
          ),
          (h) => h.close,
        ),
      ) ?? 0) - 1,
      (_.max(
        _.map(
          filteredFiis[0].history.filter((h) =>
            filteredFlatDates.includes(format(h.date, "dd/MM/yyyy")),
          ),
          (h) => h.close,
        ),
      ) ?? 0) + 1,
    ];

    return {
      yAxisDomain,
      chartData,
      chartType,
    };
  }

  nextMonthDividends() {
    return this.dividends.reduce((acc, fiiDividends) => {
      const monthKey = format(subMonths(new Date(), 1), "MM", { locale: ptBR });
      const lastMonth = `${monthKey}/${new Date().getFullYear()}`;
      acc += fiiDividends.monthlyDividends[lastMonth].total;
      return acc;
    }, 0);
  }

  getDividendsStatements(filters: StatementsFiltersData): Dividend[] {
    const filteredData =
      filters.fiiName && filters.fiiName !== "Nenhum"
        ? this.dividends.filter((fii) => fii.fiiName === filters.fiiName)
        : this.dividends;

    switch (filters.intervalType) {
      case "Mês": {
        const filter = new Date(filters.intervalValue as string);
        const selectedMonthKey = format(filter, "MM/yyyy");
        const dividends = filteredData.map(
          (fii) => fii.monthlyDividends[selectedMonthKey],
        );
        return dividends.filter((div) => div?.total && div?.total > 0);
      }
      case "Personalizado": {
        const filter = filters.intervalValue as DateInRangeModeType;
        const from = new Date(filter.from as Date);
        const to = new Date(filter.to as Date);

        const dividends = filterDividendsFromDate({
          dividends: filteredData,
          filterDateFn: (date) => date >= from && date <= to,
        });
        return dividends;
      }
      case "Todos": {
        const dividends = filterDividendsFromDate({
          dividends: filteredData,
        });

        return dividends;
      }
      case "Ano": {
        const dividends = filterDividendsFromDate({
          dividends: filteredData,
          filterDateFn: (date) =>
            date.getFullYear() === parseInt(filters.intervalValue as string),
        });
        return dividends;
      }
      case "Dias": {
        const parsedDaysValue = parseInt(filters.intervalValue as string);
        const dividends = filterDividendsFromDate({
          dividends: filteredData,
          filterDateFn: (date) => {
            const diffInDays = differenceInDays(new Date(), date);
            return diffInDays <= parsedDaysValue;
          },
        });
        return dividends;
      }
    }
  }

  getOperationsStatements(filters: StatementsFiltersData): FiisOperations[] {
    const filteredData =
      filters.fiiName && filters.fiiName !== "Nenhum"
        ? this.operations.filter((fii) => fii.fiiName === filters.fiiName)
        : this.operations;
    const flatOperations = (filteredData as FiiGroupedOperations[])
      .map((fii) => fii.operations)
      .flat();

    switch (filters.intervalType) {
      case "Mês": {
        const filteredOperations = flatOperations.filter(
          (operation) =>
            format(operation.date, "MM/yyyy") ===
            format(filters.intervalValue as Date, "MM/yyyy"),
        );
        return filteredOperations;
      }
      case "Personalizado": {
        const filter = filters.intervalValue as DateInRangeModeType;
        const from = new Date(filter.from as Date);
        const to = new Date(filter.to as Date);

        const filteredOperations = flatOperations.filter((operation) => {
          const operationDate = new Date(operation.date);
          return operationDate >= from && operationDate <= to;
        });

        return filteredOperations;
      }
      case "Todos": {
        return flatOperations;
      }
      case "Ano": {
        const filteredOperations = flatOperations.filter((operation) => {
          const operationDate = new Date(operation.date);
          return (
            operationDate.getFullYear() ===
            parseInt(filters.intervalValue as string)
          );
        });

        return filteredOperations;
      }
      case "Dias": {
        const parsedDaysValue = parseInt(filters.intervalValue as string);

        const filteredOperations = flatOperations.filter((operation) => {
          const operationDate = new Date(operation.date);
          const diffInDays = differenceInDays(new Date(), operationDate);
          return diffInDays <= parsedDaysValue;
        });
        return filteredOperations;
      }
    }
  }
}
