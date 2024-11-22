import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Spinner,
  Text,
  VStack,
  HStack,
  Box,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons'; // Chakra's green check icon

const LoadingModal = ({ isOpen, isShopCreated, isProductFetched }) => {
  const isRedirecting = isShopCreated && isProductFetched;

  return (
    <Modal
      isOpen={isOpen}
      isCentered
      onClose={() => {}}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={10}>
          <VStack align="stretch">
            {/* Heading with Connecting... animation */}
            <HStack>
              <Text fontSize="2xl" fontWeight="bold">
                Connecting to Store
              </Text>
              <Box>
                <BouncingCircles />
              </Box>
            </HStack>
            <HStack>
              {isShopCreated ? (
                <CheckCircleIcon color="green.500" boxSize={6} />
              ) : (
                <Spinner size="md" />
              )}
              <Text
                mt={3}
                fontSize="lg"
                fontWeight={isShopCreated ? 'bold' : 'normal'}
                ml={2}
                lineHeight="1.2"
              >
                Establishing Your Agspert Online Store
              </Text>
            </HStack>

            {isShopCreated && (
              <HStack>
                {isProductFetched ? (
                  <CheckCircleIcon color="green.500" boxSize={6} />
                ) : (
                  <Spinner size="md" />
                )}
                <Text
                  mt={3}
                  fontSize="lg"
                  fontWeight={isProductFetched ? 'bold' : 'normal'}
                  ml={2}
                  lineHeight="1.2"
                >
                  {' '}
                  {/* Added margin-left here */}
                  Collecting Products from Your Shopify Store...
                </Text>
              </HStack>
            )}

            {isRedirecting && (
              <HStack justify="center" mt={4}>
                <Text fontSize="lg" fontWeight="bold" color="blue.500">
                  Redirecting to Products Page...
                </Text>
              </HStack>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const BouncingCircles = () => {
  return (
    <svg width="50" height="50" viewBox="0 0 100 100">
      <circle className="circle" cx="20" cy="50" r="10" fill="#000000" />
      <circle className="circle" cx="50" cy="50" r="10" fill="#000000" />
      <circle className="circle" cx="80" cy="50" r="10" fill="#000000" />
      <style jsx>{`
        .circle {
          animation: bounce 0.6s infinite alternate;
        }

        .circle:nth-child(1) {
          animation-delay: 0s;
        }

        .circle:nth-child(2) {
          animation-delay: 0.2s;
        }

        .circle:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          from {
            cy: 50;
          }
          to {
            cy: 30; /* Move up */
          }
        }
      `}</style>
    </svg>
  );
};

export default LoadingModal;
