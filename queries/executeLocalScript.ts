import axios from "axios";

export const executeLocalScript = async () => {
  const response = await axios.post("api/executeLocalScript");
  return response.data;
};
