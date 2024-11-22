import {
  Box,
  SkeletonCircle,
  SkeletonText,
  Flex,
  Skeleton,
} from '@chakra-ui/react';

export const PostSkeleton = () => {
  return (
    <Box padding="6" boxShadow="lg" bg="white">
      <SkeletonCircle size="10" />
      <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
    </Box>
  );
};

export const PostSkeletonContainer = () => {
  return (
    <Flex direction={'column'} gap={3} mt={8} px={3}>
      {[1, 2, 3, 4, 5, 6].map((skeleton) => (
        <PostSkeleton key={skeleton} />
      ))}
    </Flex>
  );
};

export const FillSkeleton = ({ ...containerProps }) => {
  return (
    <Box {...containerProps} overflow={'hidden'}>
      <Skeleton height={'100%'} width={'100%'} />
    </Box>
  );
};

export default PostSkeleton;
