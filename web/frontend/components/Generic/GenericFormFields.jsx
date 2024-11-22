import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import React from 'react';
import { useController } from 'react-hook-form';

export const FormInput = ({
  control,
  inputName,
  inputType = 'text',
  label,
  placeholder,
  validationRules = {},
  onChange,
  value,
  formControlProps,
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
    <>
      <FormControl isInvalid={error} {...formControlProps}>
        <FormLabel textTransform={'capitalize'} htmlFor={inputName}>
          {label ?? inputName}
        </FormLabel>

        <Input
          {...field}
          id={inputName}
          type={inputType}
          placeholder={placeholder}
          value={value ?? field.value}
          onChange={(e) => {
            field.onChange(e);
            onChange && onChange(e);
          }}
          data-testid={inputName}
          {...props}
        />

        {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
      </FormControl>
    </>
  );
};

export const FormInputTextArea = ({
  control,
  inputName,
  inputType = 'text',
  label,
  placeholder,
  validationRules = {},
  formControlProps,
  onChange,
  value,
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
    <>
      <FormControl {...formControlProps} isInvalid={error}>
        <FormLabel textTransform={'capitalize'} htmlFor={inputName}>
          {label ?? inputName}
        </FormLabel>

        <Textarea
          {...field}
          id={inputName}
          type={inputType}
          placeholder={placeholder}
          value={value ?? field.value}
          onChange={(e) => {
            field.onChange(e);
            onChange && onChange(e);
          }}
          {...props}
        />

        {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
      </FormControl>
    </>
  );
};

export const FormSelect = ({
  control,
  inputName,
  label,
  children: selectOptions,
  placeholder,
  validationRules = {},
  value,
  onChange,
  selectProps = {},
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

      <Select
        {...field}
        id={inputName}
        placeholder={placeholder}
        value={value ?? field.value}
        onChange={(e) => {
          field.onChange(e);
          onChange && onChange(e);
        }}
        {...selectProps}
      >
        {selectOptions}
      </Select>

      {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const FormSelectForFilter = ({
  control,
  inputName,
  label,
  children: selectOptions,
  placeholder,
  validationRules = {},
  value,
  onChange,
  selectProps = {},
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
      {label ? (
        <FormLabel textTransform={'capitalize'} htmlFor={inputName}>
          {label}
        </FormLabel>
      ) : null}

      <Select
        {...field}
        id={inputName}
        placeholder={placeholder}
        value={value ?? field.value}
        onChange={(e) => {
          field.onChange(e);
          onChange && onChange(e);
        }}
        borderRadius={100}
        textTransform={'capitalize'}
        {...selectProps}
      >
        {selectOptions}
      </Select>

      {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};
