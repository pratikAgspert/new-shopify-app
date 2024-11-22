import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../services/networkRequest';
import { BASE_URL } from '../services/baseURL';
import { AuthContext } from '../services/context';
import { useContext } from 'react';
import { VENDOR_LIST_QUERY_KEY } from './ApiHooksQueryKeys';

export const useGetVendors = () => {
  const { getToken } = useContext(AuthContext);

  const endPoint = BASE_URL + `api/vendor/`;

  const query = useQuery({
    queryKey: [VENDOR_LIST_QUERY_KEY],
    queryFn: async () => {
      const vendorsData = await makeRequest(endPoint, 'GET', getToken());
      return vendorsData;
    },
  });

  return {
    ...query,
  };
};
