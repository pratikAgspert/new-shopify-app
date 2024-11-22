import {
  Box, SimpleGrid,
  Stack,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import StatsFilters from './StatsFilters';
import GeofencesStats from './Stats/GeofencesStats';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import LoadingModal from './HomePage/loading';

const CARD_ORDER_KEY = 'card-order';
const cardsOrder = [
  { id: '7', title: 'Geofence', type: 'geofence', isVisible: true },
];

export function getDateRange(daysBack) {
  if (daysBack === null) {
    return {};
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - daysBack);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return {
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
  };
}

export const HomePage = () => {
  const [selectedTimeline, setSelectedTimeline] = useState(30);
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [token, setToken] = useState(false);
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const [activeId, setActiveId] = useState(null);
  const [isShopCreated, setIsShopCreated] = useState(false);
  const [isProductFetched, setIsProductFetched] = useState(false);




  const [cards, setCards] = useState(() => {
    try {
      const cards = window?.localStorage?.getItem(CARD_ORDER_KEY);
      const cardsData = JSON.parse(cards);
      return cardsData?.length ? cardsData : cardsOrder;
    } catch (err) {
      return cardsOrder;
    }
  });

  const toggleCardVisibility = (id) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, isVisible: !card.isVisible } : card
      )
    );
  };

  const visibleCards = cards.filter((card) => card.isVisible);

  return (
    <>
      <LoadingModal
        isOpen={isOpen}
        isShopCreated={isShopCreated}
        isProductFetched={isProductFetched}
      />
      <Stack py={2} px={5}>
        <StatsFilters
          selectedTimeline={selectedTimeline}
          updateTimeline={(timeline) => {
            setSelectedTimeline((previousTimeline) => {
              return previousTimeline === timeline ? null : timeline;
            });
          }}
        />

        <DisplayWrapper
          wrapperStyles={{
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap',
            alignItems: 'start',
          }}
        >

              <SimpleGrid columns={3} spacing={4} w="full">
                {visibleCards?.map((card) => (
                  <Box
                    key={card?.id}
                    gridColumn={
                      ['batches', 'geofence'].includes(card?.type)
                        ? 'span 3'
                        : 'span 1'
                    }
                  >
                    <SortableStatsCard
                      {...card}
                      timeline={selectedTimeline}
                      toggleCardVisibility={toggleCardVisibility}
                      isActive={card?.id === activeId}
                    />
                  </Box>
                ))}
              </SimpleGrid>
           
        </DisplayWrapper>
      </Stack>
    </>
  );
};

export const DisplayWrapper = ({ children, wrapperStyles }) => {
  return (
    <Box
      borderRadius={'lg'}
      overflow={'hidden'}
      width={'100%'}
      height={'100% '}
      p={1}
      {...wrapperStyles}
    >
      {children}
    </Box>
  );
};

const SortableStatsCard = ({
  title,
  type,
  timeline,
}) => {

  const renderStatsComponent = () => {
    const props = {
      timeline,
      title,
    };

    switch (type) {
      case 'geofence':
        return <GeofencesStats {...props} />;
      default:
        return null;
    }
  };

  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      height="100%"
    >
      {renderStatsComponent()}
    </Box>
  );
};

export default HomePage;
