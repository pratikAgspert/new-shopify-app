import React, { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Input,
  Text,
  VStack,
  List,
  ListItem,
  Spinner,
  FormControl,
  FormErrorMessage,
  IconButton,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

export const GenericSearchBar = ({
  data,
  isLoading,
  isError,
  onSelect,
  onClearSearch = () => {},
  placeholder = 'Search...',
}) => {
  const [focused, setFocused] = useState(false);
  const { control, setValue } = useForm();
  const [searchInput, setSearchInput] = useState('');

  const filteredOptions = useMemo(() => {
    return data?.filter((item) =>
      item?.name?.toLowerCase().includes(searchInput?.toLowerCase())
    );
  }, [searchInput, data]);

  const clearSearch = () => {
    setSearchInput('');
    setValue('search', '');
    onClearSearch();
  };

  return (
    <VStack spacing={4}>
      <FormControl>
        <Controller
          name="search"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <Box position="relative">
              <Input
                {...field}
                placeholder={placeholder}
                onChange={(e) => {
                  field.onChange(e);
                  setSearchInput(e.target.value);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                borderRadius={50}
                bg={'white'}
                border={'none'}
                paddingRight={10}
              />
              {searchInput && (
                <IconButton
                  aria-label="Clear search"
                  icon={<CloseIcon />}
                  position="absolute"
                  top="50%"
                  right={4}
                  transform="translateY(-50%)"
                  onClick={clearSearch}
                  size="sm"
                  variant="ghost"
                />
              )}
              <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              {focused && searchInput && (
                <List
                  position="absolute"
                  top="100%"
                  width="100%"
                  bg="white"
                  boxShadow="md"
                  maxHeight="200px"
                  overflowY="auto"
                  zIndex={1}
                  borderRadius="md"
                  pb={5}
                >
                  {isLoading ? (
                    <ListItem
                      p={2}
                      display={'flex'}
                      justifyContent={'center'}
                      py={2}
                    >
                      <Spinner size="sm" color="rgba(0,184,148,1)" />
                    </ListItem>
                  ) : isError ? (
                    <ListItem p={2}>
                      <Text color="red.500">Error while fetching data</Text>
                    </ListItem>
                  ) : filteredOptions?.length > 0 ? (
                    filteredOptions?.map((option) => (
                      <ListItem
                        key={option.id}
                        onClick={() => {
                          setSearchInput(option.name);
                          field.onChange(
                            `${option.name} ${
                              option?.type ? `(${option?.type})` : ''
                            }`
                          );
                          onSelect(option);
                          setFocused(false);
                        }}
                        p={2}
                        _hover={{ bg: 'gray.100' }}
                        cursor="pointer"
                      >
                        {option.name} {option?.type && `(${option?.type})`}
                      </ListItem>
                    ))
                  ) : (
                    <ListItem p={2}>
                      <Text color="gray.500">No results found</Text>
                    </ListItem>
                  )}
                </List>
              )}
            </Box>
          )}
        />
      </FormControl>
    </VStack>
  );
};

export default GenericSearchBar;
