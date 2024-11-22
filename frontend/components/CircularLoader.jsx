import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const CircularLoader = ({ progress, color }) => {
  const size = 80;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <Box
      position="absolute"
      top="50%"
      left="50%"
      width={`${size}px`}
      height={`${size}px`}
      transform="translate(-50%, -50%)"
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3182ce"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <Text
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        fontWeight="semibold"
        fontSize="lg"
        color={color ? color : 'white'}
        mb={0}
      >
        {Math.round(progress)}%
      </Text>
    </Box>
  );
};

export default CircularLoader;
