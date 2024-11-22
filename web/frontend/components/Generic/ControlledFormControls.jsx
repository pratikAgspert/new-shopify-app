import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  RadioGroup,
  Select,
  Stack,
  Switch,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';

import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { MultiSelect } from 'chakra-multiselect';

import { useController } from 'react-hook-form';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@chakra-ui/icons';
import './ReactDatePicker.css';
import { VscEyeClosed } from 'react-icons/vsc';
import { VscEye } from 'react-icons/vsc';

export const FormRadioInput = ({
  inputName,
  control,
  label,
  validationRules,
  formControlProps,
  children,
  onChange,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: inputName,
    rules: { ...validationRules },
    control,
  });

  return (
    <FormControl isInvalid={error} {...formControlProps}>
      <FormLabel textTransform={'capitalize'} htmlFor={inputName}>
        {label ?? inputName}
      </FormLabel>

      <RadioGroup
        colorScheme="green"
        {...field}
        onChange={(value) => {
          field?.onChange(value);
          onChange && onChange?.(value);
        }}
      >
        <Stack py={1} spacing={5} direction="row">
          {children}
        </Stack>
      </RadioGroup>

      {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const FormSelect = ({
  control,
  inputName,
  label,
  children: selectOptions,
  placeholder,
  validationRules = {},
  isRequired = false,
  isDisabled = false,
  onChange,
  isReadOnly = false,
  selectProps = {},
  noLabel = false,
  formControlProps = {},
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: inputName,
    rules: { ...validationRules },
    control,
  });

  return (
    <FormControl
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={error}
      isReadOnly={isReadOnly}
      {...formControlProps}
    >
      {!noLabel ? (
        <FormLabel textTransform={'capitalize'} htmlFor={inputName}>
          {label ?? inputName}
        </FormLabel>
      ) : null}

      <Select
        {...field}
        value={field?.value ? field?.value : ''}
        id={inputName}
        placeholder={placeholder}
        onChange={(e) => {
          field.onChange(e);
          onChange && onChange(e);
        }}
        isReadOnly={isReadOnly}
        {...selectProps}
      >
        {selectOptions}
      </Select>

      {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const FormInput = ({
  control,
  inputName,
  inputType = 'text',
  label,
  isLabel = true,
  placeholder,
  validationRules = {},
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  formControlProps = {},
  isPassword = false,
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: inputName,
    rules: { ...validationRules },
    control,
  });

  const [seePassword, setSeePassword] = useState(false);

  return (
    <>
      {inputType === 'checkbox' && (
        <FormControl
          isDisabled={isDisabled}
          isRequired={isRequired}
          isInvalid={error}
          isReadOnly={isReadOnly}
          {...formControlProps}
        >
          <Stack justifyContent={'flex-start'}>
            <Checkbox
              {...field}
              p={1}
              gap={1}
              size={'lg'}
              fontWeight="500"
              colorScheme="green"
              borderColor={'gray'}
              {...props}
            >
              {label ?? inputName}
            </Checkbox>
          </Stack>

          {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
        </FormControl>
      )}

      {inputType !== 'checkbox' && (
        <FormControl
          isDisabled={isDisabled}
          isRequired={isRequired}
          isInvalid={error}
          isReadOnly={isReadOnly}
          {...formControlProps}
        >
          {isLabel && (
            <FormLabel textTransform={'capitalize'} htmlFor={inputName}>
              {label ?? inputName}
            </FormLabel>
          )}

          {isPassword ? (
            <HStack position={'relative'}>
              <Input
                {...field}
                id={inputName}
                type={seePassword ? 'text' : 'password'}
                placeholder={placeholder}
                {...props}
              />

              <IconButton
                icon={seePassword ? <VscEye /> : <VscEyeClosed />}
                position={'absolute'}
                bg={'transparent'}
                _hover={{ bg: 'transparent' }}
                borderRadius={'100%'}
                right={0}
                zIndex={10}
                onClick={() => setSeePassword((prev) => !prev)}
              />
            </HStack>
          ) : (
            <Input
              {...field}
              id={inputName}
              type={inputType}
              placeholder={placeholder}
              {...props}
            />
          )}

          {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
        </FormControl>
      )}
    </>
  );
};

export const FormAutoCompleteInput = ({
  control,
  inputName,
  inputType,
  label,
  placeholder,
  validationRules = {},
  isRequired = false,
  isDisabled = false,
  children,
  onChange,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: inputName,
    rules: { ...validationRules },
    control,
  });

  return (
    <FormControl
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={error}
    >
      <FormLabel textTransform={'capitalize'} htmlFor={inputName}>
        {label ?? inputName}
      </FormLabel>

      <AutoComplete openOnFocus={false}>
        <AutoCompleteInput
          {...field}
          id={inputName}
          type={inputType}
          placeholder={placeholder}
          variant="filled"
          backgroundColor="transparent"
          _hover={{ backgroundColor: 'transparent' }}
          border="1.5px solid #E2E8F0"
          onChange={(event) => {
            field?.onChange(event);
            onChange && onChange?.(event);
          }}
        />
        <AutoCompleteList>{children}</AutoCompleteList>
      </AutoComplete>

      {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const FormSwitch = ({
  control,
  inputName,
  label,
  validationRules = {},
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  switchProps = {},
  onChange,
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: inputName,
    rules: { ...validationRules },
    control,
  });

  return (
    <FormControl
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={error}
      isReadOnly={isReadOnly}
    >
      <HStack
        py={2}
        justifyContent={'flex-start'}
        alignItems={'center'}
        gap={3}
      >
        <Switch
          {...field}
          id={inputName}
          {...props}
          isChecked={field?.value}
          onChange={(e) => {
            field?.onChange(e);
            onChange && onChange(e);
          }}
          {...switchProps}
        />
        <FormLabel textTransform={'capitalize'} htmlFor={inputName} mb={0}>
          {label ?? inputName}
        </FormLabel>
      </HStack>

      {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const MultiSelectFormControl = ({
  inputName,
  control,
  label,
  placeholder = '',
  validationRules,
  onChange,
  options = [],
  formControlProps,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: inputName,
    rules: { ...validationRules },
    control,
  });

  return (
    <FormControl {...formControlProps} isInvalid={error}>
      <FormLabel textTransform={'capitalize'} htmlFor={inputName}>
        {label ?? inputName}
      </FormLabel>

      <MultiSelect
        {...field}
        id={inputName}
        placeholder={placeholder}
        options={options}
        itemRef={undefined}
        onChange={(e) => onChange && onChange?.(e)}
      />

      {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const DatePickerFormControl = ({
  control,
  inputName,
  label,
  onChange,
  validationRules = {},
  formControlProps = {},
  datePickerProps = {},
  datePickerWrapperProps = {},
  inputProps = {},
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: inputName,
    rules: { ...validationRules },
    control,
  });

  const DatePickerInput = React.forwardRef((props, ref) => (
    <InputGroup>
      <Input {...props} ref={ref} />
      <InputRightElement {...props} children={<CalendarIcon />} />
    </InputGroup>
  ));

  return (
    <FormControl isInvalid={error} {...formControlProps}>
      <FormLabel textTransform={'capitalize'} htmlFor={inputName}>
        {label ?? inputName}
      </FormLabel>

      <HStack {...datePickerWrapperProps} className="tamally">
        <ReactDatePicker
          {...field}
          selected={field?.value ?? undefined}
          onChange={(date) => {
            field?.onChange(date);
            onChange?.(date);
          }}
          {...datePickerProps}
          customInput={<DatePickerInput {...inputProps} />}
          wrapperClassName="react-date-picker-wrapper"
        />
      </HStack>

      {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};
