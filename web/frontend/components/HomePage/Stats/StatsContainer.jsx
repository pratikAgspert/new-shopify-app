import { Box, HStack, Stack, Text, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const StatsContainer = ({
  statType,
  statsData,
  containerStyles = {},
}) => {
  const navigate = useNavigate();

  return (
    <Stack spacing={4} height={'100%'} {...containerStyles}>
      {statType && (
        <Text
          mb={0}
          fontSize={'x-large'}
          fontWeight={'600'}
          textTransform={'capitalize'}
          textAlign={'center'}
        >
          {statType}
        </Text>
      )}

      <HStack
        justifyContent={'space-between'}
        spacing={4}
        width={'100%'}
        height={'100%'}
        flex={1}
      >
        {statsData?.map((stat) => {
          const { statLabel, statValue, icon, path, isCreatable } = stat;

          return (
            <StatTab
              key={path + statLabel + statValue}
              stat={stat}
              onClick={() => navigate(path)}
            />
          );
        })}
      </HStack>
    </Stack>
  );
};

const StatTab = ({ onClick, stat }) => {
  const { statLabel, statValue, icon, isCreatable } = stat;

  const validStats = typeof statValue === 'number' && statValue >= 0;
  const isActionStatTab = validStats && statValue === 0 && isCreatable;

  return (
    <>
      {statLabel && validStats && icon?.type && (
        <Stack
          as={'button'}
          onClick={onClick}
          justifyContent={'space-between'}
          alignItems={'center'}
          spacing={3}
          px={5}
          py={2}
          transition={'all 150ms ease-out'}
          transform={`rotateY(0)`}
          border={'1px solid transparent'}
          borderRadius={'lg'}
          _hover={{
            background: `radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.46) 2.1%, rgba(233, 226, 226, 0.28) 90.1%)`,
            transform: 'scale(0.95)',
            boxShadow: '0.1px 0.1px 2px 0 #12121230',
            backdropBlur: '2rem',
          }}
        >
          <Box
            p={2}
            borderRadius={'lg'}
            background={
              'radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)'
            }
          >
            <Icon as={icon?.type} boxSize={30} color={'#00b894'} />
          </Box>

          {isActionStatTab && <ActionTab statLabel={statLabel} />}

          {!isActionStatTab && (
            <Stack spacing={0.5}>
              <Text mb={0} fontWeight={700} fontSize={'lg'}>
                {statValue < 10 ? `0${statValue}` : `${statValue}`}
              </Text>

              <Text flex={1} mb={0} fontWeight={450} fontSize={'md'}>
                {statLabel}
              </Text>
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
};

const ActionTab = ({ statLabel }) => {
  const statType = statLabel?.split(' ')?.slice(-1)?.[0] || '';

  return (
    <>
      <Stack spacing={0.5}>
        {['Create', statType]?.map((word) => {
          return (
            <Text
              key={word}
              flex={1}
              mb={0}
              fontWeight={500}
              fontSize={'md'}
              width={'100%'}
            >
              {word}
            </Text>
          );
        })}
      </Stack>
    </>
  );
};

export default StatsContainer;
