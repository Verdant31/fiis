import { getUserName } from "@/utils/getUserName";
import { Fii } from "@prisma/client";
import axios from "axios";

export const getFiis = async () => {
  const userName = getUserName();
  const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/getfiis", {
    params: {
      userName,
    },
  });
  return response.data.fiis as Fii[];
};
