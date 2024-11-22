import { Grid, GridItem, Spinner } from '@chakra-ui/react';
import { useState } from 'react';
import {
  useGetAllProductsStats,
  useGetProductStats,
  useProducts,
} from '../../../apiHooks/useProducts';
import GenericSearchBar from './GenericSearchBar';
import GenericCardComponent, {
  AccordionCard,
  Card,
  RefetchButton,
  StatsCardAccordion,
} from './GenericCardComponent';

export const ProductStats = ({
  timeline,
  title,
  dragHandleProps,
  onClickClose,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    data: productList,
    isPending: isProductListPending,
    isError: isProductListError,
  } = useProducts();

  const {
    data: stats,
    isPending: isStatsPending,
    isError: isStatsError,
    refetch: refetchStats,
  } = useGetAllProductsStats(timeline);

  const {
    data: productStats,
    isPending: isproductStatsPending,
    isSuccess: isProductStatsSuccess,
    isError: isproductStatsError,
    refetch: refetchProductStats,
  } = useGetProductStats(selectedProduct?.id);

  const handleSelect = (item) => {
    setSelectedProduct(item);
  };

  const onClearSearch = () => {
    setSelectedProduct(null);
  };

  return (
    <GenericCardComponent
      json={stats || null}
      title={title}
      onClickClose={onClickClose}
      selected={selectedProduct}
      dragHandleProps={dragHandleProps}
      bg={'#FFF8E8'}
      body={
        <>
          <GenericSearchBar
            data={productList}
            isLoading={isProductListPending}
            isError={isProductListError}
            onSelect={handleSelect}
            onClearSearch={onClearSearch}
            placeholder="Search Product..."
          />

          {/* {isStatsPending ? (
            <Spinner
              size="lg"
              alignSelf={'center'}
              my={5}
              color="rgba(0,184,148,1)"
            />
          ) : isStatsError ? (
            <RefetchButton callRefetch={refetchStats} />
          ) : ( */}
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(3, 1fr)"
            gap={3}
          >
            <GridItem>
              <Card
                value={stats?.total_products}
                label={'Product'}
                isNos
                isLoading={isStatsPending}
              />
            </GridItem>

            <GridItem>
              <Card
                value={stats?.total_skus}
                label={'Skus'}
                isNos
                isLoading={isStatsPending}
              />
            </GridItem>

            <GridItem>
              <Card
                value={stats?.total_value}
                label={'Total Value'}
                isAmount
                isLoading={isStatsPending}
              />
            </GridItem>

            <GridItem>
              <Card
                value={stats?.production_cost}
                label={'Production Cost'}
                isAmount
                isLoading={isStatsPending}
              />
            </GridItem>

            <GridItem>
              <Card
                value={(stats?.average_discount || 0).toFixed(2)}
                label={'Avg. Discount'}
                isPercentage
                isLoading={isStatsPending}
              />
            </GridItem>
          </Grid>
          {/* )} */}
        </>
      }
      accordion={
        <>
          {selectedProduct !== null && (
            <StatsCardAccordion
              label={
                isproductStatsPending ? (
                  <Spinner
                    size="sm"
                    alignSelf={'center'}
                    color="rgba(0,184,148,1)"
                  />
                ) : (
                  productStats?.product_name
                )
              }
              headerStyles={{ bg: '#fff0cf' }}
              isLoading={isproductStatsPending}
              isSuccess={isProductStatsSuccess}
              isError={isproductStatsError}
              body={
                <>
                  {/* {isproductStatsPending ? (
                    <Spinner
                      size="lg"
                      alignSelf={'center'}
                      my={3}
                      color="rgba(0,184,148,1)"
                    />
                  ) : isproductStatsError ? (
                    <RefetchButton callRefetch={refetchProductStats} />
                  ) : ( */}
                  <Grid
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(3, 1fr)"
                    gap={2}
                  >
                    <AccordionCard
                      label={'Product'}
                      value={productStats?.product_name}
                    />

                    <AccordionCard
                      label={'Skus'}
                      value={productStats?.total_skus || 0}
                    />

                    <AccordionCard
                      label={'Items'}
                      value={productStats?.total_items || 0}
                    />

                    <AccordionCard
                      label={'Value'}
                      value={productStats?.total_value || 0}
                    />
                    <AccordionCard
                      label={'Sold Items'}
                      value={productStats?.items_sold || 0}
                    />
                    <AccordionCard
                      label={'Return Items'}
                      value={productStats?.items_returned || 0}
                    />
                  </Grid>
                  {/* )} */}
                </>
              }
              buttonUrl={`products?id=${selectedProduct?.id}`}
            />
          )}
        </>
      }
    />
  );
};

export default ProductStats;
