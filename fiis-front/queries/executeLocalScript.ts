import { getUserName } from "@/utils/getUserName";
import axios from "axios";

export const executeLocalScript = async () => {
  const userName = getUserName();
  const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/executeLocalScript", {
    path: process.env.NEXT_PUBLIC_LOCAL_SCRIPT_PATH,
    userName,
  });
  return response.data;
};
