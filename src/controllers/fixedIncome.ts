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
import { FixedIncomeWithEvolution } from "@/types/fixed-income";

export class FixedIncomeController {
  public operations: FixedIncomeWithEvolution[] = [];

  constructor(data: Partial<FixedIncomeController>) {
    Object.assign(this, data);
  }

  getTotalValueInvested() {
    return this.operations.reduce(
      (acc, operation) => {
        acc.total += operation.investedValue;
        acc.currentTotal += operation.latestValue;
        return acc;
      },
      { total: 0, currentTotal: 0 },
    );
  }
}
