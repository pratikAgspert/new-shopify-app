import { Flex, Box } from '@chakra-ui/react';
import { Children } from 'react';

export const FilterAndModalHeader = ({ children }) => {
  const [filter, actionModal] = Children.toArray(children);

  return (
    <Flex
      px={3}
      py={2}
      gap={3}
      justifyContent={'space-between'}
      alignItems={'center'}
      width={'100%'}
    >
      <Box flex={1} maxWidth={'70%'}>
        {filter}
      </Box>

      <Box width={'fit-content'}>{actionModal}</Box>
    </Flex>
  );
};

export default FilterAndModalHeader;
