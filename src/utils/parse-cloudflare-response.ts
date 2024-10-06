/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CloudflareModelResponse,
  ParsedCloduflareResponse,
} from "@/queries/use-cloudflare-model";
import { toast } from "sonner";

export const parseCloudflareResponse = ({
  data,
}: {
  data: CloudflareModelResponse;
}) => {
  let hasError = false;

  if (data?.errors?.length > 0) {
    toast.error(
      "Houve um erro ao tentar converter sua query, tente reformula-lá ou contate o administrador",
    );
    hasError = true;
  }

  const message = data?.result.response;
  const startIndex = message.indexOf("{");
  const endIndex = message.lastIndexOf("}") + 1;

  const jsonString = message.substring(startIndex, endIndex);

  const jsonObject = JSON.parse(jsonString) as ParsedCloduflareResponse;
  if (!isCloudFlareParsedResponse(jsonObject)) {
    hasError = true;
    toast.error(
      "O modelo não foi capaz de formatar seu pedido nos dados do gráfico.",
    );
  }
  if (hasError) return undefined;
  return jsonObject;
};

const isCloudFlareParsedResponse = (
  obj: any,
): obj is ParsedCloduflareResponse => {
  return (
    obj &&
    typeof obj === "object" &&
    "context" in obj &&
    "funds" in obj &&
    "period" in obj &&
    typeof obj.context === "string" &&
    Array.isArray(obj.funds) &&
    obj.funds.every((fund: any) => typeof fund === "string") &&
    Array.isArray(obj.period) &&
    obj.period.every((p: any) => typeof p === "string")
  );
};
