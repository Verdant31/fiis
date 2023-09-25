import { getUserName } from "@/utils/getUserName";
import axios from "axios";

interface InsertFiiProps {
  fiis: {
    name: string;
    qty: string;
    purchaseDate: string;
  }[];
}

export const insertFii = async (fiis: InsertFiiProps) => {
  const userName = getUserName();
  const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/insertFii", {
    fiis,
    userName,
  });
  return response.data;
};
