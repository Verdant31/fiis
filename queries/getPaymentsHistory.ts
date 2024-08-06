import { PaymentHistory } from "@prisma/client";
import axios from "axios";

export const getPaymentsHistory = async () => {
  const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/getPaymentsHistory");
  return response.data.history as PaymentHistory[];
};
