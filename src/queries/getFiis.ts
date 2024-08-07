import { Fii } from "@/lib/types";
import axios from "axios";

export const getFiis = async () => {
  const response = await axios.get("api/getfiis");
  return response.data.fiis as Fii[];
};
