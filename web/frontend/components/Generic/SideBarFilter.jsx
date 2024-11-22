import React, { useEffect, useState, useRef } from 'react';
import { Input, IconButton, useColorModeValue, Stack } from '@chakra-ui/react';
import { FormSelectForFilter } from '../../pages/ProductsPage/GenericFormFields';
import { RxCross2 } from 'react-icons/rx';

export const SearchFilter = ({
  filterText,
  setFilterText,
  clearButton = false,
  backPress,
  placeholderText = null,
  onFocus,
  width,
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef();
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Stack width={width ? width : '100%'} position={'relative'}>
      <Input
        ref={inputRef}
        onFocus={() => {
          setFocused(true);
          if (onFocus && typeof onFocus === 'function') {
            onFocus();
          }
        }}
        onBlur={() => {
          setFocused(false);
        }}
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        placeholder={placeholderText ? placeholderText : 'Search...'}
        placeholderTextColor="gray.500"
        borderRadius="full"
        fontSize="md"
        bg="white"
        borderColor={focused ? 'green.500' : borderColor}
        _focus={{
          borderColor: 'green.500',
        }}
      />

      {clearButton && (
        <IconButton
          _hover={{ backgroundColor: 'transparent' }}
          _focus={{
            backgroundColor: 'transparent',
          }}
          icon={<RxCross2 color="gray" />}
          onClick={() => {
            if (backPress && typeof backPress === 'function') {
              backPress();
              // if (inputRef.current) {
              //   inputRef.current.blur();
              // }
            }

            setFilterText('');
          }}
          position="absolute"
          zIndex={1000}
          right={2}
          variant="ghost"
        />
      )}
    </Stack>
  );
};

export const CategoryFilter = ({
  category,
  setValue,
  control,
  extraStyles,
}) => {
  useEffect(() => {
    setValue('filter_category', category[0].value);
  }, []);

  return (
    <Stack w={'35%'} {...extraStyles} alignSelf={'flex-end'}>
      <FormSelectForFilter inputName={'filter_category'} control={control}>
        <>
          {category?.map((filter) => (
            <option
              key={filter?.id}
              value={filter?.value}
              style={{ textTransform: 'capitalize' }}
            >
              {filter?.value}
            </option>
          ))}
        </>
      </FormSelectForFilter>
    </Stack>
  );
};
