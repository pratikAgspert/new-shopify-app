import {
  Button,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useMemo, useState, useEffect } from "react";
import { CgArrowLeft, CgArrowRight, CgClose } from "react-icons/cg";
import { MapWrapper as Map } from "../HomePage/MapWrapper";
import CarouselComponent from "../ProductStoryVisualizer/CarouselComponent";
import { ProductStoryContext } from "../../services/context";
import QRCode from "../../assets/AgSpeak_qr_code.png";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import TabbedContent from "../Generic/TabbedContent";
import { useProducts } from "../../apiHooks/useProducts";

const HomePage2 = () => {
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [isViewDemo, setIsViewDemo] = useState(false);
  const [qrStats, setQrStats] = useState({ qrstats: {}, heatMapData: [] });

  const { data: products } = useProducts();

  const contents = [];
  const sheetData = [];

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

  const totalScans = qrStats?.qrstats?.total_scans;
  const uniqueScans = qrStats?.qrstats?.total_unique_scans;
  const allLocations = Object.entries(
    qrStats?.qrstats?.locations?.cities || {}
  )?.length;
  const allPins = Object.entries(
    qrStats?.qrstats?.locations?.pincodes || {}
  )?.length;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const driverObj = driver({
    steps: [
      {
        element: ".step-1",
        popover: {
          title: "Select the product",
          description: "Click here for more details",
        },
      },
      {
        element: ".preview-experience-btn",
        popover: {
          title: "Preview Experience",
          description: "Click to preview the experience",
          onNextClick: () => {
            const button = document.querySelector(".preview-experience-btn");
            button?.click();
            return false;
          },
        },
      },
      {
        element: ".preview-qr-code",
        popover: {
          title: "Preview QR Code",
          description: "scan this QR code to see the experience",
          onNextClick: () => {
            onClose();
            driverObj?.moveNext();
            return false;
          },
        },
      },
      {
        element: ".add-story-btn",
        popover: {
          title: "Add Story",
          description: "Click to create a product story",
          onNextClick: () => {
            // Redirect to story builder
            const button = document.querySelector(".add-story-btn");
            button?.click();
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
    const hasRunBefore = localStorage.getItem("driverHasRun-homePage");

    if (products?.length === 0 && !hasRunBefore) {
      localStorage.setItem("driverHasRun-homePage", "true");

      setTimeout(() => {
        driverObj.drive();
      }, 1000);
    }
  }, [products]);

  const topCardsData = [
    {
      label: "Unique experiences",
      value: "N/A Experiences",
    },
    {
      label: "Unique links",
      value: "N/A Links",
    },
    {
      label: "Live on",
      value: "N/A Products",
    },
  ];

  return (
    <Stack p={3} alignItems={"start"} direction={{ base: "column", lg: "row" }}>
      <Stack
        spacing={3}
        overflow={"scroll"}
        w={{ base: "100%", lg: "70%" }}
        h={"96dvh"}
      >
        <Stack className="step-1" spacing={0}>
          <Text>Click on link to get a demo experience</Text>
          <Link
            href="#"
            target="_blank"
            color={"blue.300"}
            fontWeight={"semibold"}
          >
            brandname.agspeak.in
          </Link>
        </Stack>

        <Grid templateColumns="repeat(3, 1fr)" gap={3}>
          {topCardsData?.map((card, index) => {
            return (
              <TopStatCard
                key={index}
                label={card?.label}
                value={card?.value}
                selectedTabIndex={index}
              />
            );
          })}
        </Grid>

        <Button
          className="preview-experience-btn"
          px={10}
          py={6}
          bg={"green.300"}
          boxShadow={"md"}
          w={"fit-content"}
          alignSelf={"center"}
          color={"white"}
          borderRadius={100}
          onClick={() => {
            onOpen();
            setTimeout(() => {
              driverObj?.moveNext();
            }, 500);
          }}
        >
          Preview
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Preview Experience</ModalHeader>
            <ModalBody>
              <Stack
                className="preview-qr-code"
                bg={"blackAlpha.900"}
                borderRadius={8}
                color={"white"}
                w={"85%"}
                textAlign={"center"}
                p={3}
              >
                <Text>Sample QR Code</Text>

                <Stack bg={"white"} p={2} borderRadius={5}>
                  <Image src={QRCode} alt="QR-code" />
                </Stack>

                <Text>
                  Scan using your phone camera to get experience in your phone
                </Text>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Button
          className="add-story-btn"
          px={10}
          py={6}
          bg={"green.300"}
          boxShadow={"md"}
          w={"fit-content"}
          alignSelf={"center"}
          color={"white"}
          borderRadius={100}
          onClick={() => {
            driverObj?.moveNext();
            window.location.href = "/storyBuilder";
          }} // Redirect to story builder
        >
          Create your first experience
        </Button>

        <Stack bg={"white"} p={3} borderRadius={5}>
          <Stack>
            <Text>Analytics</Text>

            <Grid templateColumns="repeat(4, 2fr)" gap={3}>
              <AnalyticsCard label={"All Scans"} value={totalScans || 0} />
              <AnalyticsCard label={"Unique Scans"} value={uniqueScans || 0} />
              <AnalyticsCard
                label={"All Locations"}
                value={allLocations || 0}
              />
              <AnalyticsCard label={"All Pins/Zips"} value={allPins || 0} />
              <AnalyticsCard label={"Unique IPs"} value={"N/A"} />
              <AnalyticsCard label={"Referral Conversions"} value={"N/A"} />
              <AnalyticsCard isOSBrowserStats qrStatsData={qrStats?.qrstats} />
            </Grid>
          </Stack>

          <Stack>
            <Map
              qrStats={qrStats}
              setQrStats={setQrStats}
              selectedGeofence={selectedGeofence}
              updateGeofence={(geofence) => setSelectedGeofence(geofence)}
            />
          </Stack>
        </Stack>
      </Stack>

      <Stack w={{ base: "100%", lg: "30%" }}>
        <ProductStoryContext.Provider value={productStoryContextValue}>
          {isViewDemo ? (
            <Stack spacing={0}>
              <Button
                leftIcon={<CgArrowLeft fontSize={20} />}
                onClick={() => setIsViewDemo(!isViewDemo)}
                alignSelf={"start"}
                size={"sm"}
              >
                Back
              </Button>

              <Stack
                w="277.4px"
                h="572.85px"
                borderWidth={5}
                borderColor="black"
                borderRadius={50}
                overflow="hidden"
                boxShadow="lg"
                position="relative"
                alignSelf={"center"}
              >
                <CarouselComponent
                  productData={contents || []}
                  defaultSheetData={sheetData || []}
                />
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={1}>
              <Link
                display={"flex"}
                gap={3}
                alignItems={"center"}
                alignSelf={"flex-end"}
                onClick={() => driverObj.drive()}
              >
                <Text
                  textTransform={"uppercase"}
                  fontWeight={"bold"}
                  fontSize={16}
                >
                  Guide Tour
                </Text>
                <CgArrowRight fontSize={20} />
              </Link>

              <Stack
                w="277.4px"
                h="572.85px"
                borderWidth={5}
                borderColor="black"
                borderRadius={50}
                overflow="hidden"
                boxShadow="lg"
                justifyContent={"end"}
                alignItems={"center"}
                alignSelf={"center"}
                pb={50}
              >
                <Stack
                  bg={"blackAlpha.900"}
                  borderRadius={8}
                  color={"white"}
                  w={"85%"}
                  textAlign={"center"}
                  p={3}
                >
                  <Text>Sample QR Code</Text>

                  <Stack bg={"white"} p={2} borderRadius={5}>
                    <Image src={QRCode} alt="QR-code" />
                  </Stack>

                  <Text>
                    Scan using your phone camera to get experience in your phone
                  </Text>
                </Stack>

                <Button
                  colorScheme="blue"
                  borderRadius={100}
                  size={"sm"}
                  onClick={() => setIsViewDemo(!isViewDemo)}
                >
                  Preview
                </Button>

                <Button colorScheme="green" borderRadius={100} size={"sm"}>
                  Use this Template
                </Button>
              </Stack>
            </Stack>
          )}
        </ProductStoryContext.Provider>
      </Stack>
    </Stack>
  );
};

const TopStatCard = ({ label, value, selectedTabIndex }) => {
  const modalOptions = useDisclosure();
  const { onOpen } = modalOptions;
  return (
    <>
      <GridItem
        bg={"white"}
        borderRadius={5}
        p={3.5}
        py={5}
        spacing={0}
        onClick={onOpen}
      >
        <HStack justifyContent={"space-between"}>
          <Text fontSize={14} fontWeight={"medium"}>
            {label}
          </Text>
          <CgArrowRight fontSize={20} />
        </HStack>
        <Text fontSize={20} fontWeight={"bold"}>
          {value}
        </Text>
      </GridItem>

      {/* <TopCardsPopover
        modalOptions={modalOptions}
        selectedTabIndex={selectedTabIndex}
      /> */}
    </>
  );
};

const AnalyticsCard = ({
  label,
  value,
  isOSBrowserStats = false,
  qrStatsData = null,
}) => {
  const browserColors = [
    "yellow.300",
    "green.300",
    "blue.300",
    "purple.300",
    "pink.300",
  ];
  const osColors = [
    "orange.300",
    "red.300",
    "teal.300",
    "cyan.300",
    "indigo.300",
  ];

  const { browsersStats, OSStats } = useMemo(() => {
    const browsers = qrStatsData?.devices?.browsers || {};
    const os = qrStatsData?.devices?.os || {};

    const calculatePercentages = (data) => {
      const total = Object.values(data).reduce(
        (sum, item) => sum + (item?.num_scans || 0),
        0
      );
      return Object.entries(data).map(([name, scanData]) => {
        const count = scanData?.num_scans || 0;
        const percentage =
          total > 0 ? ((count / total) * 100).toFixed(2) : "0.00";
        return {
          state: name,
          count: count,
          percentage: `${percentage}%`,
        };
      });
    };

    const browsersStats = calculatePercentages(browsers);
    const OSStats = calculatePercentages(os);

    return { browsersStats, OSStats };
  }, [qrStatsData]);

  console.log("browsersStats, OSStats==>", browsersStats, "::::", OSStats);

  return (
    <>
      {isOSBrowserStats ? (
        <GridItem
          position={"relative"}
          p={2}
          bg={"blue.100"}
          borderRadius={5}
          colSpan={2}
        >
          <Stack h={"100%"} spacing={1} alignItems={"end"}>
            {browsersStats?.map((stat, index) => {
              return (
                <Stack
                  key={index}
                  bg={browserColors[index % browserColors.length]}
                  w={stat?.percentage}
                  h={"25%"}
                  px={2}
                  borderRadius={5}
                >
                  <Text fontSize={10} fontWeight={"semibold"}>
                    {stat?.state} ({stat?.percentage})
                  </Text>
                </Stack>
              );
            })}
            {OSStats?.map((stat, index) => {
              return (
                <Stack
                  key={index}
                  bg={osColors[index % osColors.length]}
                  w={stat?.percentage}
                  h={"25%"}
                  px={2}
                  borderRadius={5}
                >
                  <Text fontSize={10} fontWeight={"semibold"}>
                    {stat?.state} ({stat?.percentage})
                  </Text>
                </Stack>
              );
            })}
            <Text fontSize={12} fontWeight={"medium"} alignSelf={"start"}>
              OS/Browser Stats
            </Text>
          </Stack>
        </GridItem>
      ) : (
        <GridItem
          p={2}
          bg={"blue.100"}
          borderRadius={5}
          spacing={0}
          colSpan={1}
        >
          <Text fontSize={12} fontWeight={"medium"}>
            {label}
          </Text>
          <Text fontSize={20} fontWeight={"bold"}>
            {value}
          </Text>
        </GridItem>
      )}
    </>
  );
};

// const TopCardsPopover = ({ modalOptions, selectedTabIndex }) => {
//   const { isOpen, onClose } = modalOptions;

//   const [selectedTab, setSelectedTab] = useState(selectedTabIndex);

//   return (
//     <>
//       <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
//         <ModalOverlay />
//         <ModalContent borderRadius={15}>
//           <ModalBody py={6}>
//             <Stack alignItems={"center"}>
//               <TabbedContent
//                 tabs={["Unique Experiences", "Unique Links", "Live Products"]}
//                 selectedTabIndex={selectedTab}
//                 onTabChange={setSelectedTab}
//               >
//                 <Stack alignItems={"center"}>
//                   <Text>
//                     Unique Experiences Lorem ipsum dolor sit amet consectetur
//                     adipisicing elit. Natus adipisci saepe voluptate recusandae
//                     fuga fugit esse! Nesciunt reprehenderit iure accusantium in,
//                     minima odio asperiores repellendus voluptatibus placeat
//                     velit eos explicabo.
//                   </Text>
//                 </Stack>
//                 <Stack alignItems={"center"}>
//                   <Text>
//                     Unique Links Lorem ipsum dolor sit amet consectetur
//                     adipisicing elit. Natus adipisci saepe voluptate recusandae
//                     fuga fugit esse! Nesciunt reprehenderit iure accusantium in,
//                     minima odio asperiores repellendus voluptatibus placeat
//                     velit eos explicabo.
//                   </Text>
//                 </Stack>
//                 <Stack alignItems={"center"}>
//                   <Text>
//                     Live Products Lorem ipsum dolor sit amet consectetur
//                     adipisicing elit. Atque et eaque quidem quisquam dignissimos
//                     est delectus fugit labore quasi iusto. Harum debitis
//                     deleniti molestias accusamus nihil, suscipit incidunt sunt
//                     adipisci.
//                   </Text>
//                 </Stack>
//               </TabbedContent>
//             </Stack>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

export default HomePage2;
