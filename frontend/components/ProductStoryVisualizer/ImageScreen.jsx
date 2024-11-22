import {
  Box,
  Image,
  Stack,
  Text,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Input,
  Icon,
  Tag,
  HStack,
  Textarea,
  Button,
} from "@chakra-ui/react";
import React, { useState, useRef, useEffect, useContext } from "react";
import { HeroSection } from "./HeroSection";
import { CheckIcon, EditIcon, InfoIcon } from "@chakra-ui/icons";
import { nanoid } from "nanoid";
import { useThrottle } from "@uidotdev/usehooks";
import { CgCloseO } from "react-icons/cg";
import { motion } from "framer-motion";
// import { ProductStoryContext } from "../../services/context";
import { ProductStoryContext } from "../context";

const InfoButton = ({
  index,
  slideId,
  pointId,
  text,
  updateInfoPointText,
  removeInfoPoint,
  isOpen,
  onToggle,
  onClose,
  isDisabled,
  setOpenPopoverIndex,
}) => {
  const [inputValue, setInputValue] = useState(text || "");
  const [isEditing, setIsEditing] = useState(false);
  const throttledValue = useThrottle(inputValue, 300);
  const buttonRef = useRef(null);

  // useEffect(() => {
  //   updateInfoPointText(slideId, pointId, throttledValue);
  // }, [throttledValue, slideId, pointId, updateInfoPointText]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    onClose();
    updateInfoPointText(slideId, pointId, inputValue);
  };

  return (
    <>
      {!isOpen && (
        <Stack
          as={motion.div}
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100,
          }}
        >
          <IconButton
            ref={buttonRef}
            aria-label="Info"
            icon={<InfoIcon />}
            isRound
            size="small"
            onClick={onToggle}
            fontSize={18}
            p={0}
            color="white"
            border={"1px solid white"}
            boxShadow={"0px 0px 15px 8px rgba(255,255,255,0.6)"}
            borderRadius={50}
            bg={"black"}
            _hover={{ bg: "none" }}
          />

          {!isDisabled && (
            <IconButton
              icon={<CgCloseO size={15} />}
              position="absolute"
              right={-2.5}
              top={-2.5}
              zIndex={10}
              color="red"
              bg="white"
              borderRadius="full"
              size={"x-small"}
              aria-label="Remove info point"
              onClick={() => {
                setOpenPopoverIndex(null);
                removeInfoPoint(slideId, pointId);
              }}
              isDisabled={isDisabled}
            />
          )}
        </Stack>
      )}

      <Popover isOpen={isOpen} onClose={onClose} closeOnBlur={false} zIndex={2}>
        <PopoverTrigger>
          <span />
        </PopoverTrigger>
        <PopoverContent
          bg={isDisabled ? "rgb(255,255,255,0.8)" : "white"}
          boxShadow="md"
          borderRadius={10}
          minW={"fit-content"}
          maxW={"200px"}
          gap={5}
          pt={!isDisabled && 15}
        >
          <PopoverCloseButton
            position="absolute"
            top={0}
            right={0}
            size="sm"
            zIndex={5}
            onClick={onClose}
          />
          <PopoverBody zIndex={3} minW={"fit-content"} maxW={"200px"}>
            {isDisabled ? (
              <Text mb={0} fontSize={"small"}>
                {text}
              </Text>
            ) : (
              <Stack>
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter info here"
                  borderWidth={1}
                  size="sm"
                  borderRadius={5}
                  px={2}
                  fontSize={"small"}
                  isDisabled={isDisabled || !isEditing}
                  opacity={isDisabled ? 0.5 : 1}
                  cursor={isEditing ? "text" : "no-drop"}
                  readOnly={!isEditing}
                  mr={2}
                />

                {!isDisabled && (
                  <Button
                    fontSize={"small"}
                    bg={isEditing ? "#81E6D9" : "#FEB2B2"}
                    w={"fit-content"}
                    alignSelf={"flex-end"}
                    size={"small"}
                    p={1}
                    px={2}
                    borderRadius={5}
                    onClick={isEditing ? handleSaveClick : handleEditClick}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                )}
              </Stack>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

const ImageScreen = ({ header, data, setIsInteracting, slideId }) => {
  const imageUrl = data?.find((info) => info?.type === "carousel_2d_image");
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const imageRef = useRef(null);
  const {
    addInfoPoint,
    removeInfoPoint,
    getInfoPoints,
    updateInfoPointText,
    isDisabled,
  } = useContext(ProductStoryContext);
  const infoPoints = getInfoPoints(slideId);

  const handleClick = (event) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const pointId = nanoid();
      console.log("Adding info point:", { x, y, pointId });
      addInfoPoint(slideId, pointId, {
        coords: { x, y },
        id: pointId,
        text: "",
      });
      console.log("Info points after adding:", getInfoPoints(slideId));
    }
  };

  const image = imageRef.current;

  useEffect(() => {
    if (image) {
      image.addEventListener("click", handleClick);
      return () => {
        image.removeEventListener("click", handleClick);
      };
    }
  }, [image]);

  return (
    <Box position="relative" h="100dvh" overflow="hidden">
      <Stack overflow="hidden" position="relative">
        {imageUrl?.image_url && (
          <Image
            ref={imageRef}
            src={imageUrl.image_url}
            height="39.5rem"
            objectFit="fill"
            alt="img"
            style={{ pointerEvents: isDisabled ? "none" : "auto" }}
          />
        )}

        {Object.entries(infoPoints || {})
          .filter(([_, point]) => point && Object.keys(point).length > 0)
          .map(([pointId, point], index) => (
            <Box
              key={pointId}
              position="absolute"
              left={`${point.coords.x}px`}
              top={`${point.coords.y}px`}
              transform="translate(-50%, -50%)"
            >
              <InfoButton
                index={index}
                slideId={slideId}
                pointId={pointId}
                text={point.text}
                updateInfoPointText={updateInfoPointText}
                removeInfoPoint={removeInfoPoint}
                isDisabled={isDisabled}
                isOpen={openPopoverIndex === index}
                onToggle={() =>
                  setOpenPopoverIndex((prev) => (prev === index ? null : index))
                }
                onClose={() => setOpenPopoverIndex(null)}
                setOpenPopoverIndex={setOpenPopoverIndex}
              />
            </Box>
          ))}
      </Stack>
      <HeroSection
        header={header}
        setIsBottomSheetOpen={(val) => setIsInteracting(!val)}
        data={data}
        isImage
      />
    </Box>
  );
};

export default ImageScreen;
