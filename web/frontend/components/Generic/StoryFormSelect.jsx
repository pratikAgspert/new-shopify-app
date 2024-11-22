import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from "@chakra-ui/react";

import { useController } from "react-hook-form";

const StoryFormSelect = ({
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
        <FormLabel textTransform={"capitalize"} htmlFor={inputName}>
          {label ?? inputName}
        </FormLabel>
      ) : null}

      <Select
        {...field}
        value={field?.value ? field?.value : ""}
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

export default StoryFormSelect;
