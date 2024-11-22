import { Children } from "react";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
} from "@chakra-ui/react";
import HorizontalScrollableWrapper from "./HorizontalScrollableWrapper";

export const TabbedContent = ({
  tabs,
  children: tabComponents,
  selectedTabIndex,
  onTabChange,
  variant,
  colorScheme,
  scrollableTabList = false,
  hasTabSectionChild = false,
  isFlexWrapTabList = false,
  ...props
}) => {
  const childComponents = Children?.toArray(tabComponents) ?? [];
  const tabPanelChildComponents = childComponents?.slice(
    hasTabSectionChild ? 1 : 0
  );

  return (
    <Tabs
      index={selectedTabIndex}
      onChange={(index) => {
        onTabChange && onTabChange(index);
      }}
      colorScheme={colorScheme || "green"}
      variant={variant || "soft-rounded"}
      {...props}
    >
      {isFlexWrapTabList && (
        <Flex alignItems={"baseline"} justifyContent={"space-between"}>
          <TabList
            gap={2}
            py={2}
            px={1}
            overflow={"auto hidden"}
            scrollBehavior={"smooth"}
            flex={1}
            height={"100%"}
            flexWrap={"wrap"}
          >
            {tabs.map((tab) => (
              <Tab
                textTransform={"capitalize"}
                key={tab}
                fontSize={14}
                boxShadow={"0 0 3px 0 lightgray"}
              >
                {tab}
              </Tab>
            ))}
          </TabList>

          {hasTabSectionChild && <>{childComponents?.[0]}</>}
        </Flex>
      )}

      {!scrollableTabList && !isFlexWrapTabList && (
        <Flex
          py={1}
          px={4}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <TabList
            gap={1}
            pb={3}
            overflow={"auto hidden"}
            scrollBehavior={"smooth"}
            flex={1}
            height={"100%"}
          >
            {tabs.map((tab) => (
              <Tab textTransform={"capitalize"} key={tab} fontSize={14}>
                {tab}
              </Tab>
            ))}
          </TabList>

          {hasTabSectionChild && <>{childComponents?.[0]}</>}
        </Flex>
      )}

      {scrollableTabList && (
        <HorizontalScrollableWrapper>
          <TabList width={"fit-content"} gap={2}>
            {tabs.map((tab) => (
              <Tab textTransform={"uppercase"} key={tab} whiteSpace={"nowrap"}>
                {tab}
              </Tab>
            ))}
          </TabList>
        </HorizontalScrollableWrapper>
      )}

      <TabPanels mt={4}>
        {tabPanelChildComponents?.map((child, index) => {
          return (
            <TabPanel p={0} key={index}>
              {child}
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};

export default TabbedContent;
