import { Box, Select, Button, Flex, HStack, VStack } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import { Children, useEffect, useMemo, useState } from "react";
import { useGetGeofences } from "../../apiHooks/useLocations";
import Map from "./Map";
import { FillSkeleton } from "../../components/skeletons/PostSkeleton";
import { find_fitbound } from "../../utils/find_fitbound";
import QRAnalytics from "./QRAnalytics";
import QRStatsPieChart from "./QRStatsPieChart";

export const MapWrapper = ({
  selectedGeofence,
  updateGeofence,
  timeline,
  qrStats,
  setQrStats,
}) => {
  // const {
  //   data: geofenceData,
  //   isPending: isFetchingGeofenceData,
  //   isError: geofenceError,
  // } = useGetGeofences();

  // const geofenceLocations = useMemo(() => {
  //   return geofenceData?.locations ?? [];
  // }, [geofenceData]);

  const [mapData, setMapData] = useState(null);
  const [heatMapData, setHeatMapData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // useEffect(() => {
  //   if (!selectedGeofence) {
  //     const mapData = {
  //       center: { lat: 28.6139, lng: 77.209 },
  //       zoom: 10,
  //       positions: [],
  //     };

  //     setMapData(mapData);
  //     return;
  //   }

  //   const allGeofences = selectedGeofence?.geofences?.map(
  //     ({ geofence }) => geofence
  //   );

  //   const allPositions =
  //     allGeofences?.map((geofence) => {
  //       return geofence?.map(({ latitude, longitude }) => [
  //         latitude,
  //         longitude,
  //       ]);
  //     }) ?? [];

  //   const allGeofenceCoordinates = allGeofences?.reduce(
  //     (coordinates, geofence) => {
  //       coordinates?.push(...geofence);
  //       return coordinates;
  //     },
  //     []
  //   );

  //   const [center, zoom] = find_fitbound(allGeofenceCoordinates);

  //   const mapData = {
  //     center,
  //     zoom,
  //     positions: allPositions,
  //   };

  //   setMapData(mapData);
  // }, [selectedGeofence, geofenceLocations]);

  useEffect(() => {
    const { heatMapData } = qrStats;
    const mapData = {
      center: { lat: 28.6139, lng: 77.209 },
      zoom: 10,
      positions: [],
    };
    if (!heatMapData) {
      setMapData(mapData);
      return;
    }
    const allHeatMapCoords = heatMapData?.map((item) => ({
      latitude: item.coords?.[0],
      longitude: item.coords?.[1],
    }));
    const [center, zoom] = find_fitbound(allHeatMapCoords);
    setMapData({
      center,
      zoom,
      positions: [],
    });
  }, [qrStats, qrStats.heatMapData]);
  return (
    <>
      <MapContainer>
        <QRAnalytics
          setQrStats={setQrStats}
          // setHeatMapData={setHeatMapData}
          timeline={timeline}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />

        <Map
          timeline={timeline}
          heatMapData={qrStats.heatMapData}
          geofence={selectedGeofence}
          mapData={mapData}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      </MapContainer>

      {
        <Box
          borderRadius={"lg"}
          overflow={"hidden"}
          height={"18rem"}
          width={"100%"}
          mr={2}
        >
          <QRStatsPieChart QRStatsData={qrStats.qrstats} />
          {/* <FillSkeleton width="100%" height="100%" /> */}
        </Box>
      }
    </>
  );
};

const MapContainer = ({ children }) => {
  const [QRAnalytics, Map] = Children.toArray(children);

  return (
    <Box
      overflow={"hidden"}
      borderRadius={"lg"}
      height={"30rem"}
      position={"relative"}
    >
      <Flex
        position={"absolute"}
        width={"fit-content"}
        zIndex={"1000"}
        right={"0%"}
        top="0%"
        borderRadius={"lg"}
        background={"white"}
        boxShadow={"0.5px 0 5px 0 #00000080"}
      >
        {/* {GeofenceFilter} */}
        {QRAnalytics}
      </Flex>

      {Map}
    </Box>
  );
};

const GeofenceFilter = ({
  selectedGeofence,
  updateGeofence,
  geofenceOptions = [],
}) => {
  const onUpdateGeofence = (pincode) => {
    const geofence =
      geofenceOptions?.find((geofence) => geofence?.pin === pincode) || null;

    updateGeofence(geofence);
  };
  return (
    <Select
      variant="filled"
      placeholder="Select a Geofence"
      width={"15rem"}
      background={"white"}
      _hover={{ background: "white" }}
      focusBorderColor="transparent"
      value={selectedGeofence?.pin ?? ""}
      onChange={(event) => {
        event?.stopPropagation();
        onUpdateGeofence(event?.target?.value ?? "");
      }}
    >
      {geofenceOptions?.map(({ pin, name }) => {
        return (
          <Button as="option" size="lg" value={pin} key={pin}>
            {pin}
          </Button>
        );
      })}
    </Select>
  );
};

export default MapWrapper;
