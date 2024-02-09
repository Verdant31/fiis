import { Field } from "@/components/fiis/InsertFiiModal";
import axios from "axios";


export const insertFii = async (fields: Field[]) => {
  const response = await axios.post("api/insertFii", {
    fiis: fields,
  });
  return response.data;
};
