import React, { useCallback, useContext, useState } from "react";
import {
  Box,
  Image,
  VStack,
  HStack,
  IconButton,
  useToast,
  Text,
  SimpleGrid,
  Progress,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { BASE_URL } from "../../apiHooks/baseURL";
import { AuthContext, ProductDriverContext } from "../../services/context";
import CircularLoader from "./CircularLoader";

const MediaPicker = ({
  type,
  selectedImages,
  onImagesChange,
  id,
  addUrlMapping,
  handleDeleteSingleMedia,
  isDisabled,
}) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const { getToken } = useContext(AuthContext);
  const toastId = "filePickerToast";
  const toast = useToast({
    isClosable: true,
    position: "top",
    duration: 2000,
    id: toastId,
  });
  const { driver } = useContext(ProductDriverContext);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

      acceptedFiles.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          // Show toast if file size exceeds 10 MB
          toast({
            id: toastId,
            status: "error",
            title: "File size too large",
            description: "Please select files smaller than 10 MB.",
          });
          return; // Exclude this file
        }

        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          const tempUrl = URL.createObjectURL(file);
          onImagesChange([tempUrl]);

          const formData = new FormData();
          formData.append("file", file);

          axios
            .post(BASE_URL + "kvk/upload_story/", formData, {
              headers: {
                Authorization: getToken(),
              },
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress((prevProgress) => ({
                  ...prevProgress,
                  [tempUrl]: percentCompleted,
                }));
              },
            })
            .then((response) => {
              const fileUrl = response.data.url;
              addUrlMapping(id, fileUrl);
              setUploadProgress((prevProgress) => {
                const { [tempUrl]: _, ...rest } = prevProgress;
                return rest;
              });
            })
            .catch((error) => {
              toast({
                id: toastId,
                status: "error",
                title: "Upload failed",
                description: "There was an error uploading the file.",
              });
              setUploadProgress((prevProgress) => {
                const { [tempUrl]: _, ...rest } = prevProgress;
                return rest;
              });
            });
        }
      });
    },
    [
      onImagesChange,
      addUrlMapping,
      toast,
      // getToken
    ]
  );

  const image_types = [
    "carousel_360_image",
    "brand_banner",
    "carousel_2d_image",
    "image_content",
  ];

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: image_types?.some((t) => t === type)
      ? {
          "image/jpeg": [],
          "image/png": [],
          "image/jpg": [],
          "image/webp": [],
        }
      : {
          "video/mp4": [],
          "video/mov": [],
        },
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
  });

  const removeImage = (index) => {
    handleDeleteSingleMedia(id);
  };

  return (
    <Box {...getRootProps()}>
      <input {...getInputProps()} />
      {selectedImages.length > 0 ? (
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {selectedImages.map((image, index) => (
            <Box key={index} position="relative">
              {image_types?.some((t) => t === type) ? (
                <Image
                  src={image}
                  alt={`Selected media ${index + 1}`}
                  borderRadius="md"
                />
              ) : (
                <video
                  src={image}
                  alt={`Selected media ${index + 1}`}
                  style={{ borderRadius: "10px" }}
                />
              )}
              <IconButton
                aria-label="Remove image"
                icon={<CloseIcon />}
                size="sm"
                position="absolute"
                top={2}
                right={2}
                onClick={() => removeImage(index)}
                isDisabled={isDisabled}
              />
              {uploadProgress[image] && (
                <CircularLoader progress={uploadProgress[image]} />
              )}
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <VStack
          borderWidth={2}
          borderStyle="dashed"
          borderRadius="md"
          p={4}
          spacing={2}
          alignItems="center"
          cursor="pointer"
          className="add-media"
          onClick={() => {
            if (!isDisabled) {
              open();
              setTimeout(() => {
                driver?.moveNext();
              }, 200);
            }
          }}
        >
          <IconButton
            aria-label="Add media"
            icon={<AddIcon />}
            size="lg"
            isDisabled={isDisabled}
          />
          <Text>
            Click to add {type === "360° Image" ? "a 360° image" : "media"}
          </Text>
        </VStack>
      )}
    </Box>
  );
};

export default MediaPicker;
