import { ParsedCloduflareResponse } from "@/queries/use-cloudflare-model";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const isCloudFlareParsedResponse = (
  parsedObject: any,
): parsedObject is ParsedCloduflareResponse => {
  return (
    parsedObject &&
    typeof parsedObject.context === "string" &&
    Array.isArray(parsedObject.funds) &&
    parsedObject.funds.every((fund: any) => typeof fund === "string") &&
    Array.isArray(parsedObject.period) &&
    parsedObject.period.every((p: any) => typeof p === "string")
  );
};
