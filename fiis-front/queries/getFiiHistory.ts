import { PaymentHistory } from "@prisma/client";
import axios from "axios";

export const getFiiHistory = async (fiiId: number) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/getFiiHistory", {
    params: {
      fiiId,
    },
  });
  return response.data.fiis as PaymentHistory[];
};
