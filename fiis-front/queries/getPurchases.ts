import { getUserName } from "@/utils/getUserName";
import { PaymentHistory } from "@prisma/client";
import axios from "axios";

type GetPurchasesResponse = {
  status: number;
  purchases: {
    userName: string;
    id: number;
    fiiName: string;
    purchaseDate: string;
    qty: number;
    paymentHistory: PaymentHistory;
  }[];
  flatHistory: PaymentHistory[];
};

export const getPurchases = async () => {
  const userName = getUserName();
  const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/getPurchases", {
    params: {
      userName,
    },
  });
  return response.data as GetPurchasesResponse;
};
