import {
  Box,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
  Icon,
  PopoverHeader,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { Html, OrbitControls, useVideoTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, {
  Suspense,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import * as THREE from "three";
import { HeroSection } from "./HeroSection";
// import MediaContentIn360 from './MediaContentIn360';
import ScreenInfoCard from "./generic/ScreenInfoCard";
import { InfoIcon } from "@chakra-ui/icons";
// import { ProductStoryContext } from "../services/context";
import { nanoid } from "nanoid";
import { useThrottle } from "@uidotdev/usehooks";
import CircularLoader from "../ProductStoryBuilder/CircularLoader";
import { IoAlertCircleOutline } from "react-icons/io5";
import { CgCloseO } from "react-icons/cg";
import { motion } from "framer-motion";
import { ProductStoryContext } from "../../services/context";

export const LoadingBox = () => (
  <Box
    height={"100dvh"}
    width={"100dvw"}
    display={"flex"}
    justifyContent={"center"}
    borderWidth={4}
    alignItems={"center"}
  >
    <Box className="animate-pulse">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Box>
  </Box>
);

function Loading() {
  return (
    <Html>
      <LoadingBox />
    </Html>
  );
}

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
  // }, [throttledValue]);

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
              right={-10}
              top={-10}
              zIndex={10}
              color="red"
              bg="white"
              borderRadius="100%"
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
          maxW="200px"
          gap={5}
          p={8}
          pt={!isDisabled && 15}
        >
          <PopoverCloseButton
            position="absolute"
            top={5}
            right={5}
            fontSize={10}
            zIndex={5}
            onClick={onClose}
          />

          <PopoverBody zIndex={3} mt={3} minW={"fit-content"} maxW="200px">
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
                  size="small"
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
                    p={2}
                    px={8}
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

const ImageSphere = ({
  data,
  image_url,
  setIsInteracting,
  isBottomSheetOpen,
  onSphereClick,
  slideId,
}) => {
  const { gl, camera, scene } = useThree();
  const [textureLoadingError, setTextureLoadingError] = useState("");
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  let imageTexture = useRef(null);
  const sphereRef = useRef();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const isDragging = useRef(false);
  const clickStartTime = useRef(0);
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const {
    addInfoPoint,
    removeInfoPoint,
    getInfoPoints,
    updateInfoPointText,
    isDisabled,
  } = useContext(ProductStoryContext);
  const infoPoints = getInfoPoints(slideId);

  // Fixed texture loading code
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const cleanImageUrl = image_url.split("?")[0];

    textureLoader.load(
      cleanImageUrl,
      (texture) => {
        texture.encoding = THREE.sRGBEncoding;
        imageTexture.current = texture;
        setLoadingPercentage(100);
      },
      (event) => {
        const total = event.total || 1;
        const loaded = event.loaded || 0;
        setLoadingPercentage((loaded / total) * 100);
      },
      (error) => {
        console.error("Error loading texture:", error);
        setTextureLoadingError(error?.message || "Error loading image");
      }
    );

    return () => {
      if (imageTexture.current) {
        imageTexture.current.dispose();
      }
    };
  }, [image_url]);

  useEffect(() => {
    if (!isDisabled) {
      const handlePointerDown = (event) => {
        setIsInteracting(true);
        isDragging.current = false;
        clickStartTime.current = Date.now();
      };
      const handlePointerUp = (event) => {
        setIsInteracting(false);
        const clickDuration = Date.now() - clickStartTime.current;
        if (clickDuration < 300 && !isDragging.current) {
          handleClick(event);
        }
      };
      const handleClick = (event) => {
        const rect = gl.domElement.getBoundingClientRect();
        const clientX = event.clientX - rect.left;
        const clientY = event.clientY - rect.top;
        mouse.x = (clientX / rect.width) * 2 - 1;
        mouse.y = -(clientY / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(sphereRef.current);
        if (intersects.length > 0) {
          const point = intersects[0].point;
          const pointId = nanoid();
          addInfoPoint(slideId, pointId, {
            coords: point,
            id: pointId,
            text: "",
          });
          if (onSphereClick) {
            onSphereClick(point);
          }
        }
      };

      gl.domElement.addEventListener("pointerdown", handlePointerDown);
      gl.domElement.addEventListener("pointerup", handlePointerUp);

      return () => {
        gl.domElement.removeEventListener("pointerdown", handlePointerDown);
        gl.domElement.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [gl, setIsInteracting, camera, onSphereClick, isDisabled]);

  if (imageTexture.current === null) {
    if (textureLoadingError) {
      return (
        <Html>
          <Stack w={"100dvw"} position={"relative"}>
            <Stack
              w={"100%"}
              position={"absolute"}
              left={-25}
              top={-50}
              justifyContent={"center"}
            >
              <Icon
                as={IoAlertCircleOutline}
                fontSize={"xxx-large"}
                color={"red"}
              />
              <Text mb={0} position={"absolute"} left={-35} top={50}>
                {textureLoadingError}
              </Text>
            </Stack>
          </Stack>
        </Html>
      );
    }
    return (
      <Html>
        <Stack w={"100dvw"} position={"relative"}>
          <Stack position={"absolute"}>
            <CircularLoader
              progress={Math.round(loadingPercentage)}
              color={"black"}
            />
          </Stack>
        </Stack>
      </Html>
    );
  }

  return (
    <>
      {imageTexture.current ? (
        <>
          <ambientLight intensity={0.8} />
          <mesh ref={sphereRef}>
            <sphereGeometry args={[1, 100, 100]} />
            <meshStandardMaterial
              map={imageTexture.current}
              side={THREE.DoubleSide}
            />
          </mesh>

          {Object.entries(infoPoints || {})
            .filter(([_, point]) => point && Object.keys(point).length > 0)
            .map(([pointId, point], index) => (
              <Html
                key={point.id}
                position={[point.coords.x, point.coords.y, point.coords.z]}
              >
                <InfoButton
                  index={index}
                  slideId={slideId}
                  pointId={pointId}
                  text={point.text}
                  updateInfoPointText={updateInfoPointText}
                  removeInfoPoint={removeInfoPoint}
                  isOpen={openPopoverIndex === index}
                  onToggle={() =>
                    setOpenPopoverIndex((prev) =>
                      prev === index ? null : index
                    )
                  }
                  onClose={() => setOpenPopoverIndex(null)}
                  isDisabled={isDisabled}
                  setOpenPopoverIndex={setOpenPopoverIndex}
                />
              </Html>
            ))}

          {isBottomSheetOpen && (
            <>
              {/* <MediaContentIn360 data={data?.farmer_info} /> */}

              {data?.screen_info?.map((info) => {
                return (
                  <Html
                    key={info}
                    position={[info?.x_axis, info?.y_axis, info?.z_axis]}
                  >
                    <ScreenInfoCard data={info} />
                  </Html>
                );
              })}
            </>
          )}
        </>
      ) : (
        <Html>
          <Stack w={"50vw"} left={50} position={"relative"}>
            <Text position={"absolute"} left={-120}>
              Texture is Loading...
            </Text>
          </Stack>
        </Html>
      )}
    </>
  );
};

const VideoSphere = ({
  data,
  image_url,
  targetRotation,
  setIsInteracting,
  isBottomSheetOpen,
  onSphereClick,
  slideId,
}) => {
  const { gl, camera, scene } = useThree();
  let videoTexture = useVideoTexture(image_url);
  const meshRef = useRef();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const isDragging = useRef(false);
  const clickStartTime = useRef(0);
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
  const {
    addInfoPoint,
    removeInfoPoint,
    getInfoPoints,
    updateInfoPointText,
    isDisabled,
  } = useContext(ProductStoryContext);
  const infoPoints = getInfoPoints(slideId);

  useEffect(() => {
    if (meshRef.current && targetRotation) {
      meshRef.current.rotation.y = targetRotation;
    }
  }, []);

  useEffect(() => {
    if (!isDisabled) {
      const handlePointerDown = (event) => {
        setIsInteracting(true);
        isDragging.current = false;
        clickStartTime.current = Date.now();
      };
      const handlePointerUp = (event) => {
        setIsInteracting(false);
        const clickDuration = Date.now() - clickStartTime.current;
        if (clickDuration < 300 && !isDragging.current) {
          handleClick(event);
        }
      };
      const handleClick = (event) => {
        const rect = gl.domElement.getBoundingClientRect();
        const clientX = event.clientX - rect.left;
        const clientY = event.clientY - rect.top;
        mouse.x = (clientX / rect.width) * 2 - 1;
        mouse.y = -(clientY / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(meshRef.current);
        if (intersects.length > 0) {
          const point = intersects[0].point;
          const pointId = nanoid();
          addInfoPoint(slideId, pointId, {
            coords: point,
            id: pointId,
            text: "",
          });
          if (onSphereClick) {
            onSphereClick(point);
          }
        }
      };

      gl.domElement.addEventListener("pointerdown", handlePointerDown);
      gl.domElement.addEventListener("pointerup", handlePointerUp);

      return () => {
        gl.domElement.removeEventListener("pointerdown", handlePointerDown);
        gl.domElement.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [gl, setIsInteracting, camera, onSphereClick, isDisabled]);

  return (
    <>
      {videoTexture ? (
        <>
          <ambientLight intensity={2} />
          <mesh ref={meshRef}>
            <sphereGeometry args={[1, 100, 100]} />
            <meshStandardMaterial map={videoTexture} side={THREE.DoubleSide} />
          </mesh>

          {Object.entries(infoPoints || {})
            .filter(([_, point]) => point && Object.keys(point).length > 0)
            .map(([pointId, point], index) => (
              <Html
                key={point.id}
                position={[point.coords.x, point.coords.y, point.coords.z]}
              >
                <InfoButton
                  index={index}
                  slideId={slideId}
                  pointId={pointId}
                  text={point.text}
                  updateInfoPointText={updateInfoPointText}
                  removeInfoPoint={removeInfoPoint}
                  isOpen={openPopoverIndex === index}
                  onToggle={() =>
                    setOpenPopoverIndex((prev) =>
                      prev === index ? null : index
                    )
                  }
                  onClose={() => setOpenPopoverIndex(null)}
                  isDisabled={isDisabled}
                  setOpenPopoverIndex={setOpenPopoverIndex}
                />
              </Html>
            ))}

          {isBottomSheetOpen && (
            <>
              {/* <MediaContentIn360 data={data?.farmer_info} /> */}

              {data?.screen_info?.map((info) => {
                return (
                  <Html
                    key={info}
                    position={[info?.x_axis, info?.y_axis, info?.z_axis]}
                  >
                    <ScreenInfoCard data={info} />
                  </Html>
                );
              })}
            </>
          )}
        </>
      ) : (
        <Html>
          <Stack w={"50vw"} left={50} position={"relative"}>
            <Text position={"absolute"} left={-120}>
              Texture is Loading...
            </Text>
          </Stack>
        </Html>
      )}
    </>
  );
};

const Sphere = ({
  data,
  setIsInteracting,
  isBottomSheetOpen,
  targetRotation,
  slideId,
}) => {
  const image_360 = data?.find((info) => info?.type === "carousel_360_image");
  const video_360 = data?.find((info) => info?.type === "carousel_360_video");
  if (image_360) {
    return (
      image_360?.image_url && (
        <ImageSphere
          slideId={slideId}
          targetRotation={targetRotation}
          data={image_360}
          setIsInteracting={setIsInteracting}
          image_url={image_360?.image_url}
          isBottomSheetOpen={isBottomSheetOpen}
        />
      )
    );
  } else if (video_360) {
    return (
      <VideoSphere
        slideId={slideId}
        targetRotation={targetRotation}
        data={video_360}
        setIsInteracting={setIsInteracting}
        image_url={video_360?.image_url}
        isBottomSheetOpen={isBottomSheetOpen}
      />
    );
  }
  return null;
};

const FrameUpdater = ({ setIsInsideSphere }) => {
  useFrame(({ camera }) => {
    setIsInsideSphere(camera.position.length() <= 1);
  });
  return null;
};

export const Scene = ({
  data,
  isBottomSheetOpen,
  setIsBottomSheetOpen,
  setIsInteracting,
  header,
  fov,
  targetRotation,
  zoom = 1,
  slideId,
}) => {
  const [isInsideSphere, setIsInsideSphere] = useState(true);

  // const { ref, inView } = useInView({
  //   threshold: 0.6, onChange: (inView, entry) => {
  //     console.log("value of changing view", header, inView, entry)
  //   }
  //   // triggerOnce: true, // Only trigger once for optimization
  // });

  // console.log("value of inView", header, inView)
  return (
    // <Box ref={ref} w={"100dvw"} h={"100dvh"}>
    <Box
      className="scene-container"
      w={"268px"}
      h={"100dvh"}
      position={"relative"}
    >
      {/* {inView ? */}
      <>
        <Canvas camera={{ position: [0, 0, 0.001], fov: 70, zoom: [zoom] }}>
          <ambientLight intensity={1} />
          <axesHelper args={[5]} />
          <Suspense fallback={Loading}>
            {data && (
              <Sphere
                targetRotation={targetRotation}
                setIsInteracting={setIsInteracting}
                data={data}
                slideId={slideId}
                isBottomSheetOpen={isBottomSheetOpen}
              />
            )}
          </Suspense>
          <OrbitControls enableRotate={true} enableZoom={true} />
          <FrameUpdater setIsInsideSphere={setIsInsideSphere} />
        </Canvas>
        {isInsideSphere && (
          <>
            <HeroSection
              header={header}
              data={data}
              setIsBottomSheetOpen={(val) => {
                setIsBottomSheetOpen(val);
                setIsInteracting(!val);
              }}
            />
          </>
        )}
      </>
    </Box>
  );
};
