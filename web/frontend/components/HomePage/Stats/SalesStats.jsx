import { Grid, GridItem, Spinner } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useGetAllSaleOrdersStats } from '../../../apiHooks/useSaleOrder';
import GenericSearchBar from './GenericSearchBar';
import { useGetCustomers } from '../../../apiHooks/useCustomers';
import GenericCardComponent, {
  AccordionCard,
  Card,
  RefetchButton,
  StatsCardAccordion,
} from './GenericCardComponent';
import { useProducts } from '../../../apiHooks/useProducts';
import { useSalesStats } from '../../../apiHooks/useGlobalStats';
import { getDateRange } from '../HomePage';

export const SalesStats = ({
  timeline,
  title,
  dragHandleProps,
  onClickClose,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { data: productData } = useProducts();
  const [searchParama, setSearchParama] = useState('');

  const {
    data: customerData,
    isPending: isCustomerDataPending,
    isError: isCustomerDataError,
  } = useGetCustomers();

  const {
    data: searchData,
    isPending: isSearchDataPending,
    isSuccess: isSearchDataSuccess,
    isError: isSearchDataError,
    refetch: refetchSearchData,
  } = useSalesStats(searchParama);

  const handleSelect = (item) => {
    setSelectedCustomer(item);
  };

  const customers = useMemo(() => {
    const posUsers = customerData?.map((user) => ({
      id: user?.customer_profile?.id,
      name: user?.customer_profile?.name,
      type: 'user',
    }));

    const products = productData?.map((product) => ({
      id: product?.id,
      name: product?.name,
      type: 'product',
    }));

    const list = [...(posUsers || []), ...(products || [])];

    return list;
  }, [customerData, productData]);

  const searchParams = new URLSearchParams(getDateRange(timeline) ?? {});
  const queryString = searchParams?.toString() || '';

  const onClearSearch = () => {
    setSelectedCustomer(null);
    setSearchParama(queryString);
  };

  useEffect(() => {
    let newSearchParams = '';

    if (selectedCustomer) {
      newSearchParams = `id_value=${selectedCustomer.id}&id_type=${selectedCustomer.type}`;
    }

    if (queryString) {
      newSearchParams += newSearchParams ? '&' + queryString : queryString;
    }

    setSearchParama(newSearchParams);
  }, [selectedCustomer, queryString]);

  const redirectUrl =
    selectedCustomer?.type === 'user'
      ? `pos?id=${selectedCustomer?.id}`
      : selectedCustomer?.type === 'product'
      ? `products?id=${selectedCustomer?.id}`
      : '';

  return (
    <GenericCardComponent
      json={searchData || null}
      title={title}
      onClickClose={onClickClose}
      selected={selectedCustomer}
      dragHandleProps={dragHandleProps}
      bg={'#e6f3fa'}
      body={
        <>
          <GenericSearchBar
            data={customers}
            isLoading={isCustomerDataPending}
            isError={isCustomerDataError}
            onSelect={handleSelect}
            onClearSearch={onClearSearch}
            placeholder="Search Customer & Product..."
          />

          {/* {isSearchDataPending ? (
            <Spinner
              size="lg"
              alignSelf={'center'}
              my={5}
              color="rgba(0,184,148,1)"
            />
          ) : isSearchDataError ? (
            <RefetchButton callRefetch={refetchSearchData} />
          ) : ( */}
          <Grid
            templateRows="repeat(3, 1fr)"
            templateColumns="repeat(3, 1fr)"
            gap={3}
          >
            <GridItem>
              <Card
                value={searchData?.total_orders || 0}
                label={'Total Orders'}
                isNos
                isLoading={isSearchDataPending}
              />
            </GridItem>

            {/* <GridItem>
                <Card
                  value={`${
                    searchData?.total_quantity?.kg?.toFixed(2) || 0
                  } kg, ${
                    searchData?.total_quantity?.litre?.toFixed(2) || 0
                  } liter`}
                  label={'Total Quantity'}
                  isLoading={isSearchDataPending}
                  isCustom
                />
              </GridItem> */}

            <GridItem>
              <Card
                value={(searchData?.total_purchases || 0).toFixed(2)}
                label={'Total Value'}
                isLoading={isSearchDataPending}
                isAmount
              />
            </GridItem>

            <GridItem>
              <Card
                value={searchData?.num_accepted_orders || 0}
                label={'Accepted Orders'}
                isLoading={isSearchDataPending}
                isNos
              />
            </GridItem>

            <GridItem>
              <Card
                value={searchData?.num_pending_orders || 0}
                label={'Pending Orders'}
                isLoading={isSearchDataPending}
                isNos
              />
            </GridItem>

            <GridItem>
              <Card
                value={searchData?.num_rejected_orders || 0}
                label={'Rejected Orders'}
                isLoading={isSearchDataPending}
                isNos
              />
            </GridItem>

            <GridItem>
              <Card
                value={searchData?.num_cancelled_orders || 0}
                label={'Cancelled Orders'}
                isLoading={isSearchDataPending}
                isNos
              />
            </GridItem>

            <GridItem>
              <Card
                value={searchData?.num_reverse_orders || 0}
                label={'Return Orders'}
                isLoading={isSearchDataPending}
                isNos
              />
            </GridItem>

            <GridItem>
              <Card
                value={searchData?.total_reverse_order_value || 0}
                label={'Return Orders Value'}
                isLoading={isSearchDataPending}
                isAmount
              />
            </GridItem>

            <GridItem>
              <Card
                value={searchData?.total_products_sold || 0}
                label={'Products Sold'}
                isLoading={isSearchDataPending}
                isNos
              />
            </GridItem>

            <GridItem>
              <Card
                value={searchData?.total_skus_sold || 0}
                label={'SKUs Sold'}
                isLoading={isSearchDataPending}
                isNos
              />
            </GridItem>

            <GridItem>
              <Card
                value={searchData?.total_items_sold || 0}
                label={'Items Sold'}
                isLoading={isSearchDataPending}
                isNos
              />
            </GridItem>

            {selectedCustomer?.type !== 'product' && (
              <GridItem>
                <Card
                  value={searchData?.balance || 0}
                  label={'Balance'}
                  isLoading={isSearchDataPending}
                  isAmount
                />
              </GridItem>
            )}

            {selectedCustomer?.type === 'product' && (
              <GridItem>
                <Card
                  value={searchData?.num_unique_pos || 0}
                  label={'Unique POS Users'}
                  isLoading={isSearchDataPending}
                  isNos
                />
              </GridItem>
            )}
          </Grid>
          {/* )} */}
        </>
      }
      accordion={
        <>
          {selectedCustomer !== null && (
            <StatsCardAccordion
              label={
                isSearchDataPending ? (
                  <Spinner
                    size="sm"
                    alignSelf={'center'}
                    color="rgba(0,184,148,1)"
                  />
                ) : (
                  `${selectedCustomer?.name} ${
                    selectedCustomer?.type && `(${selectedCustomer?.type})`
                  }`
                )
              }
              headerStyles={{ bg: '#bcdff2' }}
              isLoading={isSearchDataPending}
              isSuccess={isSearchDataSuccess}
              isError={isSearchDataError}
              buttonUrl={redirectUrl}
              body={
                <>
                  {/* {isSearchDataPending ? (
                    <Spinner
                      size="lg"
                      alignSelf={'center'}
                      my={3}
                      color="rgba(0,184,148,1)"
                    />
                  ) : isSearchDataError ? (
                    <RefetchButton callRefetch={refetchSearchData} />
                  ) : ( */}
                  <Grid
                    templateRows="repeat(5, 1fr)"
                    templateColumns="repeat(3, 1fr)"
                    gap={2}
                  >
                    <AccordionCard
                      label={'Orders'}
                      value={searchData?.total_orders || 0}
                    />

                    <AccordionCard
                      label={'Quantity'}
                      value={`${
                        searchData?.total_quantity?.kg?.toFixed(2) || 0
                      } kg, ${
                        searchData?.total_quantity?.litre?.toFixed(2) || 0
                      } liter`}
                    />

                    <AccordionCard
                      label={'Total Value'}
                      value={`₹${(searchData?.total_purchases || 0).toFixed(
                        2
                      )}`}
                    />

                    <AccordionCard
                      label={'Accepted Orders'}
                      value={searchData?.num_accepted_orders || 0}
                    />

                    <AccordionCard
                      label={'Pending Orders'}
                      value={searchData?.num_pending_orders || 0}
                    />

                    <AccordionCard
                      label={'Rejected Orders'}
                      value={searchData?.num_rejected_orders || 0}
                    />

                    <AccordionCard
                      label={'Cancelled Orders'}
                      value={searchData?.num_cancelled_orders || 0}
                    />

                    <AccordionCard
                      label={'Return Orders'}
                      value={searchData?.num_reverse_orders || 0}
                    />

                    <AccordionCard
                      label={'Return Orders Value'}
                      value={`₹${searchData?.total_reverse_order_value || 0}`}
                    />

                    <AccordionCard
                      label={'Products Sold'}
                      value={searchData?.total_products_sold || 0}
                    />

                    <AccordionCard
                      label={'SKUs Sold'}
                      value={searchData?.total_skus_sold || 0}
                    />

                    <AccordionCard
                      label={'Items Sold'}
                      value={(searchData?.total_items_sold || 0).toFixed(2)}
                    />

                    {selectedCustomer?.type === 'user' && (
                      <AccordionCard
                        label={'Balance'}
                        value={`₹${(searchData?.balance || 0).toFixed(2)}`}
                      />
                    )}

                    {selectedCustomer?.type === 'product' && (
                      <AccordionCard
                        label={'Unique POS Users'}
                        value={searchData?.num_unique_pos || 0}
                      />
                    )}
                  </Grid>
                  {/* )} */}
                </>
              }
            />
          )}
        </>
      }
    />
  );
};

export default SalesStats;
