import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../services/networkRequest';
import { BASE_URL } from '../services/baseURL';
import { AuthContext } from '../services/context';
import { useContext } from 'react';
import { FARMER_LIST_QUERY_KEY } from './ApiHooksQueryKeys';

const useFarmers = () => {
  const { getToken } = useContext(AuthContext);

  const query = useQuery({
    queryKey: [FARMER_LIST_QUERY_KEY],
    queryFn: async () => {
      const data = await makeRequest(
        BASE_URL + 'kvk/all_farmers/',
        'POST',
        getToken(),
        {}
      );

      return [...(data?.status === 'true' && data?.farmers)];
    },
  });

  return {
    ...query,
    farmersData: query.data,
    isLoadingFarmers: query.isPending,
    farmerError: query.isError,
  };
};

export default useFarmers;
