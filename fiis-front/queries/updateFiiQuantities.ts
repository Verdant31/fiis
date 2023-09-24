import { Percent } from "@/components/fiis/FiiWallet";
import axios from "axios";

interface InsertFiiProps {
  updatedFiis: Percent[];
}

export const updateFiiQuantities = async ({ updatedFiis }: InsertFiiProps) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/updateFiiQuantities", {
    updatedFiis,
  });
  return response.data;
};
