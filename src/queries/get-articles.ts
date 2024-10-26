import { api } from "@/lib/axios";
import { Article } from "@/types/fiis";
import { toast } from "sonner";

export const getArticles = async () => {
  const response = await api.get("get-news");
  if (response?.data.status !== 200) {
    toast.error(response?.data?.message);
    return [];
  }
  return response.data.articles as Article[];
};
