import React, { useEffect, useState } from "react";
import CarouselComponent from "./ProductStoryVisualizer/CarouselComponent";
import { Stack } from "@chakra-ui/react";
import { ProductStoryContext } from "./context";
import { ChakraProvider } from "@chakra-ui/react";
import { useGetStory } from "./apiHooks/useStory";

const Story = () => {
  // Create a context value object
  const productStoryContextValue = {
    addInfoPoint: () => {},
    removeInfoPoint: () => {},
    getInfoPoints: () => {},
    updateInfoPointText: () => {},
    isDisabled: true,
    styles: {},
    handleStyleChange: () => {},
  };

  const shopifyProductData = window.product;
  const productMetafields = window.productMetafields;

  console.log("productMetafields==>", productMetafields);

  const { data: storyData, isError: isStoryDataError } = useGetStory({
    productId: shopifyProductData?.id,
  });

  const [contents, setContents] = useState([]);

  const [sheetData, setSheetData] = useState([]);

  const filterCarouselTypes = [
    "carousel_360_image",
    "carousel_360_video",
    "carousel_2d_image",
    "carousel_2d_video",
  ];

  useEffect(() => {
    if (isStoryDataError) return;

    const data = storyData?.story_data?.data;
    const general_sheet = storyData?.story_data?.general_sheet;
    const is_general_sheet = storyData?.story_data?.is_general_sheet;

    if (is_general_sheet) {
      setContents(data || []);
      setSheetData(general_sheet || []);
    } else {
      const filterCarouselData = data?.filter((c) =>
        filterCarouselTypes.includes(c?.type)
      );

      const filterSheetData = data?.filter(
        (c) => !filterCarouselTypes.includes(c?.type)
      );

      console.log("Filtered Data:", {
        carousel: filterCarouselData,
        sheet: filterSheetData,
      });

      setContents(filterCarouselData || []);
      setSheetData(filterSheetData || []);
    }
  }, [storyData]);

  return (
    <ChakraProvider>
      <ProductStoryContext.Provider value={productStoryContextValue}>
        <Stack
          w="277.4px"
          h="572.85px"
          borderWidth={5}
          borderColor="black"
          borderRadius={50}
          overflow="hidden"
          boxShadow="lg"
          position="relative"
        >
          <CarouselComponent
            productData={contents || {}}
            defaultSheetData={sheetData || []}
          />
        </Stack>
      </ProductStoryContext.Provider>
    </ChakraProvider>
  );
};

export default Story;
