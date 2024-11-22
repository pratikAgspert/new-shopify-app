import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useContext, useState } from 'react';
import { BASE_URL } from '../services/baseURL';
import { AuthContext } from '../services/context';
import { makeRequest } from '../services/networkRequest';
import { CUSTOMER_LIST_QUERY_KEY } from './ApiHooksQueryKeys';

export const useCreateCustomer = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const createNewCustomer = async (formData) => {
    try {
      const endPoint = BASE_URL + `api/enterprise_customer_link/`;
      const data = await makeRequest(endPoint, 'POST', getToken(), formData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: createNewCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [CUSTOMER_LIST_QUERY_KEY],
      });
    },
  });

  return mutation;
};

export const useGetCustomers = () => {
  const { getToken } = useContext(AuthContext);

  const endPoint = BASE_URL + `api/enterprise_customer_link/`;

  const [selectedCustomerCategory, setSelectedCustomerCategory] =
    useState(null);

  const filteredCustomers = useCallback(
    (customerData) => {
      const categoryId = parseInt(selectedCustomerCategory?.id ?? null) || null;
      if (!categoryId) return customerData;

      return (
        customerData?.filter(
          (customer) => parseInt(customer?.category) === categoryId
        ) ?? []
      );
    },
    [selectedCustomerCategory]
  );

  const query = useQuery({
    queryKey: [CUSTOMER_LIST_QUERY_KEY],
    queryFn: async () => {
      const userCategories = await makeRequest(endPoint, 'GET', getToken());
      return userCategories;
    },
    select: filteredCustomers,
  });

  return {
    ...query,
    selectedCustomerCategory,
    setSelectedCustomerCategory,
  };
};
