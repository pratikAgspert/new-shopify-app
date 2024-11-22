import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import {
  VStack,
  Box,
  Stack,
  Tag,
  HStack,
  Button,
  useToast,
  IconButton,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import ContentCard from "./ContentCard";
import AddContentButton from "./AddContentButton";
import { nanoid } from "nanoid";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import CarouselComponent from "../ProductStoryVisualizer/CarouselComponent";
import {
  PUBLISHED_PRODUCT_STORY_QUERY_KEY,
  useEditProductStoryDraft,
  useGetProductStoryDraft,
  useGetPublishedProductStory,
  usePublishProductStoryDraft,
  useSaveProductStoryDraft,
  PRODUCT_LIST_QUERY_KEY,
} from "../../apiHooks/useProductStory";
import { useDeleteUnusedMediaUrls } from "../../apiHooks/useMediaUpload";
import DeleteConfirmationAlertDialog from "../Generic/DeleteConfirmationAlertDialog";
import { FormInput } from "../Generic/ControlledFormControls";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import StoryFormSelect from "../Generic/StoryFormSelect";
import {
  updateImageUrls,
  filterCarouselTypes,
  template,
  stories,
  filterStoryData,
  getLocalStorageData,
  handleSavedOrPublishData,
  storeInLocalStorage,
  templates,
} from "./storyUtils";
import { IoIosAdd } from "react-icons/io";
import {
  AuthContext,
  ProductDriverContext,
  ProductStoryContext,
} from "../../services/context";
import DraggableSection from "./DraggableSection";
import {
  isValidMotionProp,
  motion,
  useAnimate,
  useSpring,
} from "framer-motion";
import { FaRegEdit, FaSave } from "react-icons/fa";
import { LuImport } from "react-icons/lu";
import { useSearchParams } from "react-router-dom";
import {
  useGetTemplateStory,
  useStoryTemplate,
} from "../../apiHooks/useStoryTemplate";
import { IoClose, IoCloudUploadSharp } from "react-icons/io5";
import SeoEditor from "./SeoEditor";
import GlobalStyleEditor from "./GlobalStyleEditor";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const ContentBuilder = ({
  productId,
  productDisplayId,
  onClose,
  draftStoryId = null,
  publishedStoryId = null,
  formMethods,
  handleCloseModal,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { mutate: saveProductStory, isPending: isSaveProductStoryPending } =
    useSaveProductStoryDraft();

  const { mutate: editProductStory, isPending: isEditProductStoryPending } =
    useEditProductStoryDraft();

  const {
    mutate: publishProductStory,
    isPending: isPublishProductStoryPending,
  } = usePublishProductStoryDraft();

  const templateId = searchParams.get("templateId") || null;

  const {
    data: productStoryDraft,
    isPending: isProductStoryDraftPending,
    isError: isProductStoryDraftError,
  } = useGetProductStoryDraft(Number(templateId));

  const {
    data: publishedStory,
    isPending: isPublishedStoryPending,
    isError: isPublishedStoryError,
  } = useGetPublishedProductStory(publishedStoryId);

  const {
    data: templateStory,
    isPending: isTemplateStoryPending,
    isError: isTemplateStoryError,
  } = useGetTemplateStory(Number(templateId));

  const {
    mutate: deleteUnusedMediaUrls,
    isPending: isDeleteUnusedMediaUrlsPending,
  } = useDeleteUnusedMediaUrls();

  // a state for storing the local and remote url of the image against the id
  const [urlMap, setUrlMap] = useState([]);

  // a state for storing the unused remote urls so that they can be deleted later against id
  const [unusedRemoteUrls, setUnusedRemoteUrls] = useState({});

  const [contents, setContents] = useState([]);

  const [sheetData, setSheetData] = useState([]);

  const { control, watch, setValue, getValues, setError } = formMethods;

  const { getShop } = useContext(AuthContext);

  useEffect(() => {
    if (templateStory) {
      handleSavedOrPublishData(
        templateStory,
        setContents,
        setSheetData,
        filterCarouselTypes,
        templateStory?.name
      );

      localStorage.setItem("storyName", templateStory?.name);
      setValue("storyName", templateStory?.name);

      searchParams.delete("edit");
      setSearchParams(searchParams.toString());
    }
  }, [templateStory]);

  const currentStory = watch("stories");

  useEffect(() => {
    // Always check localStorage first when switching to draft
    if (!templateStory) {
      const { contentData, sheetData, storyName } = getLocalStorageData();
      setContents(contentData);
      setSheetData(sheetData);
      if (storyName) {
        setValue("storyName", storyName);
      }
      return;
    }

    if (templateStory) {
      const { data, general_sheet, is_general_sheet } =
        templateStory?.description;

      localStorage.setItem("storyName", templateStory?.name);
      setValue("storyName", templateStory?.name);

      if (is_general_sheet) {
        setContents(data || []);
        setSheetData(general_sheet || []);
      } else {
        const filterCarouselData = data.filter((c) =>
          filterCarouselTypes.includes(c?.type)
        );
        const filterSheetData = data.filter(
          (c) => !filterCarouselTypes.includes(c?.type)
        );

        console.log("Filtered Data:", {
          carousel: filterCarouselData,
          sheet: filterSheetData,
        });

        setContents(filterCarouselData || []);
        setSheetData(filterSheetData || []);
      }
    } else {
      // Set empty arrays when no storyData is available
      setContents([]);
      setSheetData([]);
      setValue("storyName", undefined);
    }
  }, [templateStory]);

  const toastId = "productStoryToastId";
  const toastConfig = {
    isClosable: true,
    position: "top",
    duration: 2000,
    id: toastId,
  };
  const toast = useToast(toastConfig);
  const toast2 = useToast(toastConfig);

  console.log("state carousel builder", unusedRemoteUrls, urlMap);
  const addUrlMapping = useCallback((id, url) => {
    setUrlMap((prevMap) => {
      const newUrlMapping = {
        ...prevMap,
        [id]: url,
      };

      storeInLocalStorage(`urlMap`, newUrlMapping);
      return newUrlMapping;
    });
  }, []);

  const addUnusedRemoteUrl = useCallback((id, url) => {
    setUnusedRemoteUrls((prevMap) => ({
      ...prevMap,
      [id]: url,
    }));
  }, []);

  const removeFromLocalStorage = (keyName) => {
    localStorage.removeItem(`${keyName}`);
  };

  const addContent = (type) => {
    if (
      [
        "carousel_360_image",
        "carousel_360_video",
        "carousel_2d_image",
        "carousel_2d_video",
      ].includes(type)
    ) {
      setContents((prevContents) => {
        const newContents = [
          ...prevContents,
          {
            id: nanoid(),
            type,
            header: "",
            isActive: true,
            infoPoints: {},
            data: [
              {
                id: nanoid(),
                type,
                image_url: "",
              },
            ],
          },
        ];

        storeInLocalStorage(`content`, newContents);

        return newContents;
      });
      return;
    }
    // If the type is not in the template, create an empty object
    const contentData = template[type] ? template[type] : {};

    setSheetData((prevSheetData) => {
      const newSheetData = [
        ...prevSheetData,
        {
          id: nanoid(),
          type,
          ...contentData,
          header: "",
          isActive: true,
          data:
            type === "brand_banner"
              ? [
                  {
                    id: nanoid(),
                    type,
                    image_url: "",
                  },
                ]
              : [],
        },
      ];

      storeInLocalStorage(`sheet`, newSheetData);

      return newSheetData;
    });
  };

  const updateContent = async (id, newData) => {
    setContents((prevContents) => {
      const newContents = prevContents.map((content) =>
        content.id === id ? { ...content, ...newData } : content
      );

      storeInLocalStorage(`content`, newContents);

      return newContents;
    });
  };

  const updateSheetData = async (id, newData) => {
    setSheetData((prevSheetData) => {
      const newSheetData = prevSheetData.map((content) =>
        content.id === id ? { ...content, ...newData } : content
      );

      storeInLocalStorage(`sheet`, newSheetData);

      return newSheetData;
    });
  };

  const deleteContent = (id) => {
    //TODO: collect all the media urls of the content and add them to the unusedRemoteUrls
    setContents((prevContents) => {
      const newContents = prevContents.filter((content) => content.id !== id);

      storeInLocalStorage(`content`, newContents);

      if (newContents?.length === 0 && sheetData?.length === 0) {
        removeFromLocalStorage("storyName");
        setValue("storyName", undefined);
      }

      return newContents;
    });
    setSheetData((prevSheetData) => {
      const newSheetData = prevSheetData.filter((content) => content.id !== id);
      storeInLocalStorage(`sheet`, newSheetData);

      if (contents?.length === 0 && newSheetData?.length === 0) {
        removeFromLocalStorage("storyName");
        setValue("storyName", undefined);
      }

      return newSheetData;
    });
  };

  const handleSaveAndEditProductStory = async (action = "save") => {
    const storyName = getValues("storyName");
    if (!storyName?.trim()) {
      toast({
        status: "error",
        title: "Please enter a name for the story.",
      });
      setError("storyName", {
        type: "required",
        message: "Please enter a name for the story.",
      });
      return;
    }
    const [replacedContentData, usedKeys] = updateImageUrls(contents, urlMap);
    const [replacedSheetData, usedSheetKeys] = updateImageUrls(
      sheetData,
      urlMap
    );
    const allUsedKeys = [...usedKeys, ...usedSheetKeys];
    const allUnusedUrls = Object.entries(urlMap)
      .filter(([key]) => !allUsedKeys.includes(key))
      .map(([_, value]) => value);
    // Delete Unused Media urls
    if (allUnusedUrls?.length !== 0) {
      deleteUnusedMediaUrls(allUnusedUrls, {
        onSuccess: (data) => {
          console.log("Successfully Deleted Unused Media Urls: ", data);
        },
        onError: (error) => {
          console.log("DELETE MEDIA URLS ERROR: ", error.message);
        },
      });
    }

    const story = {
      name: storyName,
      shop_name: getShop(),
      description: {
        data: replacedContentData,
        is_general_sheet: true,
        general_sheet: replacedSheetData,
      },
    };

    if (!templateId) {
      saveProductStory(story, {
        onSuccess: (data) => {
          console.log("NEW PRODUCT STORY saved: ", data);
          // if (action === "publish") {
          //   handlePublishProductStory(data?.id);
          // }

          toast({
            status: "success",
            title: `Story ${storyName} has been saved.`,
          });

          queryClient.invalidateQueries({
            queryKey: [PRODUCT_LIST_QUERY_KEY],
          });

          removeFromLocalStorage(`content`);
          removeFromLocalStorage(`sheet`);
          removeFromLocalStorage(`urlMap`);
          removeFromLocalStorage(`storyName`);

          window.location.href = `/stories?templateId=${data?.id}`;
        },
        onError: (error) => {
          toast({
            status: "error",
            title: "Can't save new Product Story.",
            description:
              error?.message ?? "An error occurred while saving product story.",
          });
        },
      });
    } else {
      editProductStory(
        {
          storyId: templateId, //TODO: change to story name
          formData: { description: story?.description, name: storyName },
        },
        {
          onSuccess: (data) => {
            console.log("Edited PRODUCT STORY: ", data);
            // if (action === "publish") {
            //   handlePublishProductStory(data?.id);
            // }

            toast({
              status: "success",
              title: `Story ${storyName} has been edited.`,
            });
            removeFromLocalStorage(`content`);
            removeFromLocalStorage(`sheet`);
            removeFromLocalStorage(`urlMap`);
            removeFromLocalStorage(`storyName`);

            window.location.href = `/stories?templateId=${data?.id}`;
          },
          onError: (error) => {
            toast({
              status: "error",
              title: "Can't edit Product Story.",
              description:
                error?.message ??
                "An error occurred while editing product story.",
            });
          },
        }
      );
    }
  };

  const isDisabled = false;

  const handleAlertClose = useCallback(() => {
    setValue("isAlertOpen", false);
    setValue("hasShownSavedAlert", true);
  }, [setValue]);

  const updateInfoPointText = useCallback(
    (slideId, pointId, text) => {
      console.log("CALLED: => updateInfoPointText");
      setContents((prevContents) => {
        const newContents = prevContents.map((content) => {
          if (content.id === slideId) {
            return {
              ...content,
              infoPoints: {
                ...content.infoPoints,
                [pointId]: { ...content.infoPoints[pointId], text },
              },
            };
          }
          return content;
        });

        storeInLocalStorage(`content`, newContents);
        return newContents;
      });
    },
    [productId]
  );

  const addInfoPoint = useCallback(
    (slideId, pointId, point) => {
      console.log("CALLED: => addInfoPoint");
      console.log(
        "addInfoPoint called with slideId",
        slideId,
        "and point",
        point
      );
      setContents((prevContents) => {
        const newContents = prevContents.map((content) => {
          if (content.id === slideId) {
            return {
              ...content,
              infoPoints: {
                ...content.infoPoints,
                [pointId]: point,
              },
            };
          }
          return content;
        });

        storeInLocalStorage(`content`, newContents);
        return newContents;
      });
    },
    [productId]
  );

  const removeInfoPoint = useCallback(
    (slideId, pointId) => {
      console.log("CALLED: => removeInfoPoint");
      setContents((prevContents) => {
        const newContents = prevContents.map((content) => {
          if (content.id === slideId) {
            const { [pointId]: removed, ...restInfoPoints } =
              content.infoPoints;
            return {
              ...content,
              infoPoints: restInfoPoints,
            };
          }
          return content;
        });

        storeInLocalStorage(`content`, newContents);
        return newContents;
      });
    },
    [productId]
  );

  const getInfoPoints = useCallback(
    (slideId) => {
      return (
        contents.find((content) => content.id === slideId)?.infoPoints || {}
      );
    },
    [contents]
  );

  const [styles, setStyles] = useState({
    background_color: "#ffffff",
    handle_color: "#808080",
    font_family: "Poppins",
    lineHeight: 1,
  });

  const handleStyleChange = (newStyles) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      ...newStyles,
    }));
  };

  // Create a context value object
  const productStoryContextValue = {
    addInfoPoint,
    removeInfoPoint,
    getInfoPoints,
    updateInfoPointText,
    isDisabled,
    styles,
    handleStyleChange,
  };

  const handleCarouselReorder = useCallback(
    (newItems) => {
      setContents(newItems);
      storeInLocalStorage(`content`, newItems);
    },
    [productId]
  );

  const handleSheetReorder = useCallback(
    (newItems) => {
      setSheetData(newItems);
      storeInLocalStorage(`sheet`, newItems);
    },
    [productId]
  );

  const isNoData = templateId === null;

  const isNoCardAdded = contents?.length === 0 && sheetData?.length === 0;

  const driverObj = driver({
    steps: [
      {
        element: ".add-story-content-btn",
        popover: {
          title: "Add Content",
          description: "Click to add content to the story",
          onNextClick: () => {
            const button = document.querySelector(".add-story-content-btn");
            button?.click();
            driverObj?.moveNext();
            return false;
          },
        },
      },
      {
        element: ".add-360-image",
        popover: {
          title: "Add Slide",
          description: "Click to add a slide",
          onNextClick: () => {
            const button = document.querySelector(".add-360-image");
            button?.click();
          },
        },
      },
      {
        element: ".add-media",
        popover: {
          title: "Add Media",
          description: "Click to add media",
          onNextClick: () => {
            const button = document.querySelector(".add-media");
            button?.click();
          },
        },
      },
      {
        element: ".story-name",
        popover: {
          title: "Story Name",
          description: "Click to add a story name",
          onNextClick: () => {
            const input = document.querySelector(".story-name");
            input?.focus();
            driverObj?.moveNext();
          },
        },
      },
      {
        element: ".scene-container",
        popover: {
          title: "360° View",
          description:
            "Click to add information pointers and drag to view the scene",
          onNextClick: () => {
            driverObj?.moveNext();
          },
        },
      },
      {
        element: ".save-btn",
        popover: {
          title: "Save Draft",
          description: "Click to save the draft",
          onNextClick: () => {
            const button = document.querySelector(".save-btn");
            button?.click();
            setTimeout(() => {
              driverObj?.moveNext();
            }, 500);
          },
        },
      },
      {
        element: ".confirm-save-btn",
        popover: {
          title: "Confirm Save",
          description: "Click to confirm save",
          onNextClick: () => {
            const button = document.querySelector(".confirm-save-btn");
            button?.click();
            setTimeout(() => {
              //TODO: must be attached to save onSuccess callback
              driverObj?.moveNext();
              window.location.href = "/stories";
            }, 500);
          },
        },
      },
    ],
    allowClose: true,
    overlayClickNext: false,
    keyboardControl: false,
    doneBtnText: "Finish",
  });

  useEffect(() => {
    const hasRunBefore = localStorage.getItem("driverHasRun-storyBuilder");

    if (!hasRunBefore) {
      localStorage.setItem("driverHasRun-storyBuilder", "true");

      setTimeout(() => {
        driverObj?.drive();
      }, 200);
    }

    const savedStoryName = localStorage.getItem("storyName");
    if (savedStoryName) {
      setValue("storyName", savedStoryName);
    }
  }, []);

  const watchStoryName = watch("storyName");

  useEffect(() => {
    if (watchStoryName) {
      localStorage.setItem("storyName", watchStoryName);
    }
  }, [watchStoryName]);

  // useEffect(() => {
  //   if (contents?.length === 0 && sheetData?.length === 0) {
  //     removeFromLocalStorage("storyName");
  //     setValue("storyName", undefined);
  //   }
  // }, [contents, sheetData]);

  return (
    <ProductStoryContext.Provider value={productStoryContextValue}>
      <ProductDriverContext.Provider value={{ driver: driverObj }}>
        <Box display="flex" h="98dvh" w={"100%"} overflow={"hidden"}>
          <Box
            width="60%"
            position="relative"
            h="100%"
            paddingX={10}
            overflowX={"hidden"}
            overflowY={"scroll"}
            pb={"50px"}
          >
            <HStack
              position="sticky"
              justifyContent={"flex-end"}
              top={10}
              right={4}
              zIndex={10}
            >
              {isDisabled ? (
                // Edit Button
                <Box>
                  <IconButton
                    className="edit-story-btn"
                    icon={<FaRegEdit />}
                    colorScheme="teal"
                    size="lg"
                    isRound
                    onClick={() => setValue("isAlertOpen", true)}
                    isDisabled={isNoData}
                  />
                </Box>
              ) : (
                <Stack
                  alignItems={"end"}
                  position={"absolute"}
                  right={0}
                  top={0}
                >
                  <HStack>
                    <GlobalStyleEditor />

                    <AddContentButton
                      onAdd={addContent}
                      sheetData={sheetData}
                      isDisabled={isDisabled}
                    />
                  </HStack>

                  <SeoEditor />
                </Stack>
              )}
            </HStack>

            {!templateStory ||
              ((contents && sheetData)?.length === 0 && (
                <ImportStorySection
                  formMethods={formMethods}
                  productId={productId}
                  isDisabled={isDisabled}
                  draftStoryId={draftStoryId}
                  publishedStoryId={publishedStoryId}
                  contents={contents}
                  sheetData={sheetData}
                  isSavedLoading={isProductStoryDraftPending}
                  isPublishedLoading={isPublishedStoryPending}
                  onSelectTemplate={() => {
                    const template = watch("template");

                    if (template)
                      handleSavedOrPublishData(
                        template,
                        setContents,
                        setSheetData,
                        filterCarouselTypes,
                        productId
                      );
                  }}
                  onImportSaveClick={() =>
                    handleSavedOrPublishData(
                      productStoryDraft,
                      setContents,
                      setSheetData,
                      filterCarouselTypes,
                      productId
                    )
                  }
                  onImportPublishClick={() =>
                    handleSavedOrPublishData(
                      publishedStory,
                      setContents,
                      setSheetData,
                      filterCarouselTypes,
                      productId
                    )
                  }
                />
              ))}

            <VStack mt={24} spacing={4} align="stretch">
              {(contents.length > 0 || sheetData.length > 0) && (
                <FormInput
                  className="story-name"
                  inputName={"storyName"}
                  label={"Story Name"}
                  placeholder={"Story Name"}
                  control={control}
                  formControlProps={{ isRequired: true }}
                  validationRules={{
                    required: {
                      value: true,
                      message: "Please enter a name for the product.",
                    },
                  }}
                />
              )}

              <DraggableSection
                items={contents}
                onReorder={handleCarouselReorder}
                sectionTitle="Carousel Section"
                isDragDisabled={isDisabled}
                isDisabled={isDisabled}
                renderItem={(content) => (
                  <ContentCard
                    {...content}
                    addUrlMapping={addUrlMapping}
                    addUnusedRemoteUrl={addUnusedRemoteUrl}
                    onUpdate={(newData) => updateContent(content.id, newData)}
                    onDelete={() => deleteContent(content.id)}
                    isCarousel
                    isDisabled={isDisabled}
                    formMethods={formMethods}
                  />
                )}
              />

              <DraggableSection
                items={sheetData}
                onReorder={handleSheetReorder}
                sectionTitle="Bottom Sheet Section"
                isDragDisabled={isDisabled}
                isDisabled={isDisabled}
                renderItem={(content) => (
                  <ContentCard
                    {...content}
                    addUrlMapping={addUrlMapping}
                    addUnusedRemoteUrl={addUnusedRemoteUrl}
                    onUpdate={(newData) => updateSheetData(content.id, newData)}
                    onDelete={() => deleteContent(content.id)}
                    isDisabled={isDisabled}
                    formMethods={formMethods}
                  />
                )}
              />
            </VStack>
          </Box>

          <Stack width="40%" h="100%" alignItems={"center"} spacing={1}>
            <Stack
              w={"277.4px"}
              h={"572.85px"}
              borderWidth={5}
              borderColor={"black"}
              borderRadius={50}
              overflow={"hidden"}
              boxShadow={"lg"}
              position={"relative"}
            >
              <CarouselComponent
                productData={contents}
                defaultSheetData={sheetData}
              />
            </Stack>

            <Stack position={"absolute"} right={5} bottom={8}>
              {/* Save Button */}
              <Popover trigger="hover" placement="top">
                <PopoverTrigger>
                  <Box>
                    <DeleteConfirmationAlertDialog
                      triggerClassName="save-btn"
                      confirmClassName="confirm-save-btn"
                      cancelClassName="cancel-save-btn"
                      alertTitle={"Confirm Save Draft!"}
                      alertDescription={
                        "Are you sure you want to save this product story?"
                      }
                      IconButton
                      triggerButtonProps={{
                        isIconButton: true,
                        icon: <FaSave fontSize={24} />,
                        padding: 5,

                        colorScheme: "blue",
                        variant: "solid",
                        flex: 1,
                        label: "Save",
                        isDisabled:
                          (contents || sheetData).length === 0 || isDisabled,
                      }}
                      onConfirm={() => {
                        handleSaveAndEditProductStory();
                        if (driverObj?.hasNextStep()) {
                          window.location.href = "/stories";
                          driverObj?.moveNext();
                        }
                      }}
                      isPending={
                        isSaveProductStoryPending ||
                        isEditProductStoryPending ||
                        isPublishProductStoryPending
                      }
                      confirmButtonProps={{
                        label: "Save",
                        colorScheme: "gray",
                      }}
                    />
                  </Box>
                </PopoverTrigger>

                {((contents || sheetData).length === 0 || isDisabled) && (
                  <PopoverContent>
                    <PopoverBody>
                      <Stack>
                        {currentStory === "draft" ? (
                          <Text mb={0}>
                            Save is disabled. Ensure you have added atleast one
                            slide.
                          </Text>
                        ) : null}
                      </Stack>
                    </PopoverBody>
                  </PopoverContent>
                )}
              </Popover>
            </Stack>
          </Stack>
        </Box>
      </ProductDriverContext.Provider>
    </ProductStoryContext.Provider>
  );
};

