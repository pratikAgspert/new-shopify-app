import { Children } from 'react';
import { Flex, Box } from '@chakra-ui/react';

const PageLayout = ({ children, mainContentWidth }) => {
  const widthOnLargerViewports = mainContentWidth ?? '65%';
  const childComponents = Children?.toArray(children) ?? [];
  const [mainContent, sideContent] = childComponents;
  const pageWithSidePanel = widthOnLargerViewports !== '100%';

  return (
    <Flex
      px={3}
      py={2}
      gap={3}
      justifyContent={'space-between'}
      width={'100%'}
      maxHeight={{ md: '100%' }}
      minH={'100%'}
    >
      <Flex
        direction={'column'}
        gap={6}
        width={{
          base: '100%',
          lg: widthOnLargerViewports,
        }}
        overflow={'hidden auto'}
      >
        {mainContent}
      </Flex>

      {pageWithSidePanel && (
        <Box p={1} flex={1} maxHeight={'100%'} overflow={'hidden auto'}>
          {sideContent}
        </Box>
      )}
    </Flex>
  );
};

export default PageLayout;
