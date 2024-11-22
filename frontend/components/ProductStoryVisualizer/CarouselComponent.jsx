import React, { useEffect, useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import { Scene } from "./Scene";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CustomNextArrow, CustomPrevArrow } from "./CustomArrow";
import { Stack } from "@chakra-ui/react";
import ImageScreen from "./ImageScreen";
import VideoScreen from "./VideoScreen";
import DraggableDrawer from "./generic/DraggableDrawer";
import { DrawerInfo } from "./DrawerInfo";
import { motion, useMotionValue, useTransform } from "framer-motion";

const MIN_HEIGHT = 30;
const MAX_HEIGHT = 572.85;

const MotionStack = motion(Stack);

const CarouselComponent = ({ productData, defaultSheetData }) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const sliderRef = useRef();
  const drawerHeight = useMotionValue(MIN_HEIGHT);

  // Calculate the background offset based on drawer height
  const backgroundOffset = useTransform(
    drawerHeight,
    [MIN_HEIGHT, MAX_HEIGHT],
    ["0%", "-50%"]
  );

  useEffect(() => {
    if (isInteracting) {
      setIsVisible(false);
    } else {
      const timer = setTimeout(() => setIsVisible(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isInteracting]);

  const settings = {
    infinite: false,
    speed: 500,
    swipe: false,
    draggable: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    afterChange: (newIndex) => setCurrentSlide(newIndex),
  };

  const nextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleDrawerHeightChange = (newHeight) => {
    drawerHeight.set(newHeight);
    setIsBottomSheetOpen(newHeight > MIN_HEIGHT);
  };

  const filteredProductData = useMemo(() => {
    return productData?.filter((item) => item?.isActive === true) || [];
  }, [productData]);

  const shouldShowEmptyState =
    !filteredProductData?.length || !filteredProductData[0]?.isActive;

  return (
    <Stack position={"relative"} overflow={"hidden"}>
      <MotionStack
        style={{
          y: backgroundOffset,
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {shouldShowEmptyState && <Stack h={"100dvh"} />}

          {filteredProductData?.map((dataset) => (
            <Stack key={dataset.id}>
              {dataset?.type === "carousel_360_image" && dataset?.isActive && (
                <Scene
                  zoom={dataset?.zoom || 1}
                  targetRotation={dataset?.targetRotation}
                  fov={dataset?.fov}
                  header={dataset?.header}
                  setIsInteracting={setIsInteracting}
                  data={dataset?.data}
                  isBottomSheetOpen={isBottomSheetOpen}
                  setIsBottomSheetOpen={setIsBottomSheetOpen}
                  slideId={dataset?.id}
                />
              )}

              {dataset?.type === "carousel_360_video" && dataset?.isActive && (
                <Scene
                  zoom={dataset?.zoom || 1}
                  targetRotation={dataset?.targetRotation}
                  header={dataset?.header}
                  setIsInteracting={setIsInteracting}
                  data={dataset?.data}
                  isBottomSheetOpen={isBottomSheetOpen}
                  setIsBottomSheetOpen={setIsBottomSheetOpen}
                  slideId={dataset?.id}
                />
              )}

              {dataset?.type === "carousel_2d_image" && dataset?.isActive && (
                <ImageScreen
                  header={dataset?.header}
                  setIsInteracting={setIsInteracting}
                  data={dataset?.data}
                  slideId={dataset?.id}
                />
              )}

              {dataset?.type === "carousel_2d_video" && dataset?.isActive && (
                <VideoScreen
                  header={dataset?.header}
                  setIsInteracting={setIsInteracting}
                  data={dataset?.data}
                  slideId={dataset?.id}
                />
              )}
            </Stack>
          ))}
        </Slider>
      </MotionStack>

      <DraggableDrawer
        data={defaultSheetData}
        setIsBottomSheetOpen={setIsBottomSheetOpen}
        onDrawerHeightChange={handleDrawerHeightChange}
        minHeight={MIN_HEIGHT}
        maxHeight={MAX_HEIGHT}
        drawerHeight={drawerHeight}
      >
        <DrawerInfo data={defaultSheetData} />
      </DraggableDrawer>

      {drawerHeight.current === MIN_HEIGHT && (
        <>
          {currentSlide > 0 && (
            <CustomPrevArrow isVisible={isVisible} onClick={prevSlide} />
          )}
          {currentSlide < filteredProductData?.length - 1 && (
            <CustomNextArrow isVisible={isVisible} onClick={nextSlide} />
          )}
        </>
      )}
    </Stack>
  );
};

export default CarouselComponent;
