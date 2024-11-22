import { AiOutlinePlus } from 'react-icons/ai';
import { Button, useDisclosure, IconButton, Tooltip } from '@chakra-ui/react';

export const AddNewButton = ({
  onClick,
  size,
  label,
  backgroundColor,
  ...props
}) => {
  const themeColor = backgroundColor ?? '#00b894';
  const buttonLabel = label ?? 'Add New';

  return (
    <Button
      onClick={onClick}
      leftIcon={<AiOutlinePlus />}
      backgroundColor={themeColor}
      _hover={{ opacity: '0.9' }}
      color={'white'}
      variant="solid"
      size={size ?? 'md'}
      data-testid={buttonLabel}
      {...props}
    >
      {buttonLabel}
    </Button>
  );
};

export const AgspeakThemeButton = ({
  buttonLabel,
  onClick,
  variant,
  size,
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      backgroundColor={'#00b894'}
      _hover={{ opacity: '0.9' }}
      _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
      color={'white'}
      variant={variant ?? 'solid'}
      size={size ?? 'md'}
      data-testid={buttonLabel}
      {...props}
    >
      {buttonLabel}
    </Button>
  );
};

export const TooltipActionButton = ({
  tooltipLabel,
  onClick,
  buttonStyles = {},
  buttonIcon,
  tooltipStyles = {},
}) => {
  const {
    isOpen: tooltipIsOpen,
    onOpen: openTooltip,
    onClose: closeTooltip,
  } = useDisclosure();

  return (
    <>
      <Tooltip
        label={tooltipLabel}
        fontSize="sm"
        placement="right"
        rounded="md"
        hasArrow
        isOpen={tooltipIsOpen}
        {...tooltipStyles}
      >
        <IconButton
          onMouseOver={(e) => {
            e?.stopPropagation();
            openTooltip();
          }}
          onMouseLeave={(e) => {
            e?.stopPropagation();
            closeTooltip();
          }}
          onClick={(e) => {
            e?.stopPropagation();
            onClick?.();
          }}
          icon={buttonIcon}
          {...{
            width: 'fit-content',
            ...buttonStyles,
          }}
        />
      </Tooltip>
    </>
  );
};

export default AddNewButton;
