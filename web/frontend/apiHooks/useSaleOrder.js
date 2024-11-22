import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { BASE_URL } from '../services/baseURL';
import { AuthContext } from '../services/context';
import { makeRequest } from '../services/networkRequest';
import {
  BALANCE_LIST_QUERY_KEY,
  RETURNED_SALE_ORDER_LIST_QUERY_KEY,
  SALE_ORDER_LIST_QUERY_KEY,
  SALE_ORDER_TRANSACTION_LIST_QUERY_KEY,
  TRANSACTION_LIST_QUERY_KEY,
  REJECTED_SALE_ORDER_LIST_QUERY_KEY,
  UNPAID_SALE_ORDER_LIST_QUERY_KEY
} from './ApiHooksQueryKeys';

export const useCreateSaleOrder = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const createSaleOrder = async (formData) => {
    try {
      const endPoint = BASE_URL + `sale/order/`;
      const data = await makeRequest(endPoint, 'POST', getToken(), formData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: createSaleOrder,
    onSuccess: async () => {
      const queryKeys = [
        SALE_ORDER_LIST_QUERY_KEY,
        TRANSACTION_LIST_QUERY_KEY,
        BALANCE_LIST_QUERY_KEY,
      ];

      await Promise.all(
        queryKeys?.map(async (key) => {
          await queryClient.invalidateQueries({
            queryKey: [key],
            exact: false,
          });
        })
      );
    },
  });

  return mutation;
};

export const useEditSaleOrder = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const editSaleOrder = async ({ id, formData }) => {
    try {
      const endPoint = BASE_URL + `sale/order/${id}/`;
      const data = await makeRequest(endPoint, 'PUT', getToken(), formData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: editSaleOrder,
    onSuccess: async () => {
      const queryKeys = [
        SALE_ORDER_LIST_QUERY_KEY,
        TRANSACTION_LIST_QUERY_KEY,
        BALANCE_LIST_QUERY_KEY,
      ];

      await Promise.all(
        queryKeys?.map(async (key) => {
          await queryClient.invalidateQueries({
            queryKey: [key],
            exact: false,
          });
        })
      );
    },
  });

  return mutation;
};

