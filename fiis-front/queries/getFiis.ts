import { Fii } from "@prisma/client";
import axios from "axios";

export const getFiis = async () => {
  const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/getfiis");
  return response.data.fiis as Fii[];
};
