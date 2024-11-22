import React, { useContext, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import ContentBuilder from "./ContentBuilder";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ProductDriverContext } from "../../services/context";

const ProductStoryBuilder = ({ selectedProduct }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();

  const formMethods = useForm({
    defaultValues: {
      stories: "",
      hasShownSavedAlert: false,
      isAlertOpen: false,
      template: "",
      storyName: "",
    },
  });
  const { watch, setValue } = formMethods;

  const currentStory = watch("stories");

  const updateSearchParams = useCallback(
    (value) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("productstory", value);
      setSearchParams(newSearchParams.toString());
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    const storyType = searchParams.get("productstory");
    if (["draft", "saved", "published"].includes(storyType)) {
      onOpen();
      setValue("stories", storyType);
    }
  }, [searchParams, onOpen, setValue]);

  useEffect(() => {
    if (["draft", "saved", "published"].includes(currentStory)) {
      updateSearchParams(currentStory);
    }
  }, [currentStory, updateSearchParams]);

  const handleAddStory = () => {
    searchParams.set("id", selectedProduct?.id);
    searchParams.set("productstory", "draft");
    setSearchParams(searchParams.toString());
    onOpen();
    // setTimeout(() => {
    //   driver?.moveNext();
    // }, 500);
  };

  const handleCloseModal = () => {
    searchParams.delete("productstory");
    setSearchParams(searchParams.toString());
    onClose();
  };

  const removeFromLocalStorage = (keyName) => {
    localStorage.removeItem(`product_${keyName}`);
  };

  console.log("selectedProduct: ", selectedProduct);

  return (
    <ContentBuilder
      productId={selectedProduct?.id}
      productDisplayId={selectedProduct?.display_id}
      onClose={handleCloseModal}
      draftStoryId={selectedProduct?.draft_story}
      publishedStoryId={selectedProduct?.published_story}
      formMethods={formMethods}
      handleCloseModal={handleCloseModal}
    />
  );
};

export default ProductStoryBuilder;