export const useGetPaidFilteredSaleOrders = (saleOrderFilters = null) => {
  const { getToken } = useContext(AuthContext);

  const { endPoint, queryKey } = useMemo(() => {
    let endPoint = BASE_URL + `sale/generic_orders/`;
    let queryKey = [SALE_ORDER_LIST_QUERY_KEY];

    const searchParams = new URLSearchParams({...(saleOrderFilters ||{}), ...{paid: true}} ?? {});
    const queryString = searchParams?.toString() || null;

    if (queryString) {
      endPoint += `?${queryString}`;
      queryKey = [SALE_ORDER_LIST_QUERY_KEY, queryString];
    }

    return { endPoint, queryKey };
  }, [saleOrderFilters]);

  const getSaleOrderData = async (endPoint) => {
    try {
      const data = await makeRequest(endPoint, 'GET', getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: () => getSaleOrderData(endPoint),
    select: (saleOrderData) => saleOrderData?.data ?? [],
  });

  return { ...query, saleOrderFilters };
};
export const useGetUnpaidFilteredSaleOrders = (saleOrderFilters = null) => {
  const { getToken } = useContext(AuthContext);

  const { endPoint, queryKey } = useMemo(() => {
    let endPoint = BASE_URL + `sale/generic_orders/`;
    let queryKey = [UNPAID_SALE_ORDER_LIST_QUERY_KEY];

    const searchParams = new URLSearchParams({ ...{paid: false, accepted: ["unknown", "yes"]}, ...(saleOrderFilters || {})} ?? {});
    const queryString = searchParams?.toString() || null;

    if (queryString) {
      endPoint += `?${queryString}`;
      queryKey = [SALE_ORDER_LIST_QUERY_KEY, queryString];
    }

    return { endPoint, queryKey };
  }, [saleOrderFilters]);

  const getSaleOrderData = async (endPoint) => {
    try {
      const data = await makeRequest(endPoint, 'GET', getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: () => getSaleOrderData(endPoint),
    select: (saleOrderData) => saleOrderData?.data ?? [],
  });

  return { ...query, saleOrderFilters };
};

export const useGetReturnedSaleOrders = (returnedSaleOrderFilters = null) => {
  const { getToken } = useContext(AuthContext);

  const { endPoint, queryKey } = useMemo(() => {
    let endPoint = BASE_URL + `sale/generic_orders/?is_reverse=true`;
    let queryKey = [RETURNED_SALE_ORDER_LIST_QUERY_KEY];

    const searchParams = new URLSearchParams(returnedSaleOrderFilters ?? {});
    const queryString = searchParams?.toString() || null;

    if (queryString) {
      endPoint += `&${queryString}`;
      queryKey = [RETURNED_SALE_ORDER_LIST_QUERY_KEY, queryString];
    }

    return { endPoint, queryKey };
  }, [returnedSaleOrderFilters]);

  const getReturnedSaleOrderData = async (endPoint) => {
    try {
      const data = await makeRequest(endPoint, 'GET', getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: () => getReturnedSaleOrderData(endPoint),
    select: (saleOrderData) => saleOrderData?.data ?? [],
  });

  return { ...query, returnedSaleOrderFilters };
};

export const useGetRejectedSaleOrders = (rejectedSaleOrderFilters = null) => {
  const { getToken } = useContext(AuthContext);

  const { endPoint, queryKey } = useMemo(() => {
    let endPoint = BASE_URL + `sale/generic_orders/?accepted=no`;
    let queryKey = [REJECTED_SALE_ORDER_LIST_QUERY_KEY];

    const searchParams = new URLSearchParams(rejectedSaleOrderFilters ?? {});
    const queryString = searchParams?.toString() || null;

    if (queryString) {
      endPoint += `&${queryString}`;
      queryKey = [REJECTED_SALE_ORDER_LIST_QUERY_KEY, queryString];
    }

    return { endPoint, queryKey };
  }, [rejectedSaleOrderFilters]);

  const getReturnedSaleOrderData = async (endPoint) => {
    try {
      const data = await makeRequest(endPoint, 'GET', getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };
  const query = useQuery({
    queryKey,
    queryFn: () => getReturnedSaleOrderData(endPoint),
    select: (saleOrderData) => saleOrderData?.data ?? [],
  });
  return { ...query, rejectedSaleOrderFilters };
};

export const useCancelSaleOrder = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const cancelSaleOrder = async ({ id }) => {
    try {
      const endPoint = BASE_URL + `sale/order/${id}/mark_as_cancelled/`;
      const data = await makeRequest(endPoint, 'POST', getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: cancelSaleOrder,
    onSuccess: async () => {
      const queryKeys = [
        SALE_ORDER_LIST_QUERY_KEY,
        TRANSACTION_LIST_QUERY_KEY,
        BALANCE_LIST_QUERY_KEY,
      ];

      await Promise.all(
        queryKeys?.map(async (key) => {
          await queryClient.invalidateQueries({
            queryKey: [key],
            exact: false,
          });
        })
      );
    },
  });

  return mutation;
};

export const useGetSaleOrderTransactions = (saleOrderId = null) => {
  const { getToken } = useContext(AuthContext);
  const endPoint = BASE_URL + `sale/order/${saleOrderId}/transactions/`;

  const getSaleOrderTransactionData = async (saleOrderId) => {
    try {
      if (!saleOrderId) throw new Error(`Invalid Sale Order Id`);
      const data = await makeRequest(endPoint, 'GET', getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const query = useQuery({
    queryKey: [SALE_ORDER_TRANSACTION_LIST_QUERY_KEY, saleOrderId],
    queryFn: () => getSaleOrderTransactionData(saleOrderId),
  });

  return { ...query };
};

export const useMarkSaleOrderAsPaid = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const markSaleOrderAsPaid = async ({ id, formData }) => {
    try {
      const endPoint = BASE_URL + `sale/order/${id}/mark_order_as_paid/`;
      const data = await makeRequest(endPoint, 'POST', getToken(), {});
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: markSaleOrderAsPaid,
    onSuccess: async () => {
      const queryKeys = [
        SALE_ORDER_LIST_QUERY_KEY,
        TRANSACTION_LIST_QUERY_KEY,
        BALANCE_LIST_QUERY_KEY,
      ];

      await Promise.all(
        queryKeys?.map(async (key) => {
          await queryClient.invalidateQueries({
            queryKey: [key],
            exact: false,
          });
        })
      );
    },
  });

  return mutation;
};
export const useMarkReturnSaleOrderAsPaid = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const markSaleOrderAsPaid = async ({ id, formData }) => {
    try {
      const endPoint = BASE_URL + `sale/order/${id}/mark_as_paid/`;
      const data = await makeRequest(endPoint, 'POST', getToken(), {});
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: markSaleOrderAsPaid,
    onSuccess: async () => {
      const queryKeys = [
        RETURNED_SALE_ORDER_LIST_QUERY_KEY,
        SALE_ORDER_LIST_QUERY_KEY,
        TRANSACTION_LIST_QUERY_KEY,
        BALANCE_LIST_QUERY_KEY,
      ];

      await Promise.all(
        queryKeys?.map(async (key) => {
          await queryClient.invalidateQueries({
            queryKey: [key],
            exact: false,
          });
        })
      );
    },
  });

  return mutation;
};

export const useReturnedSaleOrderItemActions = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const returnedSaleOrderItemActions = async ({ requestData }) => {
    const { action_type: requestActionType = null, order_item_id = null } =
      requestData;

    const validActionTypes = ['product_inventory', 'wastage'];

    try {
      if (!validActionTypes?.includes(requestActionType)) {
        throw new Error('Invalid Action Type! ');
      }

      if (!order_item_id) {
        throw new Error('Invalid Order Item Id! ');
      }

      const endPoint = BASE_URL + `sale/order/handle_reversed_order_item/`;
      const data = await makeRequest(endPoint, 'POST', getToken(), requestData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: returnedSaleOrderItemActions,
    onSuccess: async () => {
      const queryKeys = [
        RETURNED_SALE_ORDER_LIST_QUERY_KEY,
        REJECTED_SALE_ORDER_LIST_QUERY_KEY,
      ];

      await Promise?.all(
        queryKeys?.map(async (key) => {
          await queryClient.invalidateQueries({
            queryKey: [key],
            exact: false,
          });
        })
      );
    },
  });

  return mutation;
};

// Not in use
export const useGetAllSaleOrdersStats = (filterParams = '') => {
  const { getToken } = useContext(AuthContext);
  let endPoint = BASE_URL + `/sale/order/get_stats/`;
  let queryKey = ['all_sale_orders_stats'];

  const searchParams = new URLSearchParams(filterParams ?? {});
  const queryString = searchParams?.toString() || null;

  if (queryString) {
    endPoint += `?${queryString}`;
    queryKey = ['all_sale_orders_stats', queryString];
  }
  const query = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const products = await makeRequest(endPoint, 'GET', getToken());
      return products;
    },
  });

  return { ...query };
};

// Not in use
export const useGetSaleOrderStats = (id) => {
  const { getToken } = useContext(AuthContext);
  const endPoint = BASE_URL + `/sale/order/get_stats/?customer=${id}`;

  const query = useQuery({
    queryKey: ['customer_stats', id],
    queryFn: async () => {
      const products = await makeRequest(endPoint, 'GET', getToken());
      return products;
    },
    enabled: !!id,
  });

  return { ...query };
};
