import React, { useEffect, useState } from 'react';
import { useStatsSummary } from '../../../apiHooks/useOpenAi';
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import {SparkleIcon} from '../../../assets/Icon/sparkel';
import PostSkeleton from '../../../components/skeletons/PostSkeleton';

export const OpenAiStats = ({ prompt, title, json = null }) => {

  const { isOpen, onToggle, onClose } = useDisclosure()
  const { mutate, data, isPending, isSuccess, isError, error } = useStatsSummary()
  console.log("from OpenAiStats", title, json)

  return (
    <>
      <Popover isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button
            onClick={() => {
              onToggle();
              if (!isOpen) {
                console.log('popover ', isOpen, json);
                if (!isPending) {
                  mutate({ json: json, title: title })
                }
              }
            }}
            borderRadius={'100%'}
            p={0}
            // _hover={{ boxShadow: '0 0 3px 0 blue' }}
            cursor={'pointer'}
            backgroundColor={'transparent'}
          >
            <SparkleIcon width={'20px'} height={'20px'} fill={'blue'} />
          </Button>
        </PopoverTrigger>
        <PopoverContent borderRadius={10}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader> {title} Summary</PopoverHeader>
          <PopoverBody>
            {isPending ? <PostSkeleton /> : isSuccess ? <><Text>{data?.content}<Text align={"right"} fontSize={"smaller"}>AI Generated</Text></Text></> : isError ? `${error?.message}` : "Something went wrong. Try later"}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default OpenAiStats;
