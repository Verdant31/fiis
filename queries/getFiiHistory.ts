import axios from "axios";

export type PaymentFiiHistory = {
  fiiName: string;
  id: number;
  purchaseDate: string;
  qty: number;
  paymentHistory: {
    id: number;
    date: string;
    value: number;
    closure: number;
    qty: number;
    fiisPurchasesId: number;
  }[];
};

export const getFiiHistory = async (fiiId: number) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/getFiiHistory", {
    params: {
      fiiId,
    },
  });
  return response.data.fiis as PaymentFiiHistory[];
};
