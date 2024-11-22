import { Grid, GridItem, Spinner } from '@chakra-ui/react';
import GenericCardComponent, {
  AccordionCard,
  Card,
  RefetchButton,
  StatsCardAccordion,
} from './GenericCardComponent';
import GenericSearchBar from './GenericSearchBar';
import {
  useFarmerStats,
  useGeofenceStats,
  useHarvestStats,
} from '../../../apiHooks/useStatisticsAPIs';
import { useNavigate } from 'react-router-dom';
import useFarmers from '../../../apiHooks/useFarmers';
import { useMemo, useState } from 'react';
import { useGetVendors } from '../../../apiHooks/useVendors';

const FarmerStats = ({ title, onClickClose, dragHandleProps, timeline }) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: farmerData,
    isPending: isFetchingFarmers,
    isError: farmersError,
    refetch: refetchFarmerData,
  } = useFarmers();

  const {
    data: vendorData,
    isPending: isFetchingVendors,
    isError: vendorError,
    refetch: refetchVendorData,
  } = useGetVendors();

  const farmerStatsQuery = useFarmerStats(timeline);
  const harvestStatsQuery = useHarvestStats(timeline);
  const geofenceStatsQuery = useGeofenceStats(timeline);

  const {
    data: farmerStats,
    isPending: isFetchingFarmerStats,
    isError: farmerStatsError,
    refetch: refetchFarmerStats,
  } = farmerStatsQuery;

  const {
    data: harvestStats,
    isPending: isFetchingHarvestStats,
    isError: harvestStatsError,
    refetch: refetchHarvestStats,
  } = harvestStatsQuery;

  const {
    data: geofenceStats,
    isPending: isFetchingGeofenceStats,
    isError: geofenceStatsError,
    refetch: refetchGeofenceStats,
  } = geofenceStatsQuery;

  const userList = useMemo(() => {
    const farmers = farmerData?.map((user) => ({
      id: user?.farmer_id,
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

    const list = [...(farmers || []), ...(vendors || [])];

    return list;
  }, [farmerData, vendorData]);

  const handleSelect = (item) => {
    setSelectedUser(item);
  };

  const redirectUrl =
    selectedUser?.type === 'farmer'
      ? `users?category=farmers&id=${selectedUser?.id}`
      : selectedUser?.type === 'vendor'
      ? `users?category=vendors`
      : '';

  const onClearSearch = () => {
    setSelectedUser(null);
  };

  return (
    <GenericCardComponent
      showSummarizeButton={false}
      title={title}
      onClickClose={onClickClose}
      selected={selectedUser}
      dragHandleProps={dragHandleProps}
      bg={'#fdf6d5'}
      body={
        <>
          <GenericSearchBar
            data={userList}
            isLoading={isFetchingFarmers || isFetchingVendors}
            isError={farmersError || vendorError}
            onSelect={handleSelect}
            onClearSearch={onClearSearch}
            placeholder="Search Farmer & Vendor..."
          />

          <Grid templateColumns="repeat(3, 1fr)" gap={3}>
            <GridItem
              onClick={() =>
                farmerStatsError === false &&
                navigate('/users?category=farmers')
              }
              _hover={{ bg: '#f5f5f5', cursor: 'pointer' }}
            >
              <Card
                value={farmerStats?.total}
                label={'Farmers'}
                isNos
                isLoading={isFetchingFarmerStats}
                isError={farmerStatsError}
                refetchData={refetchFarmerStats}
              />
            </GridItem>

            <GridItem
              onClick={() =>
                harvestStatsError === false &&
                navigate('/users?category=farmers')
              }
              _hover={{ bg: '#f5f5f5', cursor: 'pointer' }}
            >
              <Card
                value={harvestStats?.total}
                label={'Harvests'}
                isNos
                isLoading={isFetchingHarvestStats}
                isError={harvestStatsError}
                refetchData={refetchHarvestStats}
              />
            </GridItem>

            <GridItem
              onClick={() =>
                geofenceStatsError === false && navigate('/weather')
              }
              _hover={{ bg: '#f5f5f5', cursor: 'pointer' }}
            >
              <Card
                value={geofenceStats?.total}
                label={'Geofences'}
                isNos
                isLoading={isFetchingGeofenceStats}
                isError={geofenceStatsError}
                refetchData={refetchGeofenceStats}
              />
            </GridItem>
          </Grid>
        </>
      }
      accordion={
        <>
          {selectedUser !== null && (
            <StatsCardAccordion
              label={`${selectedUser?.name} ${
                selectedUser?.type && `(${selectedUser?.type})`
              }`}
              headerStyles={{ bg: '#fcf1bd' }}
              buttonUrl={redirectUrl}
              body={
                <>
                  {/* {isFetchingFarmers || isFetchingVendors ? (
                    <Spinner
                      size="lg"
                      alignSelf={'center'}
                      my={3}
                      color="rgba(0,184,148,1)"
                    />
                  ) : farmersError || vendorError ? (
                    <RefetchButton
                      callRefetch={refetchFarmerData || refetchVendorData}
                    />
                  ) : ( */}
                  <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                    {selectedUser?.type === 'farmer' ? (
                      <>
                        <AccordionCard
                          label={'Crops'}
                          value={
                            selectedUser?.userdata?.crop_details?.length || 0
                          }
                        />

                        <AccordionCard
                          label={'Harvest'}
                          value={
                            selectedUser?.userdata?.harvest_details?.length || 0
                          }
                        />

                        <AccordionCard
                          label={'Land'}
                          value={
                            selectedUser?.userdata?.land_details?.length || 0
                          }
                        />
                      </>
                    ) : selectedUser?.type === 'vendor' ? (
                      <AccordionCard label={'Procurement'} value={'N/A'} />
                    ) : null}
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

export default FarmerStats;
