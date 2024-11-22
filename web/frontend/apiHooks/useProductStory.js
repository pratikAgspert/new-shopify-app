import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../services/context";
import { makeRequest } from "./networkRequest";
import { BASE_URL } from "./baseURL";

export const PRODUCT_LIST_QUERY_KEY = "filteredProductList";
const PRODUCT_STORY_DRAFT_QUERY_KEY = "product_story_draft";
const PUBLISH_PRODUCT_STORY_DRAFT_QUERY_KEY = "publish_product_story_draft";
const PUBLISH_PRODUCT_STORY_DRAFT_VERSION_QUERY_KEY =
  "publish_product_story_draft_version";
export const PUBLISHED_PRODUCT_STORY_QUERY_KEY = "publish_product_story";
const PUBLISH_OLD_PRODUCT_STORY_QUERY_KEY = "publish_old_product_story";

export const useGetProductStoryDraft = (storyId) => {
  const { getToken } = useContext(AuthContext);

  const query = useQuery({
    queryKey: [PRODUCT_STORY_DRAFT_QUERY_KEY, storyId],
    queryFn: async () => {
      return await makeRequest(
        BASE_URL + `/kvk/draft_product_description/${storyId}/`,
        "GET",
        getToken()
      );
    },
    enabled: !!storyId,
  });

  return {
    ...query,
  };
};

export const useSaveProductStoryDraft = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const savefun = async (formData) => {
    try {
      const data = await makeRequest(
        BASE_URL + "kvk/story_template/",
        "POST",
        getToken(),
        formData
      );
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const mutation = useMutation({
    mutationFn: savefun,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PRODUCT_STORY_DRAFT_QUERY_KEY],
      });
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  return mutation;
};

export const useEditProductStoryDraft = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutateFun = async ({ storyId, formData }) => {
    try {
      const data = await makeRequest(
        BASE_URL + `kvk/story_template/${storyId}/`,
        "PUT",
        getToken(),
        formData
      );
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const mutation = useMutation({
    mutationFn: mutateFun,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PRODUCT_STORY_DRAFT_QUERY_KEY],
      });
    },
    onError: (error) => {
      console.error("Edit error:", error);
    },
  });

  return mutation;
};

export const usePublishProductStoryDraft = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutateFun = async (storyId) => {
    try {
      const data = await makeRequest(
        BASE_URL + `kvk/draft_product_description/${storyId}/publish/`,
        "PATCH",
        getToken()
      );
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const mutation = useMutation({
    mutationFn: mutateFun,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PUBLISH_PRODUCT_STORY_DRAFT_QUERY_KEY],
      });
    },
    onError: (error) => {
      console.error("Edit error:", error);
    },
  });

  return mutation;
};

// get description versions (published)
export const useGetPublishedProductStoryVersion = (productId) => {
  const { getToken } = useContext(AuthContext);

  const query = useQuery({
    queryKey: [PUBLISH_PRODUCT_STORY_DRAFT_VERSION_QUERY_KEY, productId],
    queryFn: async () => {
      return await makeRequest(
        BASE_URL + `/kvk/product_description/versions/?product_id=${productId}`,
        "GET",
        getToken()
      );
    },
  });

  return {
    ...query,
  };
};

// get a particular description version (published or previously published)
export const useGetPublishedProductStory = (publishedStoryId) => {
  const { getToken } = useContext(AuthContext);

  const query = useQuery({
    queryKey: [PUBLISHED_PRODUCT_STORY_QUERY_KEY, publishedStoryId],
    queryFn: async () => {
      return await makeRequest(
        BASE_URL + `/kvk/product_description/${publishedStoryId}`,
        "GET",
        getToken()
      );
    },
    enabled: !!publishedStoryId,
  });

  return {
    ...query,
  };
};

// publish older version
export const usePublishOldProductStory = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutateFun = async (publishedStoryId) => {
    try {
      const data = await makeRequest(
        BASE_URL +
          `kvk/product_description/${publishedStoryId}/publish_older_version/`,
        "PATCH",
        getToken()
      );
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const mutation = useMutation({
    mutationFn: mutateFun,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PUBLISH_OLD_PRODUCT_STORY_QUERY_KEY],
      });
    },
    onError: (error) => {
      console.error("Edit error:", error);
    },
  });

  return mutation;
};

// Delete Draft of Product Story
export const useDeleteProductStoryDraft = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const deleteStoryDraft = async (draftStoryId) => {
    const endPoint = BASE_URL + `kvk/draft_product_description/${draftStoryId}`;

    try {
      const data = await makeRequest(endPoint, "DELETE", getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: deleteStoryDraft,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PRODUCT_STORY_DRAFT_QUERY_KEY],
      });
    },
  });

  return {
    ...mutation,
  };
};

// Delete Published Product Story
export const useDeletePublishedProductStory = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const deletePublishedStory = async (publishedStoryId) => {
    const endPoint = BASE_URL + `kvk/product_description/${publishedStoryId}/`;

    try {
      const data = await makeRequest(endPoint, "DELETE", getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: deletePublishedStory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PUBLISHED_PRODUCT_STORY_QUERY_KEY],
      });
    },
  });

  return {
    ...mutation,
  };
};
