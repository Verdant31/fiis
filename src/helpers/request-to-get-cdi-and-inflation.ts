/* eslint-disable @typescript-eslint/no-explicit-any */
import { FixedIncomeOperations } from "@prisma/client";
import { formatRawInflationData } from "./format-raw-inflation-data";
import { formatRawCdiData } from "./format-raw-cdi-data";

export const requestToGetCdiAndInflation = async (
  oldestOperation: FixedIncomeOperations,
) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const inflationResponse = await fetch(
        process.env.INFLATION_API_URL as string,
      );
      const cdiResponse = await fetch(process.env.CDB_API_URL as string);

      if (!inflationResponse.ok || !cdiResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const formatedInflation = await formatRawInflationData(
        inflationResponse,
        oldestOperation,
      );
      const formatedCdi = await formatRawCdiData(cdiResponse, oldestOperation);

      return {
        inflation: formatedInflation,
        cdi: formatedCdi,
      };
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
      retries++;
      if (retries < maxRetries) {
        console.log(`Retrying (${retries}/${maxRetries})...`);
      } else {
        console.error("Max retries reached, unable to fetch data.");
      }
    }
  }
};
