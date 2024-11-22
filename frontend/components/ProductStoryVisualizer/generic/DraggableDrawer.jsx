import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Box, VStack, Flex } from "@chakra-ui/react";
import { motion, useTransform, animate } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { BrandBanner } from "../BrandBanner";
import { ProductStoryContext } from "../../context";

const MotionBox = motion(Box);

export default function DraggableDrawer({
  children,
  onDrawerHeightChange,
  setIsBottomSheetOpen,
  data,
  minHeight,
  maxHeight,
  drawerHeight,
}) {
  const initialAdjustmentMade = useRef(false);
  const [userHasDragged, setUserHasDragged] = useState(false);
  const previousDataLength = useRef(data?.length || 0);

  const backdropOpacity = useTransform(
    drawerHeight,
    [minHeight, maxHeight],
    [0, 0.5]
  );

  const snapToHeight = (height) => {
    animate(drawerHeight, height, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    onDrawerHeightChange(height);
  };

  const handleDataChange = () => {
    const currentDataLength = data?.length || 0;

    if (!userHasDragged || !initialAdjustmentMade.current) {
      if (
        currentDataLength === 1 ||
        (previousDataLength.current === 0 && currentDataLength > 0)
      ) {
        snapToHeight(maxHeight * 0.5); // 50% height
        initialAdjustmentMade.current = false;
        setUserHasDragged(false);
      } else if (previousDataLength.current > 0 && currentDataLength === 0) {
        snapToHeight(minHeight);
      }
    } else {
      if (currentDataLength === 0) {
        snapToHeight(minHeight);
      }
    }

    previousDataLength.current = currentDataLength;
  };

  useEffect(() => {
    handleDataChange();
  }, [data]);

  const handleSnapPoints = (currentHeight) => {
    const heightPercentage = (currentHeight / maxHeight) * 100;

    // When drawer is dragged above 80%, snap to full height
    if (heightPercentage > 80) {
      snapToHeight(maxHeight);
    }
    // When drawer is dragged below 15%, snap to minimum height
    else if (heightPercentage < 15) {
      snapToHeight(minHeight);
    }
    // Otherwise, snap to the current height
    else {
      snapToHeight(currentHeight);
    }
  };

  const bind = useDrag(
    ({ movement: [, my], offset: [, oy], last, velocity: [, vy] }) => {
      const newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, maxHeight - oy)
      );

      if (last) {
        // Handle snap points when drag ends
        handleSnapPoints(newHeight);
      } else {
        // Update height during drag
        onDrawerHeightChange(newHeight);
      }

      setUserHasDragged(true);
    },
    {
      bounds: { top: 0, bottom: maxHeight - minHeight },
      rubberband: true,
      from: () => [0, maxHeight - drawerHeight.get()],
    }
  );

  useEffect(() => {
    const unsubscribe = drawerHeight.onChange((v) => {
      setIsBottomSheetOpen(v > minHeight);
    });

    return () => unsubscribe();
  }, [drawerHeight, setIsBottomSheetOpen, minHeight]);

  const { styles } = useContext(ProductStoryContext);

  return (
    <>
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        style={{ opacity: backdropOpacity }}
        pointerEvents={drawerHeight.get() > minHeight ? "auto" : "none"}
        onClick={() => snapToHeight(minHeight)}
      />
      <MotionBox
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg={styles?.background_color || "white"}
        borderTopLeftRadius={16}
        borderTopRightRadius={16}
        boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)"
        overflow="hidden"
        style={{ height: drawerHeight }}
        {...bind()}
      >
        <VStack spacing={2} align="stretch">
          <Flex
            justify="center"
            align="center"
            h="30px"
            cursor="grab"
            _active={{ cursor: "grabbing" }}
            transition="all 0.2s"
          >
            {drawerHeight.get() < maxHeight && (
              <Box
                w="50px"
                h="4px"
                bg={styles?.handle_color || "gray.200"}
                borderRadius="full"
              />
            )}
            <BrandBanner data={data} />
          </Flex>

          <MotionBox
            overflowY="auto"
            style={{ maxHeight: useTransform(drawerHeight, (h) => h - 30) }}
          >
            {children}
          </MotionBox>
        </VStack>
      </MotionBox>
    </>
  );
}
