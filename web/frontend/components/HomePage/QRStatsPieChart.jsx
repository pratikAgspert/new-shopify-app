import { useMemo } from "react";
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
} from "@chakra-ui/react";

import NotFoundMessage from "../../components/Generic/NotFoundMessage";
import { FillSkeleton } from "../../components/skeletons/PostSkeleton";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { IoMdRadioButtonOn } from "react-icons/io";
import { labelValue } from "@rjsf/utils";
import { theme } from "@chakra-ui/react";
// const chakraColorSchemes = [...theme.colors];
const COLOR_WEIGHTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const CHAKRA_COLOR_SCHEMES = Object.keys(theme.colors || {});
const colorsToBeExcluded = [
  "transparent",
  "black",
  "whileAlpha",
  "blackAlpha",
  "gray",
  "white",
  "current",
  "whiteAlpha",
];
const { transparent, whileAlpha, blackAlpha, gray, white, ...rest } =
  CHAKRA_COLOR_SCHEMES; // 16
const USABLE_COLOR_SCHEMES = CHAKRA_COLOR_SCHEMES?.filter(
  (color) => !colorsToBeExcluded?.includes(color)
);
export const QRStatsPieChart = ({ QRStatsData }) => {
  const { browsersStats, OSStats } = useMemo(() => {
    const browsers = QRStatsData?.devices?.browsers || {};
    const os = QRStatsData?.devices?.os || {};
    const browsersStats = Object.entries(browsers || {})?.map(
      ([browserName, scanData]) => {
        return {
          state: browserName,
          count: scanData?.num_scans || 0,
        };
      }
    );
    const OSStats = Object.entries(os || {})?.map(([osName, scanData]) => {
      return {
        state: osName,
        count: scanData?.num_scans || 0,
      };
    });
    return { browsersStats, OSStats };
  }, [QRStatsData]);

  const { browserTagData, osTagData } = useMemo(() => {
    const browserTagData = browsersStats?.map((browserStat, i) => {
      const availableIndex = i <= 16 ? i : i % 16;
      const colorScheme = USABLE_COLOR_SCHEMES?.[availableIndex];

      return {
        colorScheme: colorScheme,
        label: browserStat?.state?.toUpperCase(),
        color: "#FFCD62",
      };
    });

    const osTagData = OSStats?.map((OSStat, i) => {
      const availableIndex = i <= 16 ? i : i % 16;
      const colorScheme = USABLE_COLOR_SCHEMES?.[availableIndex];

      return {
        colorScheme: colorScheme,
        label: OSStat?.state?.toUpperCase(),
        color: "#FFCD62",
      };
    });
    return { browserTagData, osTagData };
  }, [browsersStats, OSStats]);

  return (
    <>
      {!browserTagData?.length && !osTagData?.length ? (
        <HStack
          alignItems={"center"}
          justifyContent={"center"}
          spacing={5}
          borderRadius={10}
          boxShadow={"0 0 3px 0 lightgray"}
          mx={1}
          my={2}
          h={"96%"}
        >
          <Text mb={0}>No Data Available</Text>
        </HStack>
      ) : (
        <HStack
          alignItems={"center"}
          spacing={5}
          height={"100%"}
          px={1}
          pt={3}
          pb={1}
        >
          <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
            height={"100%"}
            flex={1}
            borderRadius={10}
            boxShadow={"0 0 3px 0 lightgray"}
          >
            <Stack
              pl={2}
              spacing={1}
              width={"fit-content"}
              height={"100%"}
              overflow={"auto"}
              justifyContent={"center"}
            >
              {browserTagData?.map(({ label, colorScheme, color }) => {
                return (
                  <HStack>
                    <IconButton
                      isRound={true}
                      colorScheme={colorScheme}
                      variant={"ghost"}
                      aria-label="Pie Label"
                      icon={<IoMdRadioButtonOn size="22" color={color} />}
                      pointerEvents={"none"}
                    />

                    <Tag width={"fit-content"} colorScheme={colorScheme}>
                      {label}
                    </Tag>
                  </HStack>
                );
              })}
            </Stack>
            <Box height={"100%"} width="50%">
              <StatsPieChart
                colors={osTagData?.map((tagData) => tagData?.colorScheme)}
                stats={browsersStats}
              />
            </Box>
          </HStack>

          <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
            height={"100%"}
            flex={1}
            borderRadius={10}
            boxShadow={"0 0 3px 0 lightgray"}
          >
            <Stack
              pl={2}
              spacing={1}
              width={"fit-content"}
              height={"100%"}
              overflow={"auto"}
              justifyContent={"center"}
            >
              {osTagData?.map(({ label, colorScheme, color }) => {
                return (
                  <HStack>
                    <IconButton
                      isRound={true}
                      colorScheme={colorScheme}
                      variant={"ghost"}
                      aria-label="Pie Label"
                      icon={<IoMdRadioButtonOn size="22" color={colorScheme} />}
                      pointerEvents={"none"}
                    />

                    <Tag width={"fit-content"} colorScheme={colorScheme}>
                      {label}
                    </Tag>
                  </HStack>
                );
              })}
            </Stack>
            <Box height={"100%"} width="50%">
              <StatsPieChart
                colors={osTagData?.map((tagData) => tagData?.colorScheme)}
                stats={OSStats}
              />
            </Box>
          </HStack>
        </HStack>
      )}
    </>
  );
};

export const StatsPieChart = ({
  colors,
  stats: data = [],
  emptyLabel = "No Data Available",
}) => {
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
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontWeight={"500"}
        fill={"black"}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </Text>
    );
  };

  const COLORS = colors ? colors : ["#FFCD62", "#95FF9F", "#0088FE", "#FF8042"];

  if (data.length === 0)
    return (
      <Center height={"100%"} display={"flex"}>
        <NotFoundMessage message={emptyLabel} alignSelf={"center"} />
      </Center>
    );

  return (
    <ResponsiveContainer height={"100%"} width={"100%"}>
      <PieChart>
        <Pie
          data={data}
          nameKey={"state"}
          dataKey={"count"}
          outerRadius={85}
          innerRadius={data.length === 1 ? 55 : 0}
          paddingAngle={data.length === 1 ? 5 : 2}
          label={CustomizedLabel}
          labelLine={false}
          style={{ cursor: "grab" }}
        >
          {data.map((entry, index) => {
            return (
              <Cell key={entry.state} fill={COLORS[index % COLORS.length]} />
            );
          })}
        </Pie>

        <Tooltip label={"true"} content={<PieChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const PieChartTooltip = (tooltipProps) => {
  const { active, payload } = tooltipProps;

  if (active && payload && payload?.length) {
    const { state, count: batchCount } = payload?.[0]?.payload?.payload;

    const colorSchemes = ["orange", "teal", "whatsapp", "green"];
    const colorScheme =
      colorSchemes[Math.min(3, Math.round(Math.random() * 3))];

    return (
      <>
        <Popover isOpen={active}>
          <PopoverContent width={"fit-content"}>
            <Stack spacing={3} alignItems={"center"}>
              <Tag
                variant={"subtle"}
                colorScheme={colorScheme}
                size={"lg"}
                width={"fit-content"}
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

export default QRStatsPieChart;
