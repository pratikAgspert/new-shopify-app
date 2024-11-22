import { Button } from '@chakra-ui/react';

export const FilterTab = ({
  label,
  isHighlighted = false,
  onClick,
  genericStyles = {},
  highlightedStyles = {},
}) => {
  const highlightedTabStyles = {
    variant: 'solid',
    borderWidth: '1.3px',
    transform: 'scale(1.05)',
    ...(isHighlighted && { ...highlightedStyles }),
  };

  return (
    <Button
      variant={'outline'}
      borderWidth={'1.2px'}
      rounded={'2rem'}
      onClick={onClick}
      {...(genericStyles && { ...genericStyles })}
      {...(isHighlighted && { ...highlightedTabStyles })}
    >
      {label}
    </Button>
  );
};

export default FilterTab;
