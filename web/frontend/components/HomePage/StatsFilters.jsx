import {
  Box,
  Button,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  Tooltip,
} from '@chakra-ui/react';
import { useMemo } from 'react';

export const StatsFilters = ({
  selectedTimeline,
  updateTimeline,
  statsButton,
}) => {
  return (
    <>
      <HStack justifyContent={'space-between'} alignItems={'center'}>
        <TimelineFilterContainer
          selectedTimeline={selectedTimeline}
          updateTimeline={updateTimeline}
        />

        <HStack gap={5}>

          {statsButton}
        </HStack>
      </HStack>
    </>
  );
};

const TimelineFilterContainer = ({ selectedTimeline, updateTimeline }) => {
  const timelines = useMemo(() => {
    return [
      { label: '1 Week', timeline: 7, shortLabel: '1W' },
      { label: '15 Days', timeline: 15, shortLabel: '15D' },
      { label: '1 Month', timeline: 30, shortLabel: '1M' },
      { label: '3 Months', timeline: 90, shortLabel: '3M' },
      { label: '6 Months', timeline: 180, shortLabel: '6M' },
      { label: '1 Year', timeline: 365, shortLabel: '1Y' },
    ];
  }, []);

  return (
    <HStack spacing={1.5}>
      {timelines?.map(({ label, timeline, shortLabel }) => {
        const isActiveTimeline = selectedTimeline === timeline;

        return (
          <TimelineTab
            label={label}
            timeline={timeline}
            shortLabel={shortLabel}
            isActive={isActiveTimeline}
            onClick={() => {
              updateTimeline(timeline);
            }}
          />
        );
      })}
    </HStack>
  );
};

const TimelineTab = ({ label, timeline, shortLabel, isActive, onClick }) => {
  const activeTabStyles = {
    size: 'md',
    colorScheme: undefined,
    backgroundColor: 'rgb(198, 246, 213)',
    _hover: {
      backgroundColor: 'rgb(198, 246, 213)',
    },
  };

  return (
    <Tooltip
      hasArrow
      label={label}
      size={'md'}
      colorScheme="blackAlpha"
      placement="bottom"
      rounded={'md'}
    >
      <Button size={'sm'} onClick={onClick} {...(isActive && activeTabStyles)}>
        {shortLabel}
      </Button>
    </Tooltip>
  );
};

export const StatsFilterSkeleton = () => {
  return (
    <Flex p={0} pr={4} gap={5} width={'100%'} height={'100%'}>
      <Box flex={1} bg="white" borderRadius={'lg'}>
        <Skeleton height={'100%'} />
      </Box>

      <Flex justifyContent={'space-between'} alignItems={'center'} gap={6}>
        <Skeleton borderRadius={'lg'} height={'100%'} width={'8rem'} />
        <Skeleton borderRadius={'lg'} height={'100%'} width={'6rem'} />
        <SkeletonCircle size={12} />
      </Flex>
    </Flex>
  );
};

export default StatsFilters;
