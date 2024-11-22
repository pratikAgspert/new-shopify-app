import {
  Box,
  HStack,
  Stack,
  Text,
  Icon,
  Select,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useQRScanStats } from "../../apiHooks/useStatisticsAPIs";
import { useEffect, useMemo, useState } from "react";
import { IoScanSharp } from "react-icons/io5";
import { IoIosBarcode } from "react-icons/io";
import { LiaMapMarkerAltSolid } from "react-icons/lia";
import { TbMapPinCode } from "react-icons/tb";
import { FillSkeleton } from "../../components/skeletons/PostSkeleton";
import { useProducts } from "../../apiHooks/useProducts";

export const QRAnalytics = ({
  timeline,
  setQrStats,
  selectedProduct,
  setSelectedProduct,
}) => {
  // const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    data: QRScanStats,
    isPending: isFetchingQRScanStats,
    isSuccess: isQRScanStatsSuccess,
  } = useQRScanStats(selectedProduct?.id, timeline);

  const { statsData: analyticsData, heatMapData } = useMemo(() => {
    const statsData = [];

    if (!selectedProduct?.id || !QRScanStats || QRScanStats?.detail)
      return statsData;

    const totalScans = QRScanStats?.total_scans ?? null;

    typeof totalScans === "number" &&
      statsData.push({
        statLabel: "All Scans",
        statValue: totalScans,
        icon: <IoScanSharp />,
      });

    const totalUniqueScans = QRScanStats?.total_unique_scans ?? null;

    typeof totalUniqueScans === "number" &&
      statsData.push({
        statLabel: "Unique Scans",
        statValue: totalUniqueScans,
        icon: <IoIosBarcode />,
      });

    const totalLocations = Object.keys(QRScanStats?.locations?.cities).reduce(
      (cities, cityName) => {
        if (cityName !== "unknown") cities++;
        return cities;
      },
      0
    );

    typeof totalLocations === "number" &&
      statsData.push({
        statLabel: "Locations",
        statValue: totalLocations,
        icon: <LiaMapMarkerAltSolid />,
      });

    const totalPincodes = Object.keys(QRScanStats?.locations?.pincodes).reduce(
      (pincodes, pincode) => {
        if (pincode !== "unknown") pincodes++;
        return pincodes;
      },
      0
    );

    typeof totalPincodes === "number" &&
      statsData.push({
        statLabel: "Pincodes",
        statValue: totalPincodes,
        icon: <TbMapPinCode />,
      });

    const heatMapData = Object.entries(QRScanStats?.city_to_coords || {})
      ?.filter(([city_name, obj]) => {
        return !(
          city_name === "unknown" ||
          obj?.lat === "unknown" ||
          obj?.lon === "unknown"
        );
      })
      ?.map(([city_name, coordObj]) => ({
        city: city_name,
        data: QRScanStats.locations.cities[city_name],
        radius:
          ((QRScanStats.locations.cities[city_name]?.num_scans || 0) /
            QRScanStats?.total_scans) *
          40, // 20 max raidus
        coords: [coordObj.lat, coordObj.lon],
      }));
    setQrStats({ qrstats: QRScanStats, heatMapData: heatMapData });
    return { statsData, heatMapData };
  }, [QRScanStats, selectedProduct]);

  const {
    data: productData,
    isPending: isFetchingProducts,
    isError: productsError,
  } = useProducts();

  const productList = useMemo(() => {
    return productData ?? [];
  }, [productData]);

  const handleProductChange = (productId) => {
    const product =
      productList?.find(({ id }) => id === Number(productId)) || null;

    setSelectedProduct(product);
  };

  useEffect(() => {
    if (productList?.length && !selectedProduct)
      setSelectedProduct(productList?.[0]);
  }, [selectedProduct, productList]);

  return (
    <>
      {(isFetchingQRScanStats || isFetchingProducts) && (
        <Box
          width={"16rem"}
          height={"18rem"}
          borderRadius={"lg"}
          overflow={"hidden"}
        >
          <FillSkeleton width="100%" height="100%" />
        </Box>
      )}

      {!isFetchingQRScanStats && !isFetchingProducts && (
        <>
          {QRScanStats && (
            <Box
              {...{
                maxW: "max-content",
                p: 4,
                boxShadow: "0.5px 0px 3px 0 #12121230",
                borderRadius: "lg",
                background: `radial-gradient(circle at 10% 20%, rgb(154, 198, 242) 0%,  rgb(111, 231, 176) 100.2%)`,
              }}
            >
              <VStack spacing={3} px={2}>
                <Select
                  value={selectedProduct?.id ?? ""}
                  variant={"filled"}
                  width={"fit-content"}
                  background={`white`}
                  size={"sm"}
                  _focus={{
                    boxShadow: "0.2px 0px 3px 0 rgb(111, 231, 176)",
                    background: "rgba(255,255,255)",
                    fontWeight: 500,
                    borderColor: `transparent`,
                  }}
                  onChange={(event) =>
                    handleProductChange(event?.target?.value ?? "")
                  }
                >
                  {productList?.map(({ name, id }) => {
                    return (
                      <Button as="option" size="sm" value={id} key={id}>
                        {name}
                      </Button>
                    );
                  })}
                </Select>

                <VStack
                  {...{
                    alignItems: "start",
                  }}
                >
                  {analyticsData?.map((data) => {
                    const { statLabel, statValue, icon } = data;
                    return (
                      <StatTab
                        statLabel={statLabel}
                        statValue={statValue}
                        icon={icon}
                      />
                    );
                  })}
                </VStack>
              </VStack>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export const StatTab = ({ statLabel, statValue, icon, onClick }) => {
  const validStats = typeof statValue === "number" && statValue >= 0;

  const hoverEffects = {
    as: "button",
    onClick: onClick,
    transition: "all 150ms ease-out",
    transform: `rotateY(0)`,
    border: "1px solid transparent",
    borderRadius: "lg",
    _hover: {
      background: `radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.46) 2.1%, rgba(233, 226, 226, 0.28) 90.1%)`,
      transform: "scale(0.95)",
      boxShadow: "0.1px 0.1px 2px 0 #12121230",
      backdropBlur: "2rem",
    },
  };

  return (
    <>
      {statLabel && validStats && icon?.type && (
        <HStack
          alignItems={"center"}
          spacing={5}
          {...(onClick && hoverEffects)}
        >
          <Stack bg={"white"} borderRadius={10} p={2}>
            <Icon as={icon?.type} boxSize={25} color={"#00b894"} />
          </Stack>

          <Stack spacing={0}>
            <Text mb={0} fontWeight={700} fontSize={"md"}>
              {statValue < 10 ? `0${statValue}` : `${statValue}`}
            </Text>

            <Text flex={1} mb={0} fontWeight={450} fontSize={"sm"}>
              {statLabel}
            </Text>
          </Stack>
        </HStack>
      )}
    </>
  );
};

export default QRAnalytics;