const CurrentStoryTag = ({ currentStory }) => {
  const MotionTag = motion(Tag);
  const hasAnimatedRef = useRef(false);

  const resetAnimationFlag = useCallback(() => {
    hasAnimatedRef.current = false;
  }, []);

  useEffect(() => {
    resetAnimationFlag();
  }, [currentStory, resetAnimationFlag]);

  return (
    <MotionTag
      mb={0}
      alignSelf={"center"}
      fontWeight={"600"}
      fontSize={18}
      px={5}
      py={2.5}
      borderRadius={"full"}
      borderLeftRadius={0}
      boxShadow={"md"}
      gap={2}
      bg={"#F4F4F4"}
      color={"#333333"}
      initial={!hasAnimatedRef.current ? "hidden" : "visible"}
      animate={!hasAnimatedRef.current ? "visible" : "visible"}
      variants={{
        hidden: { x: -100, opacity: 0 },
        visible: { x: 0, opacity: 1 },
      }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        hasAnimatedRef.current = true;
      }}
    >
      Product Story Builder
      <Text mb={0} textTransform={"capitalize"}>
        ( {currentStory} )
      </Text>
    </MotionTag>
  );
};

const ImportStorySection = ({
  productId,
  isDisabled,
  draftStoryId,
  publishedStoryId,
  contents,
  sheetData,
  onImportSaveClick,
  onImportPublishClick,
  onSelectTemplate,
  formMethods,
  isSavedLoading,
  isPublishedLoading,
}) => {
  const [isLocalStorageEmpty, setIsLocalStorageEmpty] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: storyTemplates,
    isPending: isStoryTemplatesPending,
    isError: isStoryTemplatesError,
  } = useStoryTemplate();
  console.log("storyTemplates: ", storyTemplates);

  const { setValue, watch, getValues } = formMethods;

  useEffect(() => {
    const localContentDataString = localStorage.getItem(`content`);

    const localSheetDataString = localStorage.getItem(`sheet`);

    if (!localContentDataString && !localSheetDataString) {
      setIsLocalStorageEmpty(true);
    } else {
      const localContentData =
        JSON.parse(localContentDataString || "[]").length === 0;
      const localSheetData =
        JSON.parse(localSheetDataString || "[]").length === 0;

      localContentData && localSheetData
        ? setIsLocalStorageEmpty(true)
        : setIsLocalStorageEmpty(false);
    }
  }, [contents, sheetData]);

  return (
    <>
      {!isDisabled && isLocalStorageEmpty && (
        <Stack h={"70%"} justifyContent={"center"} alignItems={"center"}>
          <Stack w={"40%"}>
            <Accordion allowToggle index={isOpen ? 0 : -1}>
              <AccordionItem border={"none"}>
                <Stack spacing={0}>
                  <AccordionButton
                    padding={0}
                    borderRadius={100}
                    borderBottomRadius={isOpen && 0}
                    onClick={onToggle}
                  >
                    <Button
                      leftIcon={<LuImport />}
                      fontSize={20}
                      borderRadius={!isOpen && 100}
                      borderBottomRadius={isOpen && 5}
                      borderTopRadius={isOpen && 35}
                      py={7}
                      bg={"#F4F4F4"}
                      color={"#333333"}
                      w={"100%"}
                      isLoading={isStoryTemplatesPending}
                      isDisabled={
                        isStoryTemplatesPending || isStoryTemplatesError
                      }
                    >
                      Template
                    </Button>
                  </AccordionButton>
                </Stack>

                <AccordionPanel padding={0} mt={"5px"}>
                  <Stack
                    minH={"3rem"}
                    maxH={"10rem"}
                    overflowY={"scroll"}
                    border={"0.5px solid lightgray"}
                    borderRadius={10}
                    padding={1.5}
                  >
                    {storyTemplates?.length === 0 && (
                      <Text
                        mb={0}
                        color={"gray"}
                        fontSize={"small"}
                        alignSelf={"center"}
                      >
                        No Templates
                      </Text>
                    )}

                    {storyTemplates?.map((temp, index) => {
                      const templateName = temp?.name;
                      const template = temp?.description;
                      return (
                        <Button
                          as="option"
                          size="md"
                          borderRadius={10}
                          key={index}
                          py={3}
                          p={5}
                          textTransform={"capitalize"}
                          onClick={async () => {
                            onToggle();
                            // await setValue("template", {
                            //   description: template,
                            // });
                            await onSelectTemplate();
                            const newSearchParams = new URLSearchParams(
                              searchParams
                            );
                            newSearchParams.set("templateId", temp?.id);
                            setSearchParams(newSearchParams.toString());
                          }}
                          isLoading={isStoryTemplatesPending}
                          isDisabled={
                            isStoryTemplatesPending || isStoryTemplatesError
                          }
                        >
                          {templateName}
                        </Button>
                      );
                    })}
                  </Stack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default ContentBuilder;
