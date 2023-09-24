import axios from "axios";

export const executeLocalScript = async () => {
  const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/executeLocalScript", {
    path: process.env.NEXT_PUBLIC_LOCAL_SCRIPT_PATH,
  });
  return response.data;
};
