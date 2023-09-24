import axios from "axios";

interface InsertFiiProps {
  fiis: {
    name: string;
    qty: string;
  }[];
}

export const insertFii = async (fiis: InsertFiiProps) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/insertFii", {
    fiis,
  });
  return response.data;
};
