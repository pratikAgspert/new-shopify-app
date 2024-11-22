import React, {
  useState,
  useCallback,
  useEffect,
  memo,
  useMemo,
  useRef,
  useContext,
} from "react";
import {
  Box,
  Button,
  Stack,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  IconButton,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useBreakpointValue,
  Switch,
  Flex,
  Input,
  Tooltip,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import CarouselComponent from "../components/ProductStoryVisualizer/CarouselComponent";
import {
  AuthContext,
  ProductDriverContext,
  ProductStoryContext,
} from "../services/context";
import { useProducts } from "../apiHooks/useProducts";
import {
  STORY_TEMPLATE_QUERY_KEY,
  useStoryTemplate,
  useUpdateStoryTemplate,
} from "../apiHooks/useStoryTemplate";
import { useQueryClient } from "@tanstack/react-query";
import {
  filterCarouselTypes,
  handleSavedOrPublishData,
} from "../components/ProductStoryBuilder/storyUtils";
import { useSearchParams } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { MdRemoveCircleOutline } from "react-icons/md";
import { PRODUCT_LIST_QUERY_KEY } from "../apiHooks/ApiHooksQueryKeys";
import { useProductMetafields } from "../apiHooks/useThemes";
import AddSection from "../components/AddSection";
import {
  useGetShopifyProducts,
  useGetSingleProduct,
} from "../apiHooks/useShopifyProduct";
import { MdOutlineTour } from "react-icons/md";
import { IoClose } from "react-icons/io5";

// Memoized Tag component
const ProductTag = memo(
  ({
    tag,
    onRemove,
    tagBg,
    tagColor,
    product,
    products,
    shopifyProductList,
  }) => {
    const productData = products?.find((pro) => pro?.id === product?.id);
    const findActiveProduct = shopifyProductList?.products?.find(
      (pro) => pro?.id === `gid://shopify/Product/${productData?.source_id}`
    );
    const isActive = findActiveProduct?.status === "ACTIVE";
    return (
      <Tag
        size="sm"
        borderRadius="full"
        variant="subtle"
        bg={tagBg}
        color={tagColor}
        p={1}
        px={3}
      >
        <HStack>
          {shopifyProductList && (
            <Tooltip
              label={isActive ? "Active" : "Inactive"}
              hasArrow
              placement="top"
            >
              <Box
                w={2.5}
                h={2.5}
                borderRadius={"full"}
                bg={isActive ? "green" : "gray"}
              />
            </Tooltip>
          )}
          <TagLabel>{tag}</TagLabel>
        </HStack>

        <TagCloseButton onClick={() => onRemove(tag)} />
      </Tag>
    );
  }
);

ProductTag.displayName = "ProductTag";

// Memoized Product Selector component
const ProductSelector = memo(
  ({ availableProducts, onSelect, isDisabled, shopifyProductList }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter products based on the search query
    const filteredProducts = useMemo(() => {
      return availableProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [availableProducts, searchQuery]);

    return (
      <Menu
        isOpen={isMenuOpen}
        closeOnSelect={false}
        onClose={() => setIsMenuOpen(false)}
      >
        <MenuButton
          as={Button}
          rightIcon={<FaArrowRight />}
          w="full"
          variant="outline"
          textAlign="left"
          isDisabled={isDisabled}
          fontSize="sm"
          className="products-selector"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {availableProducts.length > 0
            ? "Select products..."
            : "No more products available"}
        </MenuButton>

        <MenuList overflow="scroll" maxH="80vh" p={1}>
          <HStack
            position="sticky"
            top={0}
            bg="white"
            borderColor="gray.200"
            zIndex={1}
            w={"100%"}
            mb={2}
          >
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="sm"
              borderRadius={"full"}
            />
          </HStack>
          {/* <IconButton
          size="sm"
          variant="ghost"
          onClick={() => setIsMenuOpen(false)}
          icon={<IoClose />}
          position={"absolute"}
          right={-1}
          top={1}
        /> */}

          {/* Display filtered products */}
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const findActiveProduct = shopifyProductList?.products?.find(
                (pro) =>
                  pro?.id === `gid://shopify/Product/${product?.source_id}`
              );
              const isActive = findActiveProduct?.status === "ACTIVE";

              return (
                <MenuItem
                  className="first-product-selector"
                  key={product.id}
                  onClick={() => onSelect(product)}
                  _hover={{ bg: "gray.100" }}
                  gap={2}
                >
                  {shopifyProductList && (
                    <Tooltip
                      label={isActive ? "Active" : "Inactive"}
                      hasArrow
                      placement="top"
                    >
                      <Box
                        w={3}
                        h={3}
                        borderRadius={"full"}
                        bg={isActive ? "green" : "gray"}
                      />
                    </Tooltip>
                  )}
                  {product?.name}
                </MenuItem>
              );
            })
          ) : (
            <Box p={4} textAlign="center" color="gray.500">
              No products found
            </Box>
          )}
        </MenuList>
      </Menu>
    );
  }
);

