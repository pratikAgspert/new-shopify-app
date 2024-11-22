import {
  Box,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  SkeletonCircle,
  Stack,
} from '@chakra-ui/react';
import { Children } from 'react';
import { PostSkeletonContainer } from './PostSkeleton';

export const PageSkeleton = () => {
  return (
    <PageLayout>
      <LeftNavBar />
      <TopNavBar />
      <MainContent />
    </PageLayout>
  );
};

const PageLayout = ({ children }) => {
  const [LeftNavBar, TopNavBar, MainContent] = Children.toArray(children);

  const templateAreas = `
          "leftNavBar topNavBar"
          "leftNavBar mainAppContent "
        `;

  return (
    <Grid
      height={'100vh'}
      width={'100%'}
      gap={'0.5rem'}
      templateAreas={templateAreas}
      gridTemplateRows={'max-content 1fr'}
      gridTemplateColumns={'4rem 1fr'}
      overflow={'hidden'}
    >
      <GridItem area={'leftNavBar'}>{LeftNavBar}</GridItem>

      <GridItem area={'topNavBar'}>{TopNavBar}</GridItem>

      <GridItem width={'100%'} area={'mainAppContent'} pt={3}>
        {MainContent}
      </GridItem>
    </Grid>
  );
};

const LeftNavBar = () => {
  return (
    <Box
      borderTopRightRadius={'25px'}
      borderBottomRightRadius={'25px'}
      height={'100%'}
      overflow={'hidden'}
    >
      <Skeleton height={'100%'} width={'100%'} />
    </Box>
  );
};

const TopNavBar = () => {
  return (
    <Flex p={1} pr={4} pt={2} gap={5} width={'100%'} height={'100%'}>
      <Box flex={1} bg="white">
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

const MainContent = () => {
  return (
    <Flex gap={3} height={'100%'} overflow={'hidden'}>
      <Box flex={1}>
        <PostSkeletonContainer />
      </Box>

      <Stack p={2} px={3} width={'30%'} spacing={10}>
        <Stack p={2}>
          {[1, 2, 3, 4].map((count) => (
            <Skeleton key={count} height="25px" />
          ))}
        </Stack>

        <Box p={2} flex={1}>
          <Skeleton height={'50%'} width={'100%'} />
        </Box>
      </Stack>
    </Flex>
  );
};

export default PageSkeleton;
