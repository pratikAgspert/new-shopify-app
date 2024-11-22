import { Box, HStack, Icon, Skeleton, Stack, Text } from '@chakra-ui/react';
import { Children, useMemo } from 'react';
import { AiOutlineTransaction } from 'react-icons/ai';
import { GiBirchTrees } from 'react-icons/gi';
import { GoWorkflow } from 'react-icons/go';
import { LuTimer } from 'react-icons/lu';
import {
  MdOutlineAccountTree,
  MdOutlineTimerOff,
  MdPeopleOutline,
} from 'react-icons/md';

import {
  useBalanceStats,
  useCreatedBatchStats,
  useFarmerStats,
  useGeofenceStats,
  useHarvestStats,
  useMovedBatchStats,
} from '../../../apiHooks/useStatisticsAPIs';

import {
  useCompletedBatches,
  useGetBatch as useGetBatches,
} from '../../../apiHooks/useBatches';

import { PendingRequestStats as RequestStats } from './PendingRequestStats';
import { StatsContainer } from './StatsContainer';
import { FaMapMarkerAlt } from 'react-icons/fa';

export const AppStats = ({ timeline }) => {
  const farmerStatsQuery = useFarmerStats(timeline);
  const harvestStatsQuery = useHarvestStats(timeline);
  const geofenceStatsQuery = useGeofenceStats(timeline);
  const createdBatchStatsQuery = useCreatedBatchStats(timeline);
  const movedBatchStatsQuery = useMovedBatchStats(timeline);
  const activeBatchStatsQuery = useGetBatches(timeline);
  const completedBatchStatsQuery = useCompletedBatches(timeline);
  const balanceStatsQuery = useBalanceStats(timeline);

  const { isFetchingStats, statsData, farmsStatsData, processesStatsData } =
    useMemo(() => {
      const {
        data: farmerStats,
        isPending: isFetchingFarmerStats,
        isError: farmerStatsError,
      } = farmerStatsQuery;

      const {
        data: harvestStats,
        isPending: isFetchingHarvestStats,
        isError: harvestStatsError,
      } = harvestStatsQuery;

      const {
        data: geofenceStats,
        isPending: isFetchingGeofenceStats,
        isError: geofenceStatsError,
      } = geofenceStatsQuery;

      const {
        data: createdBatchStats,
        isPending: isFetchingCreatedBatchStats,
        isError: createdBatchStatsError,
      } = createdBatchStatsQuery;

      const {
        data: movedBatchStats,
        isPending: isFetchingMovedBatchStats,
        isError: movedBatchStatsError,
      } = movedBatchStatsQuery;

      const {
        data: batchData,
        isPending: isFetchingBatches,
        isError: batchError,
      } = activeBatchStatsQuery;

      const {
        data: completedBatchData,
        isPending: isFetchingCompletedBatches,
        isError: completedBatchError,
      } = completedBatchStatsQuery;

      const {
        data: balanceData,
        isPending: isFetchingBalances,
        isError: balanceError,
      } = balanceStatsQuery;

      const isFetchingStats =
        isFetchingFarmerStats ||
        isFetchingHarvestStats ||
        isFetchingCreatedBatchStats ||
        isFetchingMovedBatchStats ||
        isFetchingBatches ||
        isFetchingCompletedBatches ||
        isFetchingBalances ||
        isFetchingGeofenceStats;

      const statsData = [];
      const farmsStatType = 'farms';
      const processesStatType = 'processes';

      typeof farmerStats?.total === 'number' &&
        statsData.push({
          statLabel: 'Farmers',
          statValue: farmerStats?.total,
          icon: <MdPeopleOutline />,
          path: '/users?category=farmers',
          statType: farmsStatType,
          isCreatable: false,
        });

      typeof harvestStats?.total === 'number' &&
        statsData.push({
          statLabel: 'Harvests',
          statValue: harvestStats?.total,
          icon: <GiBirchTrees />,
          path: '/users?category=farmers',
          statType: farmsStatType,
          isCreatable: false,
        });

      typeof createdBatchStats?.total === 'number' &&
        statsData.push({
          statLabel: 'Created Batches',
          statValue: createdBatchStats?.total,
          icon: <MdOutlineAccountTree />,
          path: '/supplychain',
          statType: processesStatType,
          isCreatable: true,
        });

      typeof batchData?.length === 'number' &&
        statsData.push({
          statLabel: 'Active Batches',
          statValue: batchData?.length,
          icon: <LuTimer />,
          path: '/supplychain',
          statType: processesStatType,
          isCreatable: false,
        });

      typeof movedBatchStats?.total === 'number' &&
        statsData.push({
          statLabel: 'Moved Batches',
          statValue: movedBatchStats?.total,
          icon: <GoWorkflow />,
          path: '/supplychain',
          statType: processesStatType,
          isCreatable: false,
        });

      typeof completedBatchData?.length === 'number' &&
        statsData.push({
          statLabel: 'Completed Batches',
          statValue: completedBatchData?.length,
          icon: <MdOutlineTimerOff />,
          path: '/supplychain?is_complete=true',
          statType: processesStatType,
          isCreatable: false,
        });

      typeof balanceData?.num_transactions === 'number' &&
        statsData.push({
          statLabel: 'Total Transactions',
          statValue: balanceData?.num_transactions,
          icon: <AiOutlineTransaction />,
          path: '/procurement?section=balances',
          statType: processesStatType,
          isCreatable: true,
        });

      typeof geofenceStats?.total === 'number' &&
        statsData.push({
          statLabel: 'Geofences',
          statValue: geofenceStats?.total,
          icon: <FaMapMarkerAlt />,
          path: '/weather',
          statType: farmsStatType,
          isCreatable: false,
        });

      const { farmsStatsData, processesStatsData } = statsData?.reduce(
        (data, stat) => {
          if (stat.statType === processesStatType)
            data.processesStatsData.push(stat);

          if (stat.statType === farmsStatType) data.farmsStatsData.push(stat);

          return data;
        },
        {
          farmsStatsData: [],
          processesStatsData: [],
        }
      );

      return {
        isFetchingStats,
        statsData,
        farmsStatsData,
        processesStatsData,
      };
    }, [
      farmerStatsQuery,
      harvestStatsQuery,
      geofenceStatsQuery,
      createdBatchStatsQuery,
      movedBatchStatsQuery,
      activeBatchStatsQuery,
      completedBatchStatsQuery,
      balanceStatsQuery,
    ]);

  return (
    <>
      {isFetchingStats && <AppStatsSkeleton />}

      {!isFetchingStats && (
        <>
          <StatsWrapper>
            <StatsContainer
              statsData={farmsStatsData}
              containerStyles={{
                boxShadow: '0.5px 0px 3px 0 #12121210',
                borderRadius: 'lg',
                py: 2,
                px: 3,
                background: `radial-gradient(circle at 10% 20%, rgb(111, 231, 176, 0.7) 20%, rgb(50, 172, 109, 0.4) 100%)`,
              }}
            />

            <StatsContainer
              statsData={processesStatsData}
              containerStyles={{
                boxShadow: '0.5px 0px 3px 0 #12121210',
                borderRadius: 'lg',
                py: 2,
                px: 3,
                background: `radial-gradient(circle at 1.5% 1.4%, rgb(154, 198, 242) 15%, rgb(154, 198, 242) 30.2%)`,
              }}
            />

            <RequestStats />
          </StatsWrapper>
        </>
      )}
    </>
  );
};

