import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { AuthContext } from '../services/context';
import { makeRequest } from '../services/networkRequest';
import { BASE_URL } from '../services/baseURL';
import {
  BALANCE_LIST_QUERY_KEY,
  INVENTORY_LIST_QUERY_KEY,
  RAW_MATERIAL_LIST_QUERY_KEY,
  TRANSACTION_LIST_QUERY_KEY,
} from './ApiHooksQueryKeys';

export const useGetProcurementStatsSearch = (filterParams) => {
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `inventory/procurement_inventory/analytics`;

  if (filterParams) {
    endPoint =
      BASE_URL +
      `inventory/procurement_inventory/analytics/` +
      `?${filterParams}`;
  }

  let queryKey = ['procurement_search_stats', filterParams];

  const query = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const procurementSearchStats = await makeRequest(
        endPoint,
        'GET',
        getToken()
      );
      return procurementSearchStats;
    },
    enabled: !!filterParams,
  });

  return { ...query };
};

export const useGetAllProcurementStats = (filterParams = '') => {
  const { getToken } = useContext(AuthContext);
  let endPoint = BASE_URL + `inventory/procurement_inventory/generic_stats/`;
  let queryKey = ['procurement_stats'];

  const searchParams = new URLSearchParams(filterParams ?? {});
  const queryString = searchParams?.toString() || null;
  if (queryString) {
    endPoint += `?${queryString}`;
    queryKey = ['procurement_stats', queryString];
  }
  const query = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const procurement = await makeRequest(endPoint, 'GET', getToken());
      return procurement;
    },
  });

  return { ...query };
};

// Not in use
export const useGetCategoryStats = (id) => {
  const { getToken } = useContext(AuthContext);
  const endPoint =
    BASE_URL + `inventory/procurement_inventory/analytics/?category=${id}`;
  const query = useQuery({
    queryKey: ['procurement_category', id],
    queryFn: async () => {
      const procurement = await makeRequest(endPoint, 'GET', getToken());
      return procurement;
    },
    enabled: !!id,
  });

  return { ...query };
};

export const useGetInventory = () => {
  const { getToken } = useContext(AuthContext);

  const { endPoint, queryKey } = useMemo(() => {
    let endPoint = BASE_URL + `inventory/procurement_inventory/`;
    let queryKey = [INVENTORY_LIST_QUERY_KEY, 'ALL'];

    return { endPoint, queryKey };
  }, []);

  const getInventoryData = async (endPoint) => {
    try {
      const data = await makeRequest(endPoint, 'GET', getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: () => getInventoryData(endPoint),
  });

  return { ...query };
};

export const useGetFilteredInventory = (procurementFilters = null) => {
  const { getToken } = useContext(AuthContext);

  const { endPoint, queryKey } = useMemo(() => {
    let endPoint = BASE_URL + `inventory/procurement_inventory/`;
    let queryKey = [INVENTORY_LIST_QUERY_KEY];

    const searchParams = new URLSearchParams(procurementFilters ?? {});
    const queryString = searchParams?.toString() || null;

    if (queryString) {
      endPoint += `?${queryString}`;
      queryKey = [INVENTORY_LIST_QUERY_KEY, queryString];
    }

    return { endPoint, queryKey };
  }, [procurementFilters]);

  const getInventoryData = async (endPoint) => {
    try {
      const data = await makeRequest(endPoint, 'GET', getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: () => getInventoryData(endPoint),
  });

  return { ...query, procurementFilters };
};

export const useNewInventory = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const createNewInventory = async (formData) => {
    try {
      const endPoint = BASE_URL + `inventory/procurement_inventory/`;
      const data = await makeRequest(endPoint, 'post', getToken(), formData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: createNewInventory,
    onSuccess: async (serverData) => {
      await queryClient.invalidateQueries({
        queryKey: [INVENTORY_LIST_QUERY_KEY],
      });
    },
  });

  return { ...mutation };
};

export const useDeleteProcurement = () => {
  const { getToken } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const deleteProcurementItem = useMutation({
    mutationFn: async ({ id, type }) => {
      let base_url = BASE_URL;

      if (type === 'raw_material') {
        base_url = BASE_URL + 'inventory/raw_material/' + id + '/';
      } else {
        base_url = BASE_URL + 'produce/harvest/' + id + '/';
      }

      return await makeRequest(base_url, 'DELETE', getToken());
    },

    onSuccess: async () => {
      const queryKeys = [
        INVENTORY_LIST_QUERY_KEY,
        RAW_MATERIAL_LIST_QUERY_KEY,
        TRANSACTION_LIST_QUERY_KEY,
        BALANCE_LIST_QUERY_KEY,
      ];

      await Promise.all(
        queryKeys?.map(async (key) => {
          await queryClient.invalidateQueries({
            queryKey: [key],
          });
        })
      );
    },
  });
  return deleteProcurementItem;
};
