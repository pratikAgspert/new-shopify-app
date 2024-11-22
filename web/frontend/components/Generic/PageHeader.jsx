import AddNewButton from './CustomButtons';
import { Flex, Text } from '@chakra-ui/react';
import { Children } from 'react';

export const PageHeader = ({ headerLabel, buttonLabel, onClick, children }) => {
  const [ModalTrigger] = Children.toArray(children) || null;
  const headerButtonLabel = buttonLabel ?? 'Add New';

  return (
    <Flex p={2} justifyContent={'space-between'} alignItems={'center'}>
      <Text
        mb={0}
        textTransform={'capitalize'}
        fontSize={'x-large'}
        fontWeight={'500'}
      >
        {headerLabel}
      </Text>

      <>
        {ModalTrigger || (
          <AddNewButton label={headerButtonLabel} onClick={onClick} />
        )}
      </>
    </Flex>
  );
};

export default PageHeader;
