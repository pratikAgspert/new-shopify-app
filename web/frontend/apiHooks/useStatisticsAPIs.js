import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { BASE_URL } from '../services/baseURL';
import { AuthContext } from '../services/context';
import { makeRequest } from '../services/networkRequest';
import {
  FARMER_STATS_QUERY_KEY,
  HARVEST_STATS_QUERY_KEY,
  GEOFENCE_STATS_QUERY_KEY,
  MOVED_BATCH_STATS_QUERY_KEY,
  CREATED_BATCH_STATS_QUERY_KEY,
  BALANCE_STATS_QUERY_KEY,
  PRODUCT_INVENTORY_STATS_QUERY_KEY,
  INVENTORY_STATS_QUERY_KEY,
  QR_SCAN_STATS_QUERY_KEY,
  QR_SCAN_PLOTS_QUERY_KEY,
} from './ApiHooksQueryKeys';

export const useFarmerStats = (days = null) => {
  const time_period = typeof days === 'number' ? days : null;
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `kvk/farmer_stats/`;
  let queryKey = [FARMER_STATS_QUERY_KEY];

  if (time_period) {
    endPoint += `?time_period=${time_period}`;
    queryKey = [FARMER_STATS_QUERY_KEY, time_period];
  }

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const farmerStats = await makeRequest(endPoint, 'GET', getToken());
      return farmerStats;
    },
  });

  return {
    ...query,
  };
};

export const useHarvestStats = (days = null) => {
  const time_period = typeof days === 'number' ? days : null;
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `produce/harvest_stats/`;
  let queryKey = [HARVEST_STATS_QUERY_KEY];

  if (time_period) {
    endPoint += `?time_period=${time_period}`;
    queryKey = [HARVEST_STATS_QUERY_KEY, time_period];
  }

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const harvestStats = await makeRequest(endPoint, 'GET', getToken());
      return harvestStats;
    },
  });

  return {
    ...query,
  };
};

export const useGeofenceStats = (days = null) => {
  const time_period = typeof days === 'number' ? days : null;
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `api/geofence_stats/`;
  let queryKey = [GEOFENCE_STATS_QUERY_KEY];

  if (time_period) {
    endPoint += `?time_period=${time_period}`;
    queryKey = [GEOFENCE_STATS_QUERY_KEY, time_period];
  }

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const geofence_stats = await makeRequest(endPoint, 'GET', getToken());
      return geofence_stats;
    },
  });

  return {
    ...query,
  };
};

export const useCreatedBatchStats = (days = null) => {
  const time_period = typeof days === 'number' ? days : null;
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `scm/batch_created_stats/`;
  let queryKey = [CREATED_BATCH_STATS_QUERY_KEY];

  if (time_period) {
    endPoint += `?time_period=${time_period}`;
    queryKey = [CREATED_BATCH_STATS_QUERY_KEY, time_period];
  }

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const createdBatchStats = await makeRequest(endPoint, 'GET', getToken());
      return createdBatchStats;
    },
  });

  return {
    ...query,
  };
};

export const useMovedBatchStats = (days = null) => {
  const time_period = typeof days === 'number' ? days : null;
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `scm/batch_moved_stats/`;
  let queryKey = [MOVED_BATCH_STATS_QUERY_KEY];

  if (time_period) {
    endPoint += `?time_period=${time_period}`;
    queryKey = [MOVED_BATCH_STATS_QUERY_KEY, time_period];
  }

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const movedBatchStats = await makeRequest(endPoint, 'GET', getToken());
      return movedBatchStats;
    },
  });

  return {
    ...query,
  };
};

export const useBalanceStats = (days = null) => {
  const time_period = typeof days === 'number' ? days : null;
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `billing/balance_stats/`;
  let queryKey = [BALANCE_STATS_QUERY_KEY];

  if (time_period) {
    endPoint += `?time_period=${time_period}`;
    queryKey = [BALANCE_STATS_QUERY_KEY, time_period];
  }

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const balanceStats = await makeRequest(endPoint, 'GET', getToken());
      return balanceStats;
    },
  });

  return {
    ...query,
  };
};

export const useProductInventoryStats = (days = null) => {
  const time_period = typeof days === 'number' ? days : null;
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `inventory/product_inventory_stats/`;
  let queryKey = [PRODUCT_INVENTORY_STATS_QUERY_KEY];

  if (time_period) {
    endPoint += `?time_period=${time_period}`;
    queryKey = [PRODUCT_INVENTORY_STATS_QUERY_KEY, time_period];
  }

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const productInventoryStats = await makeRequest(
        endPoint,
        'GET',
        getToken()
      );
      return productInventoryStats;
    },
  });

  return {
    ...query,
  };
};

export const useInventoryStats = (days = null) => {
  const time_period = typeof days === 'number' ? days : null;
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `inventory/inventory_stats/`;
  let queryKey = [INVENTORY_STATS_QUERY_KEY];

  if (time_period) {
    endPoint += `?time_period=${time_period}`;
    queryKey = [INVENTORY_STATS_QUERY_KEY, time_period];
  }

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const inventoryStats = await makeRequest(endPoint, 'GET', getToken());
      return inventoryStats;
    },
  });

  return {
    ...query,
  };
};

export const useQRScanStats = (
  productId,
  days = null,
  start_date = null,
  end_date = null
) => {
  const time_period = typeof days === 'number' ? days : null;
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `kvk/scan_stats/?product_id=${productId}`;
  let queryKey = [QR_SCAN_STATS_QUERY_KEY, productId];
  if (start_date && end_date) {
    endPoint += `&start_date=${start_date}&end_date=${end_date}`;
    queryKey = [
      QR_SCAN_STATS_QUERY_KEY,
      productId,
      time_period,
      start_date,
      end_date,
    ];
  } else if (time_period) {
    endPoint += `&days=${time_period}`;
    queryKey = [QR_SCAN_STATS_QUERY_KEY, productId, time_period];
  }

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const QRStats = await makeRequest(endPoint, 'GET', getToken());
      return QRStats;
    },
  });

  return {
    ...query,
  };
};
// const queryData format = {start_date: 34-5-7869, end_date: 12-6-2024, city: 'hathras', pincode: 345678, granularity: 'fdsafdasfa'}
export const useQRScanPlotsStats = (productId, queryData = {}) => {
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `kvk/scan_plots`;
  let queryKey = [QR_SCAN_PLOTS_QUERY_KEY];

  let queryAdded = false;
  Object.keys(queryData || {})?.forEach((key, index) => {
    if (key && queryData[key]) {
      endPoint =
        endPoint +
        (!queryAdded
          ? `/?${key}=${queryData?.[key]}`
          : `&${key}=${queryData?.[key]}`);
      queryKey.push(queryData?.[key]);
      queryAdded = true;
    }
  });

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const ScanPlots = await makeRequest(endPoint, 'GET', getToken());
      return ScanPlots;
    },
  });

  return {
    ...query,
  };
};
