import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetThemes = () => {
  const query = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const response = await fetch("/api/themes");
      return await response.json();
    },
  });
  return {
    ...query,
  };
};

export const useGetProductThemeEditor = () => {
  const query = useQuery({
    queryKey: ["product-sections-theme"],
    queryFn: async () => {
      const response = await fetch("/api/themes/product-sections");
      return await response.json();
    },
  });
  return {
    ...query,
  };
};

export const useProductMetafields = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (products) => {
      const response = await fetch("/api/themes/update-metafields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update metafields");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metafields"] });
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });

  return mutation;
};
