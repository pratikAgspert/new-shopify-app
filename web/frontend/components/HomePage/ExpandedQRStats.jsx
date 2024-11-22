import {
  Stack,
  Box,
  Button,
  HStack,
  Grid,
  Text,
  Heading,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  DatePickerFormControl,
  FormSelect,
} from '../../components/Generic/ControlledFormControls';
import { useForm } from 'react-hook-form';
import PostSkeleton from '../../components/skeletons/PostSkeleton';
import { Bar, Pie } from 'react-chartjs-2';
import { useProducts } from '../../apiHooks/useProducts';
import {
  useQRScanPlotsStats,
  useQRScanStats,
} from '../../apiHooks/useStatisticsAPIs';
import { TbMapPinCode } from 'react-icons/tb';
import { LiaMapMarkerAltSolid } from 'react-icons/lia';
import { IoIosBarcode } from 'react-icons/io';
import { IoScanSharp } from 'react-icons/io5';
import { StatTab } from './QRAnalytics';
import { theme } from '@chakra-ui/react';
const CHAKRA_COLOR_SCHEMES = Object.keys(theme.colors || {});
const colorsToBeExcluded = [
  'transparent',
  'black',
  'whileAlpha',
  'blackAlpha',
  'gray',
  'white',
  'current',
  'whiteAlpha',
];
const { transparent, whileAlpha, blackAlpha, gray, white, ...rest } =
  CHAKRA_COLOR_SCHEMES; // 16
const USABLE_COLOR_SCHEMES = CHAKRA_COLOR_SCHEMES?.filter(
  (color) => !colorsToBeExcluded?.includes(color)
);

