import { PaymentHistory } from "@prisma/client";
import axios from "axios";

export const getFiiHistory = async (fiiName: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/getFiiHistory", {
    params: {
      fiiName,
    },
  });
  return response.data.fiis as PaymentHistory[];
};
