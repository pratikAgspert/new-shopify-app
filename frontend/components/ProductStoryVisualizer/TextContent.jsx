import { Stack, Text } from '@chakra-ui/react';
import React from 'react';

export const TextContent = ({ header, content }) => {
  return (
    <>
      <Stack spacing={0}>
        <Text fontSize={'medium'} fontWeight={600} mb={0}>
          {header}
        </Text>

        <Text fontSize={'small'} align={'justify'} mb={0}>
          {content}
        </Text>
      </Stack>
    </>
  );
};
