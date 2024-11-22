import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { PiTextAa } from 'react-icons/pi';
import GlobalStyles from './GlobalStyles';

const GlobalStyleEditor = ({}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <Stack>
      <PopoverModal
        isOpen={isOpen}
        handleToggle={handleToggle}
        popoverTriggerButton={
          <IconButton
            icon={<PiTextAa />}
            rounded={'full'}
            fontSize={24}
            w={12}
            h={12}
            colorScheme="blue"
            onClick={handleToggle}
          />
        }
      >
        <GlobalStyles />
      </PopoverModal>
    </Stack>
  );
};

const PopoverModal = ({
  popoverTriggerButton,
  children,
  handleToggle,
  isOpen,
}) => {
  return (
    <Popover
      isOpen={isOpen}
      closeOnBlur={false}
      closeOnEsc={false}
      placement="bottom"
    >
      <PopoverTrigger>{popoverTriggerButton}</PopoverTrigger>
      <PopoverContent width="fit-content" maxH={'700px'} height={'fit-content'}>
        <PopoverArrow />
        <PopoverCloseButton onClick={handleToggle} zIndex={10} />
        <PopoverBody p={3}>{children}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default GlobalStyleEditor;
