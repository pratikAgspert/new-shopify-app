import {
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Modal,
  ModalBody,
} from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { Tooltip } from 'react-leaflet/Tooltip';
import ExpandedQRStats from './ExpandedQRStats';

export const Map = ({
  geofence,
  mapData,
  heatMapData,
  selectedProduct,
  setSelectedProduct,
  timeline
}) => {
  const [bounds, setBounds] = useState();
  const [clickedHeatPointData, setClickedHeatPointData] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    setBounds({
      ...(mapData?.center && {
        center: [mapData?.center?.lat, mapData?.center?.lng],
      }),

      ...(mapData?.zoom && {
        zoom: mapData?.zoom,
      }),
    });
  }, [mapData]);

  const modalDisclosure = useDisclosure();
  const { isOpen, onClose, onOpen } = modalDisclosure;

  return (
    <>
      <Modal
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size={'3xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton size={'lg'} />
          <ModalBody py={6} pt={8}>
            <ExpandedQRStats
            timeline={timeline}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              data={clickedHeatPointData}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <MapContainer
        center={bounds?.center || { lat: 28.6139, lng: 77.209 }}
        zoom={bounds?.zoom || 10}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
      >
        {bounds?.center && bounds?.zoom && (
          <ChangeView center={bounds?.center} zoom={bounds?.zoom} />
        )}

        <TileLayer
          attribution="Google Maps"
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
        />

        {heatMapData?.length
          ? heatMapData?.map((item) => {
              const { city, coords, radius, data } = item;
              return (
                <CircleMarker
                  eventHandlers={{
                    click: () => {
                      setClickedHeatPointData((prev) => item);
                      setSelectedCity(item?.city);
                      console.log('circle clicked', item);
                      onOpen();
                      console.log('circle clicked1', item);
                    },
                  }}
                  center={coords}
                  pathOptions={{ color: '#3498db' }}
                  radius={radius || 15} // 40 max
                >
                  <Tooltip>
                    <h2>{city}</h2>
                    {data?.num_scans && <div>Scans: {data.num_scans}</div>}
                    {data?.num_unique_scans && (
                      <div>Unique Scans: {data.num_unique_scans}</div>
                    )}
                  </Tooltip>
                </CircleMarker>
              );
            })
          : null}
        {mapData?.positions?.map((position) => {
          return (
            <Polygon
              pathOptions={{
                color: 'green',
                fillColor: '#00b894',
                fillOpacity: '0.6',
              }}
              positions={position}
            />
          );
        })}

        {/* {bounds?.center && (
        <Marker position={bounds?.center}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      )} */}
      </MapContainer>
    </>
  );
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default Map;