ProductSelector.displayName = "ProductSelector";

// Memoized Card component
const Card = memo(
  ({
    index,
    selectedTags,
    availableProducts,
    onSelectProduct,
    onRemoveProduct,
    template,
    onPreview,
    onEdit,
    templateId,
    className = "",
    templateData,
    contents,
    sheetData,
    driverObj,
    products,
    shopifyProductList,
  }) => {
    const { data: storyTemplates } = useStoryTemplate();

    const { mutate: productMetafileds } = useProductMetafields();

    const [searchParams, setSearchParams] = useSearchParams();
    const toast = useToast();
    const tagBg = useColorModeValue("blue.50", "blue.900");
    const tagColor = useColorModeValue("blue.600", "blue.200");
    const queryClient = useQueryClient();

    const modalOptions = useDisclosure();
    const { onOpen } = modalOptions;

    const isMobile = useBreakpointValue({ base: true, lg: false });

    const [publishedIds, setPublishedIds] = useState(
      template?.products?.map((pro) => pro?.id) || []
    );

    // Effect to handle when all products are removed individually
    useEffect(() => {
      if (publishedIds?.length > 0 && selectedTags?.length === 0) {
        handleUpdateStoryTemplate();
      }
    }, [selectedTags?.length]);

    const calculateProductChanges = useCallback(() => {
      const publishedProductIds = publishedIds;
      const newSelectedProducts = selectedTags?.map((pro) => pro?.id);

      const filterNewAddedProducts = newSelectedProducts?.filter(
        (pro) => !publishedProductIds?.includes(pro)
      );

      const removedProducts = publishedProductIds?.filter(
        (pro) => !newSelectedProducts?.includes(pro)
      );

      return {
        publishedProductIds,
        newSelectedProducts,
        filterNewAddedProducts,
        removedProducts,
        hasChanges:
          !publishedProductIds?.every((id) =>
            newSelectedProducts?.includes(id)
          ) ||
          !newSelectedProducts?.every((id) =>
            publishedProductIds?.includes(id)
          ),
      };
    }, [selectedTags, publishedIds]);

    const {
      publishedProductIds,
      newSelectedProducts,
      filterNewAddedProducts,
      removedProducts,
      hasChanges,
    } = calculateProductChanges();

    const {
      mutate: updateStoryTemplate,
      isPending: isUpdatingStoryTemplate,
      isError: isUpdatingStoryTemplateError,
    } = useUpdateStoryTemplate();

    const handleUpdateStoryTemplate = async () => {
      const updatedStoryTemplate = {
        product_ids: selectedTags?.map((product) => product?.id),
      };

      // Added Product List
      const addProductMetaData = selectedTags
        ?.filter((pro) => pro && pro.source_id)
        .map((pro) => ({
          id: Number(pro.source_id),
          story: true,
        }));

      const productList = products?.filter((pro) =>
        publishedIds?.includes(pro?.id)
      );

      const removedProductList = productList?.filter(
        (pro) => !selectedTags?.map((s) => s?.id)?.includes(pro?.id)
      );

      // Removed Product List
      const removeProductMetaData = removedProductList
        ?.filter((pro) => pro && pro.source_id)
        ?.map((pro) => ({
          id: Number(pro?.source_id),
          story: false,
        }));

      const productMetaData = [
        ...(addProductMetaData || []),
        ...(removeProductMetaData || []),
      ];

      updateStoryTemplate(
        { id: template?.id, formData: updatedStoryTemplate },
        {
          onSuccess: () => {
            // Update the publishedIds with the new selection
            setPublishedIds(selectedTags?.map((pro) => pro?.id));

            queryClient.invalidateQueries({
              queryKey: [STORY_TEMPLATE_QUERY_KEY],
            });

            queryClient.invalidateQueries({
              queryKey: [PRODUCT_LIST_QUERY_KEY],
            });

            const isRepublish = publishedIds?.length !== 0;
            toast({
              title:
                selectedTags.length === 0
                  ? "Products Removed"
                  : isRepublish
                  ? "Story Republished"
                  : "Story Published",
              description:
                selectedTags.length === 0
                  ? "All products have been successfully removed from the story."
                  : isRepublish
                  ? "Your story has been successfully republished with the updated products."
                  : "Your story has been successfully published.",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });

            productMetafileds(productMetaData, {
              onSuccess: () => {
                console.log("Add Meta filed Successfully");

                queryClient.invalidateQueries({
                  queryKey: ["single-shopify-product"],
                });
              },
              onError: (error) => {
                console.log("Error while adding meta fields", error);
              },
            });
          },

          onError: (error) => {
            toast({
              title: "Operation Failed",
              description:
                "There was an error updating your story. Please try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
          },
        }
      );
    };

    const handleRemoveAll = async () => {
      const updatedStoryTemplate = {
        product_ids: [],
      };

      const filterTemplate = storyTemplates
        ?.find((temp) => temp?.id === template?.id)
        ?.products?.map((pro) => pro?.id);

      const productList = products?.filter((pro) =>
        filterTemplate?.includes(pro?.id)
      );

      const removeProductMetaData = productList?.map((pro) => ({
        id: Number(pro?.source_id),
        story: false,
      }));

      updateStoryTemplate(
        { id: template?.id, formData: updatedStoryTemplate },
        {
          onSuccess: () => {
            // Clear publishedIds
            setPublishedIds([]);

            // Clear selected tags by calling onRemoveProduct for each tag
            selectedTags.forEach((product) => {
              onRemoveProduct(template?.id, product);
            });

            queryClient.invalidateQueries({
              queryKey: [STORY_TEMPLATE_QUERY_KEY],
            });

            queryClient.invalidateQueries({
              queryKey: [PRODUCT_LIST_QUERY_KEY],
            });

            toast({
              title: "Products Removed",
              description:
                "All products have been successfully removed from the story.",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });

            productMetafileds(removeProductMetaData, {
              onSuccess: () => {
                console.log("Remove Meta filed Successfully");
              },
              onError: (error) => {
                console.log("Error while removing meta fields", error);
              },
            });
          },
          onError: (error) => {
            console.log("ERROR MESSAGE:", error);
            toast({
              title: "Remove All Failed",
              description:
                "There was an error removing products. Please try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
          },
        }
      );
    };

    const isRepublishMode = useCallback(() => {
      // If there are published products and we're adding new ones, it's a republish
      if (
        publishedProductIds?.length > 0 &&
        filterNewAddedProducts?.length > 0
      ) {
        return true;
      }

      // If all products were removed and new ones added, it's a publish
      if (
        removedProducts?.length === publishedProductIds?.length &&
        filterNewAddedProducts?.length > 0
      ) {
        return false;
      }

      // If there are published products and we're just removing some (not all), it's a republish
      if (
        publishedProductIds?.length > 0 &&
        removedProducts?.length > 0 &&
        removedProducts?.length < publishedProductIds?.length
      ) {
        return true;
      }

      return false;
    }, [publishedProductIds, filterNewAddedProducts, removedProducts]);

    // Check if any products are selected
    const hasSelectedProducts = newSelectedProducts?.length > 0;

    // Determine if the button should be disabled
    const isButtonDisabled = !hasSelectedProducts || !hasChanges;

    const buttonText = isRepublishMode() ? "Republish" : "Publish";

    return (
      <>
        <Stack
          bg="white"
          borderRadius="xl"
          borderWidth={templateId === template?.id ? 1 : 0}
          borderColor={templateId === template?.id ? "green" : "white"}
          className={className}
          onClick={() => {
            searchParams.set("templateId", template?.id);
            setSearchParams(searchParams.toString());

            onPreview(template);
          }}
        >
          <Stack p={3}>
            <HStack justifyContent="space-between">
              <Text size="sm" fontWeight="semibold">
                {template?.name}
              </Text>
              <HStack>
                <Button
                  onClick={() => {
                    onEdit(template);
                  }}
                  fontSize="xs"
                  size={"sm"}
                  p={2}
                  px={4}
                >
                  Edit
                </Button>

                <Button
                  onClick={() => {
                    isMobile && onOpen();
                  }}
                  fontSize="xs"
                  size={"sm"}
                  p={2}
                  px={4}
                  display={{ base: "flex", lg: "none" }}
                >
                  Preview
                </Button>

                <Button
                  className="publish-story-btn"
                  fontSize="xs"
                  p={2}
                  px={4}
                  isLoading={isUpdatingStoryTemplate}
                  onClick={handleUpdateStoryTemplate}
                  isDisabled={isButtonDisabled}
                  size={"sm"}
                >
                  {buttonText}
                </Button>

                <Button
                  className="remove-all-btn"
                  fontSize="xs"
                  p={2}
                  px={4}
                  isLoading={isUpdatingStoryTemplate}
                  onClick={handleRemoveAll}
                  isDisabled={selectedTags.length === 0}
                  size={"sm"}
                >
                  Remove All
                </Button>
              </HStack>
            </HStack>

            <Stack spacing={1}>
              <Box>
                <ProductSelector
                  availableProducts={availableProducts}
                  onSelect={(product) => onSelectProduct(template?.id, product)}
                  isDisabled={availableProducts.length === 0}
                  shopifyProductList={shopifyProductList}
                />
              </Box>

              <Stack direction="row" flexWrap="wrap" spacing={2}>
                {selectedTags.map((product) => (
                  <ProductTag
                    key={product?.id}
                    tag={product?.name}
                    onRemove={() => onRemoveProduct(template?.id, product)}
                    tagBg={tagBg}
                    tagColor={tagColor}
                    product={product}
                    products={products}
                    shopifyProductList={shopifyProductList}
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>

          {selectedTags?.length !== 0 && (
            <CardAccordion
              label={
                <Text fontWeight={"semibold"}>
                  {hasChanges && filterNewAddedProducts?.length !== 0
                    ? "Products"
                    : "Live Products"}
                </Text>
              }
              body={
                <>
                  {selectedTags?.map((product) => {
                    return (
                      <ProductCard
                        key={product?.id}
                        product={product}
                        onRemove={() => onRemoveProduct(template?.id, product)}
                        filterNewAddedProducts={filterNewAddedProducts}
                        products={products}
                        shopifyProductList={shopifyProductList}
                      />
                    );
                  })}
                </>
              }
            />
          )}
        </Stack>

        <Stack display={{ base: "flex", lg: "none" }}>
          <DrawerWrapper modalOptions={modalOptions}>
            <StoryPreview
              templateData={templateData}
              contents={contents}
              sheetData={sheetData}
              driverObj={driverObj}
            />
          </DrawerWrapper>
        </Stack>
      </>
    );
  }
);

Card.displayName = "Card";

// Main Stories component
const Stories = () => {
  const {
    data: storyTemplates,
    isLoading: isStoryTemplatesLoading,
    isError: isStoryTemplatesError,
  } = useStoryTemplate();

  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts();

  const {
    data: shopifyProductList,
    isLoading: isShopifyProductListLoading,
    isError: isShopifyProductListError,
  } = useGetShopifyProducts();

  const [cardSelections, setCardSelections] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  // Initialize card selections when templates load
  React.useEffect(() => {
    if (storyTemplates?.length) {
      console.log("storyTemplates", storyTemplates);
      // story pre-selected products
      // a dict of id and products from storyTemplates
      const storyPreSelectedProducts = {};
      storyTemplates.map((template) => {
        storyPreSelectedProducts[template.id] = template.products;
      });
      setCardSelections(storyPreSelectedProducts);
    }
  }, [storyTemplates]);
  const driverObj = driver({
    steps: [
      {
        element: ".first-story-card",
        popover: {
          title: "Select the product",
          description: "Click here for more details",
          onNextClick: () => {
            const button = document.querySelector(".first-story-card");
            button?.click();
            return false;
          },
        },
      },
      // {
      //   element: ".preview-experience-btn",
      //   popover: {
      //     title: "Preview Experience",
      //     description: "Click to preview the experience",
      //     onNextClick: () => {
      //       const button = document.querySelector(".preview-experience-btn");
      //       button?.click();
      //       return false;
      //     },
      //   },
      // },
      {
        element: ".preview-experience-card",
        popover: {
          title: "Preview Experience",
          description: "Preview the story",
          onNextClick: () => {
            driverObj?.moveNext();
            return false;
          },
        },
      },
      {
        element: ".products-selector",
        popover: {
          title: "Select Products",
          description: "Select the products for the story",
          onNextClick: () => {
            // Redirect to story builder
            const button = document.querySelector(".products-selector");
            button?.click();
            driverObj?.moveNext();
            // window.location.href = '/story-builder'; // Change this to the actual path of your story builder
            return false;
          },
        },
      },
      {
        element: ".first-product-selector",
        popover: {
          title: "Attach product",
          description: "Click to attach a product to the story",
          onNextClick: () => {
            // Redirect to story builder
            const button = document.querySelector(".first-product-selector");
            button?.click();
            driverObj?.moveNext();
            // window.location.href = '/story-builder'; // Change this to the actual path of your story builder
            return false;
          },
        },
      },
      {
        element: ".publish-story-btn",
        popover: {
          title: "Publish Story",
          description: "Click to publish the story",
          onNextClick: () => {
            // Redirect to story builder
            const button = document.querySelector(".publish-story-btn");
            button?.click();
            driverObj?.moveNext();
            // window.location.href = '/story-builder'; // Change this to the actual path of your story builder
            return false;
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
    const hasRunBefore = localStorage.getItem("driverHasRun-storyPage");

    if (products?.length === 1 && !hasRunBefore) {
      localStorage.setItem("driverHasRun-storyPage", "true");

      setTimeout(() => {
        driverObj.drive();
      }, 1000);
    }
  }, [products]);

  console.log("cardSelections", cardSelections);

  // Get all selected products across all cards
  const getAllSelectedProducts = useCallback(() => {
    return Object.values(cardSelections).flat();
  }, [cardSelections]);

  // Get available products for any card
  const getAvailableProducts = useCallback(() => {
    if (!products) return [];
    const selectedProducts = getAllSelectedProducts();
    return products.filter(
      (product) =>
        !selectedProducts.some((selected) => selected.id === product.id)
    );
  }, [cardSelections, products]);

  // Handle product selection
  const handleSelectProduct = useCallback((templateId, product) => {
    setCardSelections((prev) => {
      const newSelections = { ...prev };
      newSelections[templateId] = [...prev[templateId], product];
      return newSelections;
    });
  }, []);

  // Handle product removal
  const handleRemoveProduct = useCallback((templateId, product) => {
    setCardSelections((prev) => {
      const newSelections = { ...prev };
      newSelections[templateId] = prev[templateId].filter(
        (p) => p.id !== product.id
      );
      return newSelections;
    });
  }, []);

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

  const [contents, setContents] = useState([]);
  const [sheetData, setSheetData] = useState([]);
  const [templateData, setTemplateData] = useState(null);

  if (isStoryTemplatesLoading || isProductsLoading) {
    return (
      <Stack align="center" justify="center" h="100vh">
        <Spinner size="xl" />
        <Text>Loading...</Text>
      </Stack>
    );
  }

  if (isStoryTemplatesError || isProductsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading data. Please try again later.
      </Alert>
    );
  }
  const handlePreview = (template) => {
    console.log("template", template);
    const contents = template?.description?.data;
    const sheetData = template?.description?.general_sheet;

    setTemplateData(template);

    handleSavedOrPublishData(
      template,
      setContents,
      setSheetData,
      filterCarouselTypes,
      template?.name
    );
    console.log("contents", contents);
    console.log("sheetData", sheetData);
    setTimeout(() => {
      driverObj?.moveNext();
    }, 500);
    // setContents(contents);
    // setSheetData(sheetData);
  };

  const handleEdit = (template) => {
    window.location.href = `/storyBuilder?edit=published&templateId=${template?.id}`;
    console.log("template", template);
  };

  return (
    <ProductStoryContext.Provider value={productStoryContextValue}>
      <ProductDriverContext.Provider value={{ driver: driverObj }}>
        <AlertDialogBox products={products} />

        <AddAppBlock />

        <Stack p={5} direction={{ base: "column", lg: "row" }} h={"100dvh"}>
          <Stack
            spacing={3}
            w={{ base: "100%", lg: "70%" }}
            overflowY={"scroll"}
          >
            {storyTemplates
              ?.sort((a, b) => b?.id - a?.id)
              ?.map((template, index) => (
                <Card
                  className="first-story-card"
                  key={template.id}
                  index={index}
                  template={template}
                  selectedTags={cardSelections?.[template?.id] || []}
                  availableProducts={getAvailableProducts()}
                  onSelectProduct={handleSelectProduct}
                  onRemoveProduct={handleRemoveProduct}
                  onPreview={handlePreview}
                  onEdit={handleEdit}
                  templateId={Number(templateId)}
                  templateData={templateData}
                  contents={contents}
                  sheetData={sheetData}
                  driverObj={driverObj}
                  products={products}
                  shopifyProductList={shopifyProductList}
                />
              ))}
          </Stack>

          <Stack
            display={{ base: "none", lg: "flex" }}
            w={{ base: "100%", lg: "30%" }}
          >
            <StoryPreview
              templateData={templateData}
              contents={contents}
              sheetData={sheetData}
              driverObj={driverObj}
            />
          </Stack>
        </Stack>
      </ProductDriverContext.Provider>
    </ProductStoryContext.Provider>
  );
};

const ProductCard = ({
  product,
  onRemove,
  filterNewAddedProducts,
  products,
  shopifyProductList,
}) => {
  const { mutate: productMetafileds } = useProductMetafields();

  const isNewProduct = filterNewAddedProducts?.includes(product?.id);

  const productData = products?.find((pro) => pro?.id === product?.id);

  const { data: shopifyProductData } = useGetSingleProduct(
    productData?.source_id
  );

  const metaData = shopifyProductData?.product?.metafields?.edges?.find(
    (meta) => meta?.node?.key === "show_product_story"
  );

  const isMetaData = metaData?.node?.value === "true";
  console.log("shopifyProductData==>", isMetaData);

  const [isPublished, setIsPublished] = useState(false);

  const toast = useToast();

  const findActiveProduct = shopifyProductList?.products?.find(
    (pro) => pro?.id === `gid://shopify/Product/${productData?.source_id}`
  );
  const isActive = findActiveProduct?.status === "ACTIVE";

  // Update isPublished state when publishedIds changes
  useEffect(() => {
    setIsPublished(metaData?.node?.value === "true");
  }, [shopifyProductData]);

  const handleSwitchChange = (e) => {
    const newState = e.target.checked;
    setIsPublished(newState);

    const productMetaData = [
      {
        id: Number(productData?.source_id),
        story: newState,
      },
    ];

    productMetafileds(productMetaData, {
      onSuccess: () => {
        console.log("Add Meta filed Successfully");
        setIsPublished(newState);

        toast({
          title: newState
            ? "Story Added in Product theme"
            : "Story Removed in Product theme",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      },
      onError: (error) => {
        console.log("Error while adding meta fields", error);
        setIsPublished(!newState);
      },
    });
  };

  return (
    <HStack
      justifyContent={"space-between"}
      boxShadow={"md"}
      p={1}
      px={3}
      borderRadius={10}
      bg={"gray.100"}
    >
      <HStack>
        <Tooltip
          label={isNewProduct ? "UnPublished" : "Published"}
          hasArrow
          placement="top"
        >
          <Stack
            bg={isNewProduct ? "orange.400" : "green.400"}
            w={3}
            h={3}
            borderRadius={100}
          />
        </Tooltip>
        <Text fontWeight={"semibold"}>
          {product?.name}{" "}
          {shopifyProductList && !isActive && "(Inactive Product)"}
        </Text>
      </HStack>

      <HStack>
        <Switch
          isChecked={isPublished}
          onChange={handleSwitchChange}
          colorScheme="green"
        />

        {isActive && (
          <>
            <AddSection shopifyProductData={shopifyProductData} />

            {!isNewProduct && (
              <a href={productData?.story_url} target="_blank">
                <IconButton icon={<FaArrowUpRightFromSquare />} />
              </a>
            )}
          </>
        )}
        <IconButton
          icon={<MdRemoveCircleOutline fontSize={24} color="red" />}
          onClick={() => onRemove(product?.id)}
        />
      </HStack>
    </HStack>
  );
};

const CardAccordion = ({ label, body, headerStyles }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion allowToggle index={isOpen ? 0 : -1}>
      <AccordionItem border={"none"}>
        <Stack>
          <AccordionButton
            onClick={toggleAccordion}
            borderBottomRadius={isOpen ? 0 : 10}
            {...headerStyles}
          >
            <Stack as="span" flex="1">
              {label}
            </Stack>
            <AccordionIcon />
          </AccordionButton>
        </Stack>

        <AccordionPanel pb={3}>
          <Stack>{body}</Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const StoryPreview = ({ templateData, contents, sheetData, driverObj }) => {
  return (
    <Stack alignItems="center" spacing={0.5}>
      <HStack w={"60%"} alignSelf={"center"} justifyContent={"space-between"}>
        <Text fontSize={"lg"} fontWeight={"semibold"}>
          {templateData && templateData?.name}
        </Text>

        <IconButton
          icon={<MdOutlineTour color="blue" />}
          onClick={() => {
            driverObj.drive();
          }}
          borderRadius={"full"}
          bg={"gray.200"}
        />
      </HStack>

      <Stack
        className="preview-experience-card"
        w="277.4px"
        h="572.85px"
        borderWidth={5}
        borderColor="black"
        borderRadius={50}
        overflow="hidden"
        boxShadow="lg"
        position="relative"
      >
        {!templateData ? (
          <Stack alignSelf={"center"} mt={250} textAlign={"center"} spacing={0}>
            <Text fontWeight={"semibold"} fontSize={"lg"}>
              Select Story Template
            </Text>
            <Text fontWeight={"semibold"} fontSize={"lg"}>
              for Preview
            </Text>
          </Stack>
        ) : (
          <CarouselComponent
            productData={contents || []}
            defaultSheetData={sheetData || []}
          />
        )}
      </Stack>
    </Stack>
  );
};

const DrawerWrapper = ({ children, modalOptions }) => {
  const { isOpen, onClose } = modalOptions;

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={"sm"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <Stack>{children}</Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const AlertDialogBox = ({ products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    if (products?.length === 0) {
      onOpen();
    }
  }, [products]);

  const { getShop } = useContext(AuthContext);

  const store = getShop()?.split(".")[0];

  const addProductUrl = `https://admin.shopify.com/store/${store}/products`;

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Continue with Adding Product
          </AlertDialogHeader>

          <AlertDialogBody>
            Please first add atleast one product to assigning story template
          </AlertDialogBody>

          <AlertDialogFooter>
            <a href={addProductUrl} target="_blank">
              <Button
                colorScheme="blue"
                onClick={() => {
                  onClose();
                }}
                ml={3}
              >
                Continue
              </Button>
            </a>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const AddAppBlock = () => {
  const { getShop } = useContext(AuthContext);

  // from old vite temp its working in that
  // const redirectUrl = `https://hellostorexyz.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=${appBlockId}/${extensionHandle}&target=newAppsSection`;

  const appBlockId = "e7fcc5b5-123e-42be-aa93-c52cb2a5aed4";
  const extensionHandle = "counter";

  const addExtUrl = `https://${getShop()}/admin/themes/current/editor?template=product&addAppBlockId=${appBlockId}/${extensionHandle}&target=newAppsSection`;

  return (
    <Stack>
      <a href={addExtUrl} target="_blank">
        <Button>Add App Block</Button>
      </a>
    </Stack>
  );
};

export default Stories;
