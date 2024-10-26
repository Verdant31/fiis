/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { FiisHistory, FiiSummary } from "@/types/fiis";
import { Dispatch, SetStateAction } from "react";
import { parseCloudflareResponse } from "@/utils/parse-cloudflare-response";

interface UseCloudflareModelProps {
  modelInput?: string;
  summary?: FiiSummary[];
  fiisHistory?: FiisHistory[];
  setModelInput?: Dispatch<SetStateAction<string>>;
}

export interface CloudflareModelResponse {
  result: {
    response: string;
  };
  success: boolean;
  errors: any[];
  messages: any[];
}

export type ParsedCloduflareResponse = {
  context: string;
  funds: string[];
  period: string[];
};

export const useCloudflareModel = ({
  modelInput,
  summary,
  fiisHistory,
  setModelInput,
}: UseCloudflareModelProps) => {
  const query = useQuery(
    ["cloudflare"],
    async () => {
      const { data } = await api.post("ai", {
        modelInput,
        summary,
        fiisHistory,
      });

      const result = parseCloudflareResponse({
        data: data?.response as CloudflareModelResponse,
      });

      setModelInput && setModelInput("");
      return result;
    },
    {
      refetchOnWindowFocus: false,
      enabled:
        Boolean((summary ?? [])?.length > 0) &&
        Boolean((fiisHistory ?? [])?.length > 0) &&
        Boolean(modelInput && modelInput.length > 0),
    },
  );
  return query;
};
