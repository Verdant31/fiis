import { Percent } from "@/components/fiis/FiiWallet";
import { getUserName } from "@/utils/getUserName";
import axios from "axios";

interface InsertFiiProps {
  updatedFiis: Percent[];
}

export const updateFiiQuantities = async ({ updatedFiis }: InsertFiiProps) => {
  const userName = getUserName();
  const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/updateFiiQuantities", {
    updatedFiis,
    userName,
  });
  return response.data;
};
