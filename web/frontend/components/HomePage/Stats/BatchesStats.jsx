import { HStack, Stack } from '@chakra-ui/react';
import GenericCardComponent, { Card } from './GenericCardComponent';
import WorkflowStatsLineGraph from '../WorkflowStatsLineGraph';
import BatchStatsPieChart from '../BatchStatsPieChart';
import { DisplayWrapper } from '../HomePage';
import {
  useBalanceStats,
  useCreatedBatchStats,
  useMovedBatchStats,
} from '../../../apiHooks/useStatisticsAPIs';
import { useCompletedBatches, useGetBatch } from '../../../apiHooks/useBatches';
import { useNavigate } from 'react-router-dom';

const BatchesStats = ({ title, onClickClose, dragHandleProps, timeline }) => {
  const createdBatchStatsQuery = useCreatedBatchStats(timeline);
  const movedBatchStatsQuery = useMovedBatchStats(timeline);
  const activeBatchStatsQuery = useGetBatch(timeline);
  const completedBatchStatsQuery = useCompletedBatches(timeline);
  const balanceStatsQuery = useBalanceStats(timeline);

  const navigate = useNavigate();

  const {
    data: createdBatchStats,
    isPending: isFetchingCreatedBatchStats,
    isError: createdBatchStatsError,
    refetch: refetchCreatedBatchStats,
  } = createdBatchStatsQuery;

  const {
    data: movedBatchStats,
    isPending: isFetchingMovedBatchStats,
    isError: movedBatchStatsError,
    refetch: refetchMovedBatchStats,
  } = movedBatchStatsQuery;

  const {
    data: batchData,
    isPending: isFetchingBatches,
    isError: batchError,
    refetch: refetchBatchData,
  } = activeBatchStatsQuery;

  const {
    data: completedBatchData,
    isPending: isFetchingCompletedBatches,
    isError: completedBatchError,
    refetch: refetchCompletedBatchData,
  } = completedBatchStatsQuery;

  const {
    data: balanceData,
    isPending: isFetchingBalances,
    isError: balanceError,
    refetch: refetchBalanceData,
  } = balanceStatsQuery;

  return (
    <GenericCardComponent
      showSummarizeButton={false}
      title={title}
      onClickClose={onClickClose}
      dragHandleProps={dragHandleProps}
      bg={'#f5f7f8'}
      w={'92vw'}
      body={
        <>
          <Stack>
            <HStack h={200}>
              <DisplayWrapper wrapperStyles={{ py: 2 }}>
                <WorkflowStatsLineGraph timeline={timeline} />
              </DisplayWrapper>

              <DisplayWrapper wrapperStyles={{ py: 2 }}>
                <BatchStatsPieChart timeline={timeline} />
              </DisplayWrapper>
            </HStack>

            <HStack justifyContent={'center'} spacing={5}>
              <Card
                value={createdBatchStats?.total}
                label={'Created Batches'}
                isNos
                onClick={() => {
                  createdBatchStatsError === false && navigate('/supplychain');
                }}
                _hover={{
                  bg: '#e9e9e9',
                  cursor: 'pointer',
                }}
                isLoading={isFetchingCreatedBatchStats}
                isError={createdBatchStatsError}
                refetchData={refetchCreatedBatchStats}
              />

              <Card
                value={batchData?.length}
                label={'Active Batches'}
                isNos
                onClick={() => {
                  batchError === false && navigate('/supplychain');
                }}
                _hover={{ bg: '#e9e9e9', cursor: 'pointer' }}
                isLoading={isFetchingBatches}
                isError={batchError}
                refetchData={refetchBatchData}
              />

              <Card
                value={movedBatchStats?.total}
                label={'Moved Batches'}
                isNos
                onClick={() =>
                  movedBatchStatsError === false && navigate('/supplychain')
                }
                _hover={{ bg: '#e9e9e9', cursor: 'pointer' }}
                isLoading={isFetchingMovedBatchStats}
                isError={movedBatchStatsError}
                refetchData={refetchMovedBatchStats}
              />

              <Card
                value={completedBatchData?.length}
                label={'Completed Batches'}
                isNos
                onClick={() =>
                  completedBatchError === false &&
                  navigate('/supplychain?is_complete=true')
                }
                _hover={{ bg: '#e9e9e9', cursor: 'pointer' }}
                isLoading={isFetchingCompletedBatches}
                isError={completedBatchError}
                refetchData={refetchCompletedBatchData}
              />

              <Card
                value={balanceData?.num_transactions}
                label={'Total Transactions'}
                isNos
                onClick={() =>
                  balanceError === false &&
                  navigate('/procurement?section=balances')
                }
                _hover={{ bg: '#e9e9e9', cursor: 'pointer' }}
                isLoading={isFetchingBalances}
                isError={balanceError}
                refetchData={refetchBalanceData}
              />
            </HStack>
          </Stack>
        </>
      }
    />
  );
};

export default BatchesStats;
