import { Grid, GridItem, Spinner } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import {
  useGetAllProcurementStats,
  useGetInventory,
  useGetProcurementStatsSearch,
} from '../../../apiHooks/useInventory';
import GenericSearchBar from './GenericSearchBar';
import GenericCardComponent, {
  AccordionCard,
  Card,
  RefetchButton,
  StatsCardAccordion,
} from './GenericCardComponent';
import useFarmers from '../../../apiHooks/useFarmers';
import { useGetVendors } from '../../../apiHooks/useVendors';

export const ProcurementStats = ({
  timeline,
  title,
  dragHandleProps,
  onClickClose,
}) => {
  const [selectedProcurement, setSelectedProcurement] = useState(null);
  const [searchParama, setSearchParama] = useState('');

  const {
    data: stats,
    isPending: isStatsPending,
    isError: isStatsError,
    refetch: refetchStats,
  } = useGetAllProcurementStats(timeline);

  const {
    data: searchData,
    isPending: isSearchDataPending,
    isError: isSearchDataError,
    isSuccess: isSearchDataSuccess,
    refetch: refetchSearchData,
  } = useGetProcurementStatsSearch(searchParama);

  const {
    data: farmerData,
    isPending: isFetchingFarmers,
    isError: farmersError,
  } = useFarmers();

  const {
    data: vendorData,
    isPending: isFetchingVendors,
    isError: vendorError,
  } = useGetVendors();

  const {
    data: procurementCategoryList,
    isPending: isProcurementCategoryListPending,
    isError: isProcurementCategoryListError,
  } = useGetInventory();

  const searchList = useMemo(() => {
    const farmers = farmerData?.map((user) => ({
      id: user?.user_id,
      name: user?.name,
      type: 'farmer',
      userdata: user,
    }));

    const vendors = vendorData?.map((user) => ({
      id: user?.id,
      name: user?.profile?.name,
      type: 'vendor',
      userdata: user,
    }));

    const procurementCategories = procurementCategoryList?.map((category) => ({
      id: category?.id,
      name: category?.name,
      type: 'category',
      userdata: category,
    }));

    const list = [
      ...(farmers || []),
      ...(vendors || []),
      ...(procurementCategories || []),
    ];

    return list;
  }, [farmerData, vendorData, procurementCategoryList]);

  const handleSelect = (item) => {
    setSelectedProcurement(item);
  };

  const searchParams = new URLSearchParams(timeline ?? {});
  const queryString = searchParams?.toString() || '';

  useEffect(() => {
    let newSearchParams = '';

    if (selectedProcurement) {
      newSearchParams = `id_value=${selectedProcurement?.id}&id_type=${selectedProcurement?.type}&${queryString}`;
    }

    setSearchParama(newSearchParams);
  }, [selectedProcurement, queryString]);

  const onClearSearch = () => {
    setSelectedProcurement(null);
    setSearchParama('');
  };

  const redirectUrl =
    selectedProcurement?.type === 'farmer'
      ? `users?category=farmers&id=${selectedProcurement?.id}`
      : selectedProcurement?.type === 'vendor'
      ? `users?category=vendors`
      : selectedProcurement?.type === 'category'
      ? `procurement?category=${selectedProcurement?.id}`
      : '';

  return (
    <GenericCardComponent
      json={stats || null}
      title={title}
      onClickClose={onClickClose}
      selected={selectedProcurement}
      dragHandleProps={dragHandleProps}
      bg={'#e8f5ec'}
      body={
        <>
          <GenericSearchBar
            data={searchList}
            isLoading={
              isFetchingFarmers ||
              isFetchingVendors ||
              isProcurementCategoryListPending
            }
            isError={
              farmersError || vendorError || isProcurementCategoryListError
            }
            onSelect={handleSelect}
            onClearSearch={onClearSearch}
            placeholder="Search Category, Farmer & Vendor..."
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
                value={stats?.total_category || 0}
                label={'Categories'}
                isNos
                isLoading={isStatsPending}
              />
            </GridItem>

            <GridItem>
              <Card
                value={stats?.total_value || 0}
                label={'Total Value'}
                isAmount
                isLoading={isStatsPending}
              />
            </GridItem>

            <GridItem>
              <Card
                value={stats?.source_profile || 0}
                label={'Suppliers'}
                isNos
                isLoading={isStatsPending}
              />
            </GridItem>

            <GridItem>
              <Card
                value={(stats?.avg_consumption || 0).toFixed(2)}
                label={'Avg. Consumption'}
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
          {selectedProcurement !== null && (
            <StatsCardAccordion
              label={
                isSearchDataPending ? (
                  <Spinner
                    size="sm"
                    alignSelf={'center'}
                    color="rgba(0,184,148,1)"
                  />
                ) : (
                  `${selectedProcurement?.name} ${
                    selectedProcurement?.type &&
                    `(${selectedProcurement?.type})`
                  }`
                )
              }
              headerStyles={{ bg: '#d6edde' }}
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
                  <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                    <AccordionCard
                      label={'Total Quantity'}
                      value={`${searchData?.total_quantity} ${
                        searchData?.unit_type !== 'NA'
                          ? searchData?.unit_type
                          : ''
                      }`}
                    />

                    <AccordionCard
                      label={'Total Consumption'}
                      value={`${searchData?.total_consumption} (${searchData?.total_consumption_percentage})%`}
                    />

                    <AccordionCard
                      label={'Net Value'}
                      value={`₹${searchData?.net_value}`}
                    />
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

export default ProcurementStats;
