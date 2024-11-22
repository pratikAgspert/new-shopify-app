import { Stack } from '@chakra-ui/react';
import React from 'react';

export const BrandBanner = ({ data }) => {
  const brandBanner = data?.find((info) => info.type === 'brand_banner');

  return (
    <>
      {brandBanner?.data[0]?.image_url && brandBanner?.isActive ? (
        <Stack
          backgroundImage={brandBanner?.data[0]?.image_url}
          backgroundPosition="center"
          backgroundSize="cover"
          position="absolute"
          top={0}
          left={0}
          borderTopRadius="18px"
          zIndex={10}
          height="4.95rem"
          width="100%"
        />
      ) : null}
    </>
  );
};
