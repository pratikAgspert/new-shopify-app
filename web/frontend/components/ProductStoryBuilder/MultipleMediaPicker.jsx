import { useCallback, useContext, useState } from "react";
import axios from "axios";
import {
  Box,
  Image,
  VStack,
  HStack,
  IconButton,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, DragHandleIcon } from "@chakra-ui/icons";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { BASE_URL } from "../../apiHooks/baseURL";
import { AuthContext } from "../../services/context";
import { nanoid } from "nanoid";
import CircularLoader from "./CircularLoader";

const MultipleMediaPicker = ({
  type,
  dataList,
  onImagesChange,
  onDeleteImage,
  changeOrder,
  addUrlMapping, // Ensure this is passed as a prop
  isDisabled,
}) => {
  const { getToken } = useContext(AuthContext);
  const [uploadProgress, setUploadProgress] = useState({});
  const toastId = "filePickerToast";
  const toast = useToast({
    isClosable: true,
    position: "top",
    duration: 2000,
    id: toastId,
  });

  console.log("from media picker data", type, dataList);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(
      KeyboardSensor,
      {
        coordinateGetter: sortableKeyboardCoordinates,
      },
      { isDisabled: isDisabled }
    )
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      const allFiles = [];
      acceptedFiles.forEach((file) => {
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
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
        const id = nanoid();
        const tempUrl = URL.createObjectURL(file);
        allFiles.push({ url: tempUrl, id, type });
        // onImagesChange([tempUrl], type, id);
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
              setUploadProgress((prev) => ({
                ...prev,
                [id]: percentCompleted, //TODO: id
              }));
            },
          })
          .then((response) => {
            const newImageUrl = response.data.url; // Assuming the response contains the URL
            addUrlMapping(id, newImageUrl);
            setUploadProgress((prev) => {
              const { [id]: _, ...rest } = prev;
              return rest;
            });
          })
          .catch((error) => {
            console.error("Upload failed:", error);
            setUploadProgress((prev) => {
              const { [id]: _, ...rest } = prev;
              return rest;
            });
          });
      });
      onImagesChange(allFiles);
    },
    [dataList, onImagesChange, addUrlMapping]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: [
      "carousel_360_image",
      "brand_banner",
      "carousel_2d_image",
      "image_content",
      "partners",
    ].some((t) => t === type)
      ? {
          "image/jpeg": [],
          "image/png": [],
        }
      : {
          "video/mp4": [],
          "video/mov": [],
        },
    noClick: true,
    noKeyboard: true,
  });

  const removeImage = (event, id) => {
    event.stopPropagation();
    onDeleteImage(id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!isDisabled) {
      if (active.id !== over.id) {
        const oldIndex = dataList.findIndex((item) => item.id === active.id);
        const newIndex = dataList.findIndex((item) => item.id === over.id);
        changeOrder(arrayMove(dataList, oldIndex, newIndex));
      }
    }
  };

  const isPartners = type === "partners";

  return (
    <Box {...getRootProps()}>
      <input {...getInputProps()} />
      {dataList.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={dataList} strategy={rectSortingStrategy}>
            <SimpleGrid
              columns={isPartners ? [1, 2, 3, 4] : [1, 2, 3]}
              spacing={4}
            >
              {dataList.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  removeImage={removeImage}
                  type={type}
                  uploadProgress={uploadProgress[item.id]} // Pass upload progress
                  isDisabled={isDisabled}
                />
              ))}
            </SimpleGrid>
          </SortableContext>
        </DndContext>
      ) : (
        <VStack
          borderWidth={2}
          borderStyle="dashed"
          borderRadius="md"
          p={4}
          spacing={2}
          alignItems="center"
          cursor="pointer"
          onClick={() => {
            if (!isDisabled) open();
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
      <HStack mt={4} justifyContent="flex-end">
        <IconButton
          aria-label="Add more"
          icon={<AddIcon />}
          size="sm"
          onClick={open}
          isDisabled={isDisabled}
        />
      </HStack>
    </Box>
  );
};

const MediaCard = ({ item, removeImage, type, uploadProgress, isDisabled }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  const isPartners = type === "partners";

  return (
    <Card ref={setNodeRef} style={style} boxShadow={"none"}>
      <CardBody
        position="relative"
        p={0}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        bg={"transparent"}
      >
        {uploadProgress !== undefined && (
          <CircularLoader progress={uploadProgress} />
        )}
        {item.type === "video_content" ? (
          <video
            src={item.image_url}
            alt={`Selected media ${item.id}`}
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <>
            {isPartners ? (
              <Image
                src={item.image_url}
                alt={`Selected media ${item.id}`}
                width="10rem"
                height="10rem"
                objectFit="cover"
                borderRadius="full"
                boxShadow={"md"}
              />
            ) : (
              <Image
                src={item.image_url}
                alt={`Selected media ${item.id}`}
                borderRadius="md"
              />
            )}
          </>
        )}
        <IconButton
          {...attributes}
          {...listeners}
          aria-label="Pick image"
          icon={<DragHandleIcon />}
          size="sm"
          position="absolute"
          top={2}
          left={2}
          colorScheme={"gray"}
          borderRadius={isPartners ? "full" : 6}
          isDisabled={isDisabled}
        />
        <IconButton
          aria-label="Remove image"
          icon={<CloseIcon />}
          size="sm"
          position="absolute"
          top={2}
          right={2}
          borderRadius={isPartners ? "full" : 6}
          onClick={(e) => removeImage(e, item.id)}
          isDisabled={isDisabled}
        />
      </CardBody>
    </Card>
  );
};
export default MultipleMediaPicker;
