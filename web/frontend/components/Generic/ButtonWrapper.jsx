import { Button } from '@chakra-ui/react';

export const ButtonWrapper = ({ onClick, size, children, ...props }) => {
  return (
    <Button
      onClick={onClick}
      py={2}
      size={'sm'}
      height={'fit-content'}
      width={'100%'}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonWrapper;
