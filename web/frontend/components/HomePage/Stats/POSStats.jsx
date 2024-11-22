import { Grid, GridItem, Spinner } from '@chakra-ui/react';
import GenericCardComponent, {
  AccordionCard,
  Card,
  RefetchButton,
  StatsCardAccordion,
} from './GenericCardComponent';
import GenericSearchBar from './GenericSearchBar';
import { useEffect, useMemo, useState } from 'react';
import { useGetCustomers } from '../../../apiHooks/useCustomers';
import { useProducts } from '../../../apiHooks/useProducts';
import { usePosStats } from '../../../apiHooks/useGlobalStats';
import { getDateRange } from '../HomePage';

const POSStats = ({ title, onClickClose, dragHandleProps, timeline }) => {
  const [selectedPOS, setSelectedPOS] = useState(null);

  const [searchParama, setSearchParama] = useState('');

  const { data: productData } = useProducts();

  const {
    data: orderData,
    isPending: isOrderDataPending,
    isSuccess: isOrderDataSuccess,
    isError: isOrderDataError,
    refetch: refetchOrderData,
  } = usePosStats(searchParama);

  const {
    data: customerData,
    isPending: isFetchingCustomers,
    isError: customerError,
  } = useGetCustomers();

  const posUsers = useMemo(() => {
    const customerList = customerData?.map((user) => ({
      id: user?.customer_profile?.id,
      name: user?.customer_profile?.name,
      type: 'user',
    }));

    const productList = productData?.map((product) => ({
      id: product?.id,
      name: product?.name,
      type: 'product',
    }));

    return [...(customerList || []), ...(productList || [])];
  }, [customerData, productData]);

  const searchParams = new URLSearchParams(getDateRange(timeline) ?? {});
  const queryString = searchParams?.toString() || '';

  const onClearSearch = () => {
    setSelectedPOS(null);
    setSearchParama(queryString);
  };

  useEffect(() => {
    let newSearchParams = '';

    if (selectedPOS) {
      newSearchParams = `id_value=${selectedPOS.id}&id_type=${selectedPOS.type}`;
    }

    if (queryString) {
      newSearchParams += newSearchParams ? '&' + queryString : queryString;
    }

    setSearchParama(newSearchParams);
  }, [selectedPOS, queryString]);

  const handleSelect = (item) => {
    setSelectedPOS(item);
  };

  return (
    <GenericCardComponent
      json={orderData || null}
      title={title}
      onClickClose={onClickClose}
      selected={selectedPOS}
      dragHandleProps={dragHandleProps}
      bg={'#f3eeff'}
      body={
        <>
          <GenericSearchBar
            data={posUsers}
            isLoading={isFetchingCustomers}
            isError={customerError}
            onSelect={handleSelect}
            onClearSearch={onClearSearch}
            placeholder="Search Customer & Product..."
          />

          {/* {isOrderDataPending ? (
            <Spinner
              size="lg"
              alignSelf={'center'}
              my={5}
              color="rgba(0,184,148,1)"
            />
          ) : isOrderDataError ? (
            <RefetchButton callRefetch={refetchOrderData} />
          ) : ( */}
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(3, 1fr)"
            gap={3}
          >
            <GridItem>
              <Card
                value={orderData?.num_unique_customers || 0}
                label={'Customers'}
                isNos
                isLoading={isOrderDataPending}
                isError={isOrderDataError}
                refetchData={refetchOrderData}
              />
            </GridItem>

            <GridItem>
              <Card
                value={orderData?.num_unique_consumers || 0}
                label={'Consumers'}
                isNos
                isLoading={isOrderDataPending}
                isError={isOrderDataError}
                refetchData={refetchOrderData}
              />
            </GridItem>

            <GridItem>
              <Card
                value={orderData?.total_orders || 0}
                label={'Sale Orders'}
                isNos
                isLoading={isOrderDataPending}
                isError={isOrderDataError}
                refetchData={refetchOrderData}
              />
            </GridItem>

            <GridItem>
              <Card
                value={orderData?.total_items_sold || 0}
                label={'Sold Items'}
                isNos
                isLoading={isOrderDataPending}
                isError={isOrderDataError}
                refetchData={refetchOrderData}
              />
            </GridItem>

            <GridItem>
              <Card
                value={orderData?.total_products_sold || 0}
                label={'Sold Products'}
                isNos
                isLoading={isOrderDataPending}
                isError={isOrderDataError}
                refetchData={refetchOrderData}
              />
            </GridItem>

            <GridItem>
              <Card
                value={orderData?.total_skus_sold || 0}
                label={'Sold Skus'}
                isNos
                isLoading={isOrderDataPending}
                isError={isOrderDataError}
                refetchData={refetchOrderData}
              />
            </GridItem>

            <GridItem>
              <Card
                value={orderData?.total_purchases || 0}
                label={'Total Value'}
                isAmount
                isLoading={isOrderDataPending}
                isError={isOrderDataError}
                refetchData={refetchOrderData}
              />
            </GridItem>
          </Grid>
          {/* )} */}
        </>
      }
      accordion={
        <>
          {selectedPOS !== null && (
            <StatsCardAccordion
              label={
                isOrderDataPending ? (
                  <Spinner
                    size="sm"
                    alignSelf={'center'}
                    color="rgba(0,184,148,1)"
                  />
                ) : (
                  `${selectedPOS?.name} ${
                    selectedPOS?.type && `(${selectedPOS?.type})`
                  }`
                )
              }
              headerStyles={{ bg: '#e1d5ff' }}
              isLoading={isOrderDataPending}
              isSuccess={isOrderDataSuccess}
              isError={isOrderDataError}
              body={
                <>
                  {/* {isOrderDataPending ? (
                    <Spinner
                      size="lg"
                      alignSelf={'center'}
                      my={3}
                      color="rgba(0,184,148,1)"
                    />
                  ) : isOrderDataError ? (
                    <RefetchButton callRefetch={refetchOrderData} />
                  ) : ( */}
                  <Grid
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(3, 1fr)"
                    gap={2}
                  >
                    <AccordionCard
                      label={'Customers'}
                      value={orderData?.num_unique_customers || 0}
                    />

                    <AccordionCard
                      label={'Consumers'}
                      value={orderData?.num_unique_consumers || 0}
                    />

                    <AccordionCard
                      label={'Sale Orders'}
                      value={orderData?.total_orders || 0}
                    />

                    <AccordionCard
                      label={'Sold Items'}
                      value={orderData?.total_items_sold || 0}
                    />

                    <AccordionCard
                      label={'Sold Products'}
                      value={orderData?.total_products_sold || 0}
                    />

                    <AccordionCard
                      label={'Sold Skus'}
                      value={orderData?.total_skus_sold || 0}
                    />

                    <AccordionCard
                      label={'Total Value'}
                      value={`₹${orderData?.total_purchases || 0}`}
                    />
                  </Grid>
                  {/* )} */}
                </>
              }
              buttonUrl={
                selectedPOS?.type === 'user'
                  ? `pos?id=${selectedPOS?.id}`
                  : selectedPOS?.type === 'product'
                  ? `products?id=${selectedPOS?.id}`
                  : null
              }
            />
          )}
        </>
      }
    />
  );
};

export default POSStats;
