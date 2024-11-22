export const template = {
  text_content: {
    header: "",
    content: "",
  },
  image_content: {
    image_urls: [],
  },
  video_content: {
    video_urls: [],
  },
  content: "",
  header: {
    header: "",
  },
  brand_banner: "",
  redirect_url: {
    url: "",
    label: "",
  },
  social_links: {
    social_links: [],
  },
  partners: [],
  global_style: {
    background_color: "#ffffff",
    handle_color: "#808080",
    font_family: "Poppins",
    lineHeight: 1.5,
  },
};

export const filterCarouselTypes = [
  "carousel_360_image",
  "carousel_360_video",
  "carousel_2d_image",
  "carousel_2d_video",
];

export const ALLOWED_TYPES = [
  "carousel_360_image",
  "carousel_360_video",
  "carousel_2d_image",
  "carousel_2d_video",
  "image_content",
  "video_content",
  "brand_banner",
  "partners",
];

export function updateImageUrls(dataList, mapping) {
  const usedKeys = [];
  return [
    dataList.map((item) => {
      if (ALLOWED_TYPES.includes(item.type) && Array.isArray(item.data)) {
        return {
          ...item,
          data: item.data.map((subItem) => {
            if (ALLOWED_TYPES.includes(subItem.type)) {
              const currentImageUrl = subItem.image_url || "";
              if (currentImageUrl.startsWith("blob:")) {
                usedKeys.push(subItem.id);
                const newImageUrl = mapping[subItem.id] || "";
                return {
                  ...subItem,
                  image_url: newImageUrl,
                };
              }
            }
            return subItem;
          }),
        };
      }
      return item;
    }),
    usedKeys,
  ];
}

export const stories = [
  {
    id: 1,
    label: "Draft Story",
    value: "draft",
  },
  {
    id: 2,
    label: "Saved Story",
    value: "saved",
  },
  {
    id: 3,
    label: "Published Story",
    value: "published",
  },
];

export const templates = [
  {
    id: 1,
    label: "temp-1",
    value: "temp-1",
  },
  {
    id: 2,
    label: "temp-2",
    value: "temp-2",
  },
  {
    id: 3,
    label: "temp-3",
    value: "temp-3",
  },
  {
    id: 4,
    label: "temp-4",
    value: "temp-4",
  },
  {
    id: 5,
    label: "temp-5",
    value: "temp-5",
  },
  {
    id: 6,
    label: "temp-6",
    value: "temp-6",
  },
];

export const positions = [
  {
    id: 1,
    label: "Right Bottom",
    value: 50,
  },
  {
    id: 2,
    label: "Left Bottom",
    value: 100,
  },
  {
    id: 3,
    label: "Front Bottom",
    value: 150,
  },
  {
    id: 4,
    label: "Back Bottom",
    value: 150,
  },
];

export const filterStoryData = (storyData) => {
  const { data, general_sheet, is_general_sheet } =
    storyData?.description || {};

  if (is_general_sheet) {
    return {
      filterCarouselData: [],
      filterSheetData: data || [],
    };
  }

  const filterCarouselData = data.filter((c) =>
    filterCarouselTypes.includes(c?.type)
  );
  const filterSheetData = data.filter(
    (c) => !filterCarouselTypes.includes(c?.type)
  );

  return {
    filterCarouselData,
    filterSheetData,
  };
};

export const getLocalStorageData = () => {
  const localContentDataString = localStorage.getItem(`content`);

  const localSheetDataString = localStorage.getItem(`sheet`);

  const localUrlMapDataString = localStorage.getItem(`urlMap`);

  const localStoryNameDataString = localStorage.getItem(`storyName`);

  try {
    // If any localStorage data exists, use it
    if (
      localContentDataString ||
      localSheetDataString ||
      localUrlMapDataString ||
      localStoryNameDataString
    ) {
      const localUrlMapData = JSON.parse(localUrlMapDataString || "{}");
      const localContentData = JSON.parse(localContentDataString || "[]");
      const localSheetData = JSON.parse(localSheetDataString || "[]");
      const localStoryName = JSON.parse(localStoryNameDataString || "[]");

      const [replacedContentData, usedContentKeys] = updateImageUrls(
        localContentData,
        localUrlMapData
      );

      const [replacedSheetData, usedSheetKeys] = updateImageUrls(
        localSheetData,
        localUrlMapData
      );

      console.log("Local Storage Data:", {
        content: replacedContentData,
        sheet: replacedSheetData,
        storyName: localStoryName,
      });

      return {
        contentData: replacedContentData,
        sheetData: replacedSheetData,
        storyName: localStoryName,
      };
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }

  return {
    contentData: [],
    sheetData: [],
    storyName: "",
  };
};

export const storeInLocalStorage = (keyName, data) => {
  localStorage.setItem(`${keyName}`, JSON.stringify(data));
};

export const handleSavedOrPublishData = (
  storyData,
  setContents,
  setSheetData,
  filterCarouselTypes,
  productId
) => {
  if (!storyData) return;

  const { data, general_sheet, is_general_sheet } = storyData?.description;

  if (is_general_sheet) {
    setContents(data || []);
    setSheetData(general_sheet || []);

    storeInLocalStorage(`content`, data);
    storeInLocalStorage(`sheet`, general_sheet);
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

    storeInLocalStorage(`content`, filterCarouselData);
    storeInLocalStorage(`sheet`, filterSheetData);
  }
};
