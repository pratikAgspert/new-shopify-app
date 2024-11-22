import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Heading,
  IconButton,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { IoMdRadioButtonOn } from 'react-icons/io';
import useWorkflowPerformance from '../../apiHooks/useWorkflowPerformance';
import { FillSkeleton } from '../../components/skeletons/PostSkeleton';
import { useWorkflows } from '../../apiHooks/useWorkflows';
import { useNavigate } from 'react-router-dom';

export const WorkflowStatsLineGraph = ({ timeline }) => {
  const workflowQuery = useWorkflows();
  const { data: workflowData, isPending: isFetchingWorkflows } = workflowQuery;

  const { workflows } = useMemo(() => {
    const workflows = workflowData || [];
    return { workflows };
  }, [workflowData]);

  const [selectedWorkflow, setSelectedWorkflow] = useState(
    workflowData?.[0] ?? null
  );

  useEffect(() => {
    if (workflows?.length && !selectedWorkflow?.id)
      setSelectedWorkflow(workflows?.[0]);
  }, [selectedWorkflow, workflows]);

  const isAValidWorkflowCount = (workflowData && workflowData?.length) || false;
  const isAValidWorkflow = selectedWorkflow?.id || false;

  return (
    <Box width={'100%'} height={'100%'} overflow={'visible'}>
      {isFetchingWorkflows && (
        <FillSkeleton width="100%" height="100%" mx={3} />
      )}

      {!isFetchingWorkflows && (
        <>
          {!isAValidWorkflowCount && <WorkflowActionCard />}

          {isAValidWorkflowCount && (
            <>
              {!isAValidWorkflow && <WorkflowActionCard />}

              {isAValidWorkflow && (
                <WorkflowPerformanceLineGraph
                  timeline={timeline}
                  selectedWorkflow={selectedWorkflow}
                  setSelectedWorkflow={setSelectedWorkflow}
                  workflows={workflows}
                />
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

const WorkflowStatsComposedChart = ({ graphData }) => {
  const timeDataKey = 'time';

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <ComposedChart data={graphData}>
        <XAxis dataKey="state" />
        <YAxis dataKey={timeDataKey} />

        <Tooltip content={GraphTooltip} />

        <CartesianGrid stroke="#f5f5f5" />

        <Area
          type="monotone"
          dataKey={timeDataKey}
          fill="#C6F6D5"
          stroke="#27674910"
        />

        <Bar dataKey={timeDataKey} barSize={20} radius={1} fill="#71BC78" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const GraphTooltip = (tooltipProps) => {
  const { active, payload } = tooltipProps;

  if (active && payload && payload?.length) {
    const data = {
      ...payload?.[0]?.payload,
      isOpen: active,
    };

    return <GraphData data={data} />;
  }

  return null;
};

const GraphData = ({ data }) => {
  const { workflow, state, isOpen, average_seconds, average_quantity, unit } =
    data;

  const stateData = [
    {
      key: 'Average Seconds',
      value: average_seconds,
    },
    {
      key: 'Average Quantity',
      value: average_quantity,
    },
    { key: 'Unit', value: unit },
  ];

  return (
    <>
      <Popover trigger="hover" placement="left" isOpen={isOpen}>
        <PopoverTrigger>
          <IconButton
            isRound={true}
            colorScheme={'whatsapp'}
            variant={'ghost'}
            aria-label="Pie Label"
            icon={<IoMdRadioButtonOn size="22" color={'#95FF9F'} />}
          />
        </PopoverTrigger>

        <PopoverContent width={'fit-content'}>
          <PopoverHeader
            textTransform={'capitalize'}
            fontWeight="500"
            textAlign={'center'}
            border={'0'}
          >
            {`State - ${state}`}
          </PopoverHeader>

          {average_quantity && average_seconds && (
            <PopoverBody p={2} pb={3}>
              <TableContainer>
                <Table size="sm">
                  <Tbody>
                    {stateData?.map(({ key, value }) => {
                      return (
                        <Tr
                          key={`${key}-${value}`}
                          fontWeight={'500'}
                          textTransform={'capitalize'}
                        >
                          <Td>{key}</Td>
                          <Td>{value}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </PopoverBody>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

const WorkflowFitler = ({
  workflows = [],
  selectedWorkflow,
  updateWorkflow,
  styles = {},
}) => {
  const handleWorkflowChange = (workflowId) => {
    const workflow =
      workflows?.find((workflow) => workflow?.id === parseInt(workflowId)) ??
      null;

    updateWorkflow(workflow);
  };

  const workflowsAreAvailable = workflows?.length || false;

  return (
    <>
      {workflowsAreAvailable && (
        <Select
          value={selectedWorkflow?.id ?? ''}
          width={'max-content'}
          onChange={(event) =>
            handleWorkflowChange?.(event?.target?.value ?? '')
          }
          {...styles}
        >
          {workflows?.map(({ name, id }) => {
            return (
              <Button as="option" size="lg" value={id} key={id}>
                {name}
              </Button>
            );
          })}
        </Select>
      )}
    </>
  );
};

const WorkflowActionCard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box px={3} pl={4} width={'100%'} height={'100%'}>
        <HStack width={'inherit'} height={'inherit'} spacing={5}>
          <Stack
            spacing={2}
            alignSelf={'start'}
            justifyContent={'space-between'}
            height={'90%'}
            p={1}
          >
            <Heading
              mb={0}
              as="h4"
              fontFamily={'system'}
              textTransform={'capitalize'}
              textAlign={'center'}
              fontSize={'xx-large'}
            >
              Streamline your Supply Chain!
            </Heading>

            <Text fontSize={'lg'} textAlign={'center'}>
              Use Workflows for Seamless Tracking and Management!
            </Text>

            <Button
              alignSelf={'center'}
              colorScheme="green"
              width={'fit-content'}
              onClick={() => {
                navigate('/workflows');
              }}
            >
              Create A Workflow
            </Button>
          </Stack>

          <Image
            src={'/assets/images/workflow_action.png'}
            alt={'Workflow Action Image'}
            width={'50%'}
            height={'100%'}
            objectFit={'contain'}
            objectPosition={'center'}
            borderRadius={'lg'}
          />
        </HStack>
      </Box>
    </>
  );
};

const WorkflowPerformanceLineGraph = ({
  timeline,
  selectedWorkflow,
  workflows,
  setSelectedWorkflow,
}) => {
  const {
    data: workflowPerformanceData,
    isPending: isFetchingWorkflowPerformance,
    isError: workflowPerformanceError,
  } = useWorkflowPerformance(selectedWorkflow?.id, timeline || 7);

  const graphData = useMemo(() => {
    if (selectedWorkflow?.id && !workflowPerformanceData?.length) {
      const data = selectedWorkflow?.dag?.nodes?.map((node) => {
        return {
          state: node?.state,
          time: 0,
          average_quantity: 'Insufficient Data ',
          average_seconds: 'Insufficient Data',
          unit: 'Insufficient Data',
        };
      });

      return data;
    }

    const data =
      workflowPerformanceData?.map((stateData) => {
        return {
          ...stateData,
          workflow: selectedWorkflow,
          time: stateData?.average_seconds,
        };
      }) ?? [];

    return data;
  }, [workflowPerformanceData, selectedWorkflow]);

  return (
    <>
      <Box width={'inherit'} height={'inherit'} overflow={'visible'}>
        {isFetchingWorkflowPerformance && (
          <FillSkeleton width="100%" height="100%" mx={4} />
        )}

        {!isFetchingWorkflowPerformance && (
          <>
            {!workflowPerformanceData && <WorkflowActionCard />}

            {workflowPerformanceData && (
              <Stack spacing={6} width={'100%'} height={'100%'}>
                <WorkflowFitler
                  workflows={workflows}
                  selectedWorkflow={selectedWorkflow}
                  updateWorkflow={setSelectedWorkflow}
                  styles={{ ml: 4 }}
                />

                <WorkflowStatsComposedChart graphData={graphData} />
              </Stack>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default WorkflowStatsLineGraph;
