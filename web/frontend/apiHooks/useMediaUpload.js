import { useCallback, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./baseURL";
import { AuthContext } from "../services/context";
import { makeRequest } from "./networkRequest";

const generateUniqueFileName = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${randomString}`;
};

const useMediaUpload = (getToken) => {
  const toast = useToast();

  const uploadMedia = useCallback(
    async (file) => {
      console.log("file", file);
      const formData = new FormData();
      const isBlobUrl = file.startsWith("blob:");
      const fileToUpload = isBlobUrl
        ? await fetch(file).then((res) => res.blob())
        : file;
      formData.append("file", fileToUpload, generateUniqueFileName());

      try {
        const response = await fetch(BASE_URL + "kvk/upload_story/", {
          method: "POST",
          headers: {
            Authorization: getToken(),
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Upload failed");
        }

        const data = await response.json();
        console.log("after upload data", data);
        const uploadedUrl = data?.url; // Adjust based on actual response structure
        console.log("uploadedUrl on Success", uploadedUrl);
        return uploadedUrl;
      } catch (error) {
        toast({
          status: "error",
          title: "Can't upload media.",
          description: error.message,
        });
        throw error;
      }
    },
    [
      // getToken,
      toast,
    ]
  );

  return { uploadMedia };
};

export const useDeleteUnusedMediaUrls = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const deleteUnusedMedia = async (draftStoryId) => {
    const endPoint = BASE_URL + `kvk/upload_story/`;

    try {
      const data = await makeRequest(
        endPoint,
        "DELETE",
        getToken()
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: deleteUnusedMedia,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["delete_media_urls"],
      });
    },
  });

  return {
    ...mutation,
  };
};

export default useMediaUpload;