export const StatTab = ({ statLabel, statValue, icon, onClick }) => {
  const validStats = typeof statValue === 'number' && statValue >= 0;

  return (
    <>
      {statLabel && validStats && icon?.type && (
        <HStack
          as={'button'}
          onClick={onClick}
          alignItems={'flex-start'}
          justifyContent={'space-between'}
          spacing={6}
          px={5}
          pb={1}
          borderRight={'0.4px solid #A0AEC0'}
          transition={'all 150ms ease-out'}
          _hover={{
            borderRight: '1.6px solid #12121260',
            borderRadius: 'md',
          }}
        >
          <Stack spacing={1} alignSelf={'stretch'}>
            <Text mb={0} fontWeight={500} fontSize={'xxx-large'}>
              {statValue < 10 ? `0${statValue}` : `${statValue}`}
            </Text>

            <Text flex={1} mb={0} fontWeight={450} fontSize={'lg'}>
              {statLabel}
            </Text>
          </Stack>

          <Box pt={5}>
            <Icon as={icon?.type} boxSize={38} color={'#00b894'} />
          </Box>
        </HStack>
      )}
    </>
  );
};

const AppStatsSkeleton = () => {
  return (
    <HStack
      alignItems={'center'}
      overflow={'hidden auto'}
      spacing={5}
      width={'100%'}
      height={'100%'}
      py={2}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((value) => {
        return (
          <Skeleton borderRadius={'lg'} key={value}>
            <StatTab
              statLabel={'Label'}
              statValue={12}
              icon={<MdOutlineAccountTree />}
            />
          </Skeleton>
        );
      })}
    </HStack>
  );
};

const StatsWrapper = ({ children, wrapperStyles = {} }) => {
  const [FarmsStats, ProcessesStats, RequestStats] = Children.toArray(children);

  return (
    <>
      <HStack
        px={4}
        py={1}
        spacing={5}
        alignItems={'stretch'}
        {...wrapperStyles}
      >
        <Box flex={1}>{FarmsStats}</Box>

        <Box flex={2}>{ProcessesStats}</Box>
      </HStack>
    </>
  );
};

export default AppStats;
