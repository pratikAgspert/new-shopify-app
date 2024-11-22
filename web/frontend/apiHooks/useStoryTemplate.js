import { useContext } from "react";
import { BASE_URL } from "../apiHooks/baseURL";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../services/context";
import { makeRequest } from "./networkRequest";

export const STORY_TEMPLATE_QUERY_KEY = "story-template";
export const useStoryTemplate = () => {
  const { getToken, getShop } = useContext(AuthContext);
  const endPoint = BASE_URL + `kvk/story_template?shop_name=${getShop()}`;

  const query = useQuery({
    queryKey: [STORY_TEMPLATE_QUERY_KEY],
    queryFn: async () => {
      const templateList = await makeRequest(endPoint, "GET", getToken());
      return templateList;
    },
    enabled: !!getShop(),
  });

  return { ...query };
};

export const useUpdateStoryTemplate = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const endPoint = BASE_URL + `kvk/story_template/`;

  const updateStoryTemplate = async ({ id, formData }) => {
    const data = await makeRequest(
      endPoint + `${id}/publish/`,
      "PUT",
      getToken(),
      formData
    );
    return data;
  };

  const mutation = useMutation({
    mutationFn: updateStoryTemplate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [STORY_TEMPLATE_QUERY_KEY],
      });
    },
  });

  return mutation;
};

export const useGetTemplateStory = (templateId) => {
  const { getToken } = useContext(AuthContext);
  const endPoint = BASE_URL + `kvk/story_template/${templateId}/`;

  const query = useQuery({
    queryKey: [STORY_TEMPLATE_QUERY_KEY, templateId],
    queryFn: async () => {
      const data = await makeRequest(endPoint, "GET", getToken());
      return data;
    },
    enabled: !!templateId,
  });

  return { ...query };
};

export const usePublishStoryTemplate = () => {
  const { getToken } = useContext(AuthContext);
  const endPoint = BASE_URL + `kvk/story_template/`;

  const publishStoryTemplate = async ({ id, formData }) => {
    const data = await makeRequest(
      endPoint + `${id}/publish/`,
      "PUT",
      getToken(),
      formData
    );
    return data;
  };
};
