import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  GridItem,
  HStack,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { IoClose } from 'react-icons/io5';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { formatIndianAmount } from '../../../utils/AmountFormat';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { TbReload } from 'react-icons/tb';
import OpenAiStats from './OpenAiStats';

const GenericCardComponent = ({
  title,
  dragHandleProps,
  selected = false,
  onClickClose,
  body,
  accordion,
  prompt,
  json,
  showSummarizeButton = true,
  ...props
}) => {
  return (
    <Stack
      w={'fit-content'}
      h={'fit-content'}
      borderRadius={10}
      spacing={1}
      boxShadow={'0 0 3px 0 lightgray'}
      pb={!selected && 1}
      {...props}
    >
      <Stack padding={2} justifyContent={'center'}>
        <HStack justifyContent={'space-between'}>
          <HStack gap={2}>
            <Text fontSize={18} mb={0} textTransform={'capitalize'}>
              {title}
            </Text>

            {showSummarizeButton ? (
              <OpenAiStats json={json} title={title} />
            ) : null}
          </HStack>
        </HStack>
        {body}
      </Stack>

      {accordion}
    </Stack>
  );
};

export const Card = ({
  value,
  label,
  isCustom = false,
  isAmount = false,
  isNos = false,
  isPercentage = false,
  isLoading = false,
  isError = false,
  refetchData,
  ...props
}) => {
  const isNegative = value < 0;
  const textColor = isNegative ? 'red.500' : 'inherit';
  return (
    <Stack
      w={120}
      h={'fit-content'}
      padding={2}
      justifyContent={'center'}
      textAlign={'center'}
      spacing={0}
      borderRadius={10}
      bg={'white'}
      {...props}
    >
      {isLoading ? (
        <Spinner
          size="md"
          alignSelf={'center'}
          my={2}
          color="rgba(0,184,148,1)"
        />
      ) : isError ? (
        <Button
          onClick={async () => await refetchData()}
          w={'fit-content'}
          alignSelf={'center'}
          p={0}
          bg={'transparent'}
          borderRadius={'100%'}
        >
          <TbReload fontSize={26} color="red" />
        </Button>
      ) : (
        <HStack justifyContent={'center'} alignItems={'baseline'} spacing={0}>
          {isAmount && (
            <Text mb={0} fontSize={16} color={textColor}>
              ₹
            </Text>
          )}

          <Text
            mb={0}
            fontSize={24}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'baseline'}
            color={textColor}
          >
            {isCustom ? value : formatIndianAmount(value)}
          </Text>

          {isNos && (
            <Text mb={0} fontSize={16} color={textColor}>
              nos
            </Text>
          )}

          {isPercentage && (
            <Text mb={0} fontSize={16} color={textColor}>
              %
            </Text>
          )}
        </HStack>
      )}

      <Text mb={0} textTransform={'capitalize'} fontSize={14}>
        {label}
      </Text>
    </Stack>
  );
};

export const RefetchButton = ({ callRefetch }) => {
  return (
    <Button
      onClick={async () => await callRefetch()}
      w={'fit-content'}
      alignSelf={'center'}
      my={5}
      p={0}
      bg={'transparent'}
      borderRadius={'100%'}
    >
      <TbReload fontSize={26} color="red" />
    </Button>
  );
};

export const StatsCardAccordion = ({
  label,
  body,
  buttonUrl,
  headerStyles,
  isLoading = false,
  isError = false,
  isSuccess = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(true);
    }
  }, [isSuccess]);

  return (
    <Accordion allowToggle index={isOpen ? 0 : -1}>
      <AccordionItem border={'none'}>
        <Box>
          <AccordionButton
            onClick={toggleAccordion}
            borderBottomRadius={isOpen ? 0 : 10}
            {...headerStyles}
          >
            <Box as="span" flex="1">
              {label}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Box>

        <AccordionPanel pb={3}>
          <Stack>
            <Stack>{body}</Stack>

            {isLoading ||
              (isError === false && (
                <Button
                  gap={1}
                  size="sm"
                  alignSelf={'end'}
                  bg={'white'}
                  onClick={() => navigate(buttonUrl)}
                >
                  View <IoIosArrowForward />
                </Button>
              ))}
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export const AccordionCard = ({ label, value }) => {
  return (
    <GridItem
      spacing={1}
      // boxShadow={'0 0 3px 0 lightgray'}
      padding={1}
      px={2}
      borderRadius={7}
      bg={'white'}
    >
      <Text
        mb={0}
        fontWeight={'600'}
        textTransform={'capitalize'}
        fontSize={14}
      >
        {label}
      </Text>
      <Text mb={0} fontSize={14}>
        {value}
      </Text>
    </GridItem>
  );
};

export default GenericCardComponent;
