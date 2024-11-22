import { useQuery } from "@tanstack/react-query";

export const useGetShopifyProducts = () => {
  const query = useQuery({
    queryKey: ["shopify-products"],
    queryFn: async () => {
      const response = await fetch(`/api/products`);
      return await response.json();
    },
  });
  return {
    ...query,
  };
};

export const useGetSingleProduct = (productId) => {
  const query = useQuery({
    queryKey: ["single-shopify-product", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      return await response.json();
    },
    enabled: !!productId,
  });
  return {
    ...query,
  };
};
