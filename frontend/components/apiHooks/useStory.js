import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./baseURL";
import { makeRequest } from "./networkRequest";

export const useGetStory = ({ productId }) => {
  const endPoint = BASE_URL + `shopify/story/${productId}`;

  const query = useQuery({
    queryKey: ["story", productId],
    queryFn: async () => {
      return await makeRequest(endPoint, "GET", "");
    },
  });

  return { ...query };
};
