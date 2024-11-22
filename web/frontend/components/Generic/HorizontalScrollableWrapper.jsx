import { useCallback, useRef, useState } from 'react';
import { Box, HStack, IconButton } from '@chakra-ui/react';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';

export const HorizontalScrollableWrapper = ({ children }) => {
  const wrapperContainerRef = useRef(null);

  const [state, setState] = useState({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });

  const onMouseDown = (e) => {
    setState({
      isDragging: true,
      startX: e.pageX - wrapperContainerRef.current.offsetLeft,
      scrollLeft: wrapperContainerRef.current.scrollLeft,
    });
  };

  const onMouseLeave = () => {
    setState({ ...state, isDragging: false });
  };

  const onMouseUp = () => {
    setState({ ...state, isDragging: false });
  };

  const onMouseMove = (e) => {
    if (!state.isDragging) return;

    e.preventDefault();

    const x = e.pageX - wrapperContainerRef.current.offsetLeft;
    const walk = (x - state.startX) * 3;
    wrapperContainerRef.current.scrollLeft = state.scrollLeft - walk;
  };

  const scroll = useCallback(
    (container, direction = 'left', offsetValue = 150) => {
      if (container) {
        const scrollOffset = direction === 'left' ? -offsetValue : offsetValue;

        container.scrollBy({
          left: scrollOffset,
          behavior: 'smooth',
        });
      }
    },
    []
  );

  return (
    <HStack spacing={3} alignItems={'center'}>
      <ScrollTrigger
        direction="left"
        onClick={() => scroll(wrapperContainerRef?.current)}
      />

      <Box
        ref={wrapperContainerRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        overflow={'hidden'}
        py={2.5}
      >
        <Box width={'fit-content'}>{children}</Box>
      </Box>

      <ScrollTrigger
        direction="right"
        onClick={() => scroll(wrapperContainerRef?.current, 'right')}
      />
    </HStack>
  );
};

const ScrollTrigger = ({ direction = 'left', onClick }) => {
  const iconColor = '#00b894';
  const iconSize = '30';

  return (
    <IconButton
      size={'lg'}
      variant={'ghost'}
      onClick={onClick}
      aria-label={`${direction} scroll button`}
      icon={
        direction === 'left' ? (
          <FaChevronCircleLeft size={iconSize} color={iconColor} />
        ) : (
          <FaChevronCircleRight size={iconSize} color={iconColor} />
        )
      }
    />
  );
};

export default HorizontalScrollableWrapper;
