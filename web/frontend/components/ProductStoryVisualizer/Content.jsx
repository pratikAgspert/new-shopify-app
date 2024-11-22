import { Box } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import React from 'react';

export const Content = ({ content }) => {
  return (
    <Box
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(content),
      }}
    />
  );
};