function convertToChartBarData(data, granularity = 'daily') {
  let labels = [];
  if (granularity === 'hourly') {
    labels = data.map((item) => {
      const date = new Date(item?.date).toLocaleDateString('en-IN', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      });
      const time = new Date(item?.date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return `${date} ${time}`;
    });
  } else {
    labels = data.map((item) => {
      const date = new Date(item?.date).toLocaleDateString('en-IN', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      });

      return `${date}`;
    });
  }
  const numScansData = data.map((item) => item.num_scans);
  const numUniqueScansData = data.map((item) => item.num_unique_scans);

  return {
    labels,
    datasets: [
      {
        label: 'Total Scans',
        data: numScansData,
        backgroundColor: '#4174f3',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Total Unique Scans',
        data: numUniqueScansData,
        backgroundColor: '#a2f7f2',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };
}

const localeFormatDateString = (inputDate) => {
  const date = new Date(inputDate);

  if (date?.toDateString() === 'Invalid Date') return '';

  const istDateString = date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return istDateString?.replace(/\//g, '-');
};

const ExpandedQRStats = ({
  data,
  selectedProduct,
  setSelectedProduct,
  selectedCity,
  setSelectedCity,
  timeline,
}) => {
  const {
    data: productData,
    isPending: isFetchingProducts,
    isError: productsError,
  } = useProducts();
  const productList = useMemo(() => {
    return productData ?? [];
  }, [productData]);

  const {
    formFields,
    defaultValues,
    startDateInputField,
    endDateInputField,
    productInputField,
    cityInputField,
    pincodeInputField,
    granularityInputField,
  } = useMemo(() => {
    const startDateInputField = 'start_date';
    const endDateInputField = 'end_date';
    const productInputField = 'product_id';
    const cityInputField = 'city';
    const pincodeInputField = 'pincode';
    const granularityInputField = 'granularity';

    const formFields = [startDateInputField, endDateInputField];

    const defaultValues = formFields?.reduce((defaultValues, field) => {
      defaultValues[field] = '';
      return defaultValues;
    }, {});
    defaultValues[granularityInputField] = 'daily';
    if (selectedProduct?.id) {
      defaultValues[productInputField] = selectedProduct?.id;
    }
    if (selectedCity) {
      defaultValues[cityInputField] = selectedCity;
    }

    return {
      formFields,
      defaultValues,
      startDateInputField,
      endDateInputField,
      productInputField,
      cityInputField,
      pincodeInputField,
      granularityInputField,
    };
  }, []);
  const handleProductChange = (productId) => {
    const product =
      productList?.find(({ id }) => id === Number(productId)) || null;

    setSelectedProduct(product);
    [cityInputField, pincodeInputField]?.map((field) => setValue(field, null));
  };

  const formMethods = useForm({ defaultValues });
  const {
    getValues,
    control,
    reset: resetForm,
    setValue,
    unregister,
    watch,
  } = formMethods;

  // watching
  const productWatch = useMemo(() => {
    return getValues(productInputField);
  }, [watch(productInputField)]);
  const cityWatch = useMemo(() => {
    return getValues(cityInputField);
  }, [watch(cityInputField)]);
  const pincodeWatch = useMemo(() => {
    return getValues(pincodeInputField);
  }, [watch(pincodeInputField)]);
  const startDateValue = useMemo(() => {
    return localeFormatDateString(getValues(startDateInputField));
  }, [watch(startDateInputField)]);
  const endDateValue = useMemo(() => {
    return localeFormatDateString(getValues(endDateInputField));
  }, [watch(endDateInputField)]);
  const {
    data: QRScanStats,
    isPending: isFetchingQRScanStats,
    isSuccess: isQRScanStatsSuccess, // should use time line from start and end date itself
  } = useQRScanStats(
    selectedProduct?.id,
    timeline,
    startDateValue,
    endDateValue
  );

  const curateFormData = useCallback((formData) => {
    const data = { ...(formData || {}) };
    [startDateInputField, endDateInputField]?.forEach((date) => {
      if (data?.[date]) {
        data[date] = localeFormatDateString(data?.[date]);
      }
    });
    return data;
  }, []);

  const formWatch = watch();

  const pincodesList = useMemo(() => {
    if (!cityWatch) return [];
    return QRScanStats?.city_to_pincodes?.[cityWatch] || [];
  }, [QRScanStats, cityWatch]);

  const {
    statsData: analyticsData,
    browsersStats2,
    OSStats2,
    cities: citiesList,
  } = useMemo(() => {
    const statsData = [];
    let cities = [];

    if (!selectedProduct?.id || !QRScanStats || QRScanStats?.detail)
      return { statsData, cities };

    cities = Object.keys(QRScanStats?.city_to_coords || {});
    const locations = QRScanStats.locations;
    let totalScans = QRScanStats?.total_scans ?? null;
    let totalUniqueScans = QRScanStats?.total_unique_scans ?? null;
    let totalPincodes = Object.keys(QRScanStats?.locations?.pincodes).reduce(
      (pincodes, pincode) => {
        if (pincode !== 'unknown') pincodes++;
        return pincodes;
      },
      0
    );

    let browsers = QRScanStats?.devices?.browsers || {};
    let os = QRScanStats?.devices?.os || {};

    if (cityWatch && pincodeWatch) {
      totalScans = locations.pincodes?.[pincodeWatch]?.num_scans || 0;
      totalUniqueScans =
        locations.pincodes?.[pincodeWatch]?.num_unique_scans || 0;
      browsers = locations.pincodes?.[pincodeWatch]?.browsers;
      os = locations.pincodes?.[pincodeWatch]?.os;
    } else if (cityWatch) {
      totalScans = locations.cities?.[cityWatch]?.num_scans || 0;
      totalUniqueScans = locations.cities?.[cityWatch]?.num_unique_scans || 0;
      totalPincodes = QRScanStats?.city_to_pincodes?.[cityWatch]?.length;
      browsers = locations.cities?.[cityWatch]?.browsers;
      os = locations.cities?.[cityWatch]?.os;
    }

    typeof totalScans === 'number' &&
      statsData.push({
        statLabel: 'All Scans',
        statValue: totalScans,
        icon: <IoScanSharp />,
      });

    typeof totalUniqueScans === 'number' &&
      statsData.push({
        statLabel: 'Unique Scans',
        statValue: totalUniqueScans,
        icon: <IoIosBarcode />,
      });

    const totalLocations = Object.keys(QRScanStats?.locations?.cities).reduce(
      (cities, cityName) => {
        if (cityName !== 'unknown') cities++;
        return cities;
      },
      0
    );

    typeof totalLocations === 'number' &&
      !cityWatch &&
      statsData.push({
        statLabel: 'Locations',
        statValue: totalLocations,
        icon: <LiaMapMarkerAltSolid />,
      });

    typeof totalPincodes === 'number' &&
      !pincodeWatch &&
      statsData.push({
        statLabel: 'Pincodes',
        statValue: totalPincodes,
        icon: <TbMapPinCode />,
      });

    const browsersStats2 = Object.entries(browsers || {})?.reduce(
      (prev, [browserName, scanData], i) => {
        const availableIndex = i <= 16 ? i : i % 16;
        const colorScheme = USABLE_COLOR_SCHEMES?.[availableIndex];
        const obj = {
          ...prev,
          labels: [...prev.labels, browserName],
          datasets: [
            {
              ...prev.datasets[0],
              data: [...prev.datasets[0].data, scanData?.num_scans || 0],
              backgroundColor: [
                ...prev.datasets[0].backgroundColor,
                colorScheme,
              ],
              borderColor: [...prev.datasets[0].borderColor],
            },
          ],
        };
        return obj;
      },
      {
        labels: [],
        datasets: [
          {
            label: 'Browser Stats',
            data: [],
            backgroundColor: [],
            borderColor: [],
          },
        ],
      }
    );

    const OSStats2 = Object.entries(os || {})?.reduce(
      (prev, [osName, scanData], i) => {
        const availableIndex = i <= 16 ? i : i % 16;
        const colorScheme = USABLE_COLOR_SCHEMES?.[availableIndex];
        const obj = {
          ...prev,
          labels: [...prev.labels, osName],
          datasets: [
            {
              ...prev.datasets[0],
              data: [...prev.datasets[0].data, scanData?.num_scans || 0],
              backgroundColor: [
                ...prev.datasets[0].backgroundColor,
                colorScheme,
              ],
              borderColor: [...prev.datasets[0].borderColor],
            },
          ],
        };
        return obj;
      },
      {
        labels: [],
        datasets: [
          {
            label: 'OS Stats',
            data: [],
            backgroundColor: [],
            borderColor: [],
          },
        ],
      }
    );

    return {
      statsData,
      cities,
      browsersStats2,
      OSStats2,
    };
  }, [QRScanStats, selectedProduct, cityWatch, pincodeWatch]);

  const formDataForQRPlots = useMemo(() => {
    return curateFormData(formWatch);
  }, [curateFormData(formWatch), formWatch]);
  const {
    data: scanPlotsData,
    isLoading: isScanPlotsLoading,
    isError: isScanPlotsError,
    error: scanPlotsError,
  } = useQRScanPlotsStats(productWatch, formDataForQRPlots);

  // set timeline
  useEffect(() => {
    if (timeline) {
      const today = new Date();
      let start_date = new Date();
      start_date.setDate(today.getDate() - timeline);
      setValue(startDateInputField, start_date);
      setValue(endDateInputField, today);
    }
  }, []);

  console.log(
    'scan plots',
    QRScanStats,
    browsersStats2,
    OSStats2,
    cityWatch,
    pincodeWatch
  );
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <>
      <HStack justifyContent={'center'}>
        <Heading as="h3">QR Scan Details</Heading>
      </HStack>
      <Stack px={3} py={2} width={'100%'} spacing={10}>
        <HStack spacing={8} justifyContent={'space-between'}>
          {[startDateInputField, endDateInputField]?.map((inputField) => {
            const label =
              inputField === startDateInputField ? 'Start Date' : 'End Date';

            return (
              <Box flex={1}>
                <DatePickerFormControl
                  inputName={inputField}
                  control={control}
                  label={label}
                  formControlProps={{}}
                  datePickerWrapperProps={{
                    justifyContent: 'stretch',
                  }}
                  datePickerProps={{
                    placeholderText: 'Select a date',
                    dateFormat: 'dd-MM-yyyy',
                  }}
                />
              </Box>
            );
          })}
          <Box flex={1}>
            <FormSelect
              inputName={productInputField}
              control={control}
              label={'Product'}
              onChange={(event) =>
                handleProductChange(event?.target?.value ?? '')
              }
              placeholder={`Select Product`}
              children={productList?.map(({ name, id }, index) => (
                <Button as="option" size={'lg'} key={id + index} value={id}>
                  {name}
                </Button>
              ))}
            />
          </Box>
          <Box flex={1}>
            <FormSelect
              inputName={cityInputField}
              control={control}
              label={'City'}
              onChange={(event) => {
                setValue(cityInputField, event?.target?.value ?? '');
                setValue(pincodeInputField, null);
              }}
              placeholder={`Select City`}
              children={citiesList?.map((city, index) => (
                <Button as="option" size={'lg'} key={city + index} value={city}>
                  {city}
                </Button>
              ))}
            />
          </Box>
          <Box flex={1}>
            <FormSelect
              inputName={pincodeInputField}
              control={control}
              label={'Pincode'}
              placeholder={`Select Pincode`}
              children={pincodesList?.map((pincode, index) => (
                <Button
                  as="option"
                  size={'lg'}
                  key={pincode + index}
                  value={pincode}
                >
                  {pincode}
                </Button>
              ))}
            />
          </Box>
        </HStack>
        {isFetchingQRScanStats ? (
          <PostSkeleton />
        ) : (
          <Grid templateColumns={'repeat(2, 1fr)'}>
            {analyticsData?.map((data) => {
              const { statLabel, statValue, icon } = data;
              return (
                <Box key={statLabel}>
                  <StatTab
                    statLabel={statLabel}
                    statValue={statValue}
                    icon={icon}
                  />
                </Box>
              );
            })}
          </Grid>
        )}

        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <Heading as={'h4'}>
            {watch(granularityInputField, 'daily') === 'daily'
              ? 'Daily '
              : 'Hourly '}
            Analysis
          </Heading>
          <Box>
            <FormSelect
              inputName={granularityInputField}
              control={control}
              noLabel
              placeholder={`Select Granularity`}
              children={['daily', 'hourly']?.map((granularity, index) => (
                <Button
                  as="option"
                  size={'lg'}
                  key={granularity + index}
                  value={granularity}
                >
                  {granularity}
                </Button>
              ))}
            />
          </Box>
        </HStack>
        {/* Granularity Bar Chart */}
        <Box>
          {isScanPlotsLoading ? (
            <PostSkeleton />
          ) : scanPlotsData?.length === 0 ? (
            <HStack justifyContent={'center'}>
              <Text>No data available to draw graphs</Text>
            </HStack>
          ) : (
            <>
              <Bar
                options={options}
                data={convertToChartBarData(
                  scanPlotsData,
                  watch(granularityInputField, 'daily')
                )}
              />
            </>
          )}
        </Box>
        {/* Browser and OS Pie chart */}
        <HStack spacing={8} justifyContent={'space-between'}>
          <Box>
            <Heading as="h4">Browser Usage</Heading>
            {browsersStats2?.labels?.length ? (
              <Pie data={browsersStats2} />
            ) : (
              <HStack justifyContent={'center'}>
                <Text>No Browser Data</Text>
              </HStack>
            )}
          </Box>
          <Box>
            <Heading as="h4">OS Usage</Heading>
            {OSStats2?.labels?.length ? (
              <Pie data={OSStats2} />
            ) : (
              <HStack justifyContent={'center'}>
                <Text>No OS Data</Text>
              </HStack>
            )}
          </Box>
        </HStack>
      </Stack>
    </>
  );
};

export default ExpandedQRStats;
