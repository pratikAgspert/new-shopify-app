import { useMemo } from 'react';
import {
  Center,
  Popover,
  PopoverArrow,
  PopoverContent,
  Stack,
  Tag,
  Text,
  HStack,
  Box,
  IconButton,
  Tooltip as ChakraTooltip,
} from '@chakra-ui/react';

import NotFoundMessage from '../../components/generic/NotFoundMessage';
import { FillSkeleton } from '../../components/skeletons/PostSkeleton';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
  useCompletedBatches,
  useGetBatch as useGetBatches,
} from '../../apiHooks/useBatches';
import { IoMdRadioButtonOn } from 'react-icons/io';

export const BatchStatsPieChart = () => {
  // TODO: Add a workflow filter

  const batchQuery = useGetBatches();
  const completedBatchQuery = useCompletedBatches();

  const {
    data: batchData,
    isPending: isFetchingBatches,
    isError: batchError,
  } = batchQuery;

  const {
    data: completedBatchData,
    isPending: isFetchingCompletedBatches,
    isError: completedBatchError,
  } = completedBatchQuery;

  const batchStats = useMemo(() => {
    const activeBatchCount = batchData?.length ?? 0;
    const completedBatchCount = completedBatchData?.length ?? 0;

    return [
      {
        state: 'Active Batches',
        count: activeBatchCount,
      },
      {
        state: 'Completed Batches',
        count: completedBatchCount,
      },
    ];
  }, [batchData, completedBatchData]);

  const tagData = useMemo(() => {
    return [
      {
        colorScheme: 'yellow',
        label: 'Active',
        color: '#FFCD62',
      },
      {
        colorScheme: 'whatsapp',
        label: 'Completed',
        color: '#95FF9F',
      },
    ];
  }, []);

  return (
    <>
      {(isFetchingBatches || isFetchingCompletedBatches) && (
        <FillSkeleton width="100%" height="100%" />
      )}

      {!isFetchingBatches && !isFetchingCompletedBatches && (
        <HStack alignItems={'center'} spacing={0.5} height={'100%'}>
          <Box order={1} height={'100%'} flex={1}>
            <StatsPieChart stats={batchStats} />
          </Box>

          <Stack pl={2} spacing={3} width={'fit-content'}>
            {tagData?.map(({ label, colorScheme, color }) => {
              return (
                <HStack>
                  <IconButton
                    isRound={true}
                    colorScheme={colorScheme}
                    variant={'ghost'}
                    aria-label="Pie Label"
                    icon={<IoMdRadioButtonOn size="22" color={color} />}
                    pointerEvents={'none'}
                  />

                  <Tag width={'fit-content'} colorScheme={colorScheme}>
                    {label}
                  </Tag>
                </HStack>
              );
            })}
          </Stack>
        </HStack>
      )}
    </>
  );
};

const StatsPieChart = ({ stats: data = [] }) => {
  const RADIAN = Math.PI / 180;

  const CustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    payload,
    ...props
  }) => {
    const { payload: data } = payload;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <Text
        as="text"
        x={x}
        y={y}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontWeight={'500'}
        fill={'black'}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </Text>
    );
  };

  const COLORS = ['#FFCD62', '#95FF9F', '#0088FE', '#FF8042'];

  if (data.length === 0)
    return (
      <Center height={'100%'} border={'1px solid red'}>
        <NotFoundMessage message="No Batch Stats Available :(" />
      </Center>
    );

  return (
    <ResponsiveContainer height={'100%'} width={'100%'}>
      <PieChart>
        <Pie
          data={data}
          nameKey={'state'}
          dataKey={'count'}
          outerRadius={85}
          innerRadius={data.length === 1 ? 55 : 0}
          paddingAngle={data.length === 1 ? 5 : 2}
          label={CustomizedLabel}
          labelLine={false}
          style={{ cursor: 'grab' }}
        >
          {data.map((entry, index) => {
            return (
              <Cell key={entry.state} fill={COLORS[index % COLORS.length]} />
            );
          })}
        </Pie>

        <Tooltip label={'true'} content={<PieChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const PieChartTooltip = (tooltipProps) => {
  const { active, payload } = tooltipProps;

  if (active && payload && payload?.length) {
    const { state, count: batchCount } = payload?.[0]?.payload?.payload;

    const colorSchemes = ['orange', 'teal', 'whatsapp', 'green'];
    const colorScheme =
      colorSchemes[Math.min(3, Math.round(Math.random() * 3))];

    return (
      <>
        <Popover isOpen={active}>
          <PopoverContent width={'fit-content'}>
            <Stack spacing={3} alignItems={'center'}>
              <Tag
                variant={'subtle'}
                colorScheme={colorScheme}
                size={'lg'}
                width={'fit-content'}
              >
                {batchCount === 1 && `${state} - ${batchCount}`}

                {batchCount > 1 && `${state} -  ${batchCount} `}
              </Tag>
            </Stack>

            <PopoverArrow />
          </PopoverContent>
        </Popover>
      </>
    );
  }

  return null;
};

export default BatchStatsPieChart;
