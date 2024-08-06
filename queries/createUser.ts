import axios from "axios";

export const createUser = async (name: string) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/createUser", {
    name,
  });
  return response.data;
};
