import { Text } from '@chakra-ui/react';

export const NotFoundMessage = ({ message = '', ...props }) => {
  return (
    <Text
      mb={0}
      py={5}
      mx={'auto'}
      textTransform={'capitalize'}
      fontWeight={500}
      fontSize="xx-large"
      textAlign={'center'}
      {...props}
    >
      {message}
    </Text>
  );
};

export default NotFoundMessage;
