import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import {
  Stack,
  HStack,
  Text,
  Switch,
  Input,
  Textarea,
  Button,
  IconButton,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';

const ContentPositions = ({ control, isDisabled = false }) => {
  const [isActive, setIsActive] = useState(true);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'positions',
  });

  const addNewPosition = () => {
    append({
      position: '',
      x: '',
      y: '',
      z: '',
      content: '',
    });
  };

  return (
    <Stack
      mt={5}
      border="1px solid"
      borderColor="gray.200"
      padding={3}
      borderRadius="lg"
      spacing={4}
    >
      <HStack justifyContent={'space-between'}>
        <FormControl w={'20%'}>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            variant="outline"
            onClick={addNewPosition}
            isDisabled={isDisabled || !isActive}
            w="full"
            borderRadius="full"
          >
            Add Content
          </Button>
        </FormControl>

        <Switch
          size="md"
          isChecked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          isDisabled={isDisabled}
        />
      </HStack>

      {fields.map((field, index) => (
        <Stack
          key={field.id}
          border="1px solid"
          borderColor="gray.100"
          p={4}
          borderRadius="lg"
          spacing={4}
        >
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontWeight="medium">Position {index + 1}</Text>
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => remove(index)}
              isDisabled={isDisabled || !isActive}
              size="sm"
              colorScheme="red"
              variant="ghost"
            />
          </HStack>

          <HStack>
            <FormControl isInvalid={false}>
              <Input
                {...control.register(`positions.${index}.x`)}
                placeholder="X axis"
                size="sm"
                borderRadius={50}
                type="number"
                isDisabled={isDisabled || !isActive}
              />
            </FormControl>

            <FormControl isInvalid={false}>
              <Input
                {...control.register(`positions.${index}.y`)}
                placeholder="Y axis"
                size="sm"
                borderRadius={50}
                type="number"
                isDisabled={isDisabled || !isActive}
              />
            </FormControl>

            <FormControl isInvalid={false}>
              <Input
                {...control.register(`positions.${index}.z`)}
                placeholder="Z axis"
                size="sm"
                borderRadius={50}
                type="number"
                isDisabled={isDisabled || !isActive}
              />
            </FormControl>
          </HStack>

          <FormControl isInvalid={false}>
            <Textarea
              {...control.register(`positions.${index}.content`)}
              placeholder="Enter information"
              size="sm"
              height="50px"
              borderRadius={10}
              isDisabled={isDisabled || !isActive}
            />
          </FormControl>
        </Stack>
      ))}
    </Stack>
  );
};

export default ContentPositions;
