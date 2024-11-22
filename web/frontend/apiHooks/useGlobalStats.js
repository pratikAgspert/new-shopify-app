import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { BASE_URL } from '../services/baseURL';
import { AuthContext } from '../services/context';
import { makeRequest } from '../services/networkRequest';

export const usePosStats = (filterParams = '') => {
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `sale/generic_orders/b2c_stats/`;

  if (filterParams) {
    endPoint += `?${filterParams}`;
  }

  const query = useQuery({
    queryKey: ['b2c_stats', filterParams],
    queryFn: async () => {
      const stats = await makeRequest(endPoint, 'GET', getToken());
      return stats;
    },
  });

  return { ...query };
};

export const useSalesStats = (filterParams = '') => {
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `sale/generic_orders/b2b_stats/`;

  if (filterParams) {
    endPoint += `?${filterParams}`;
  }

  const query = useQuery({
    queryKey: ['b2b_stats', filterParams],
    queryFn: async () => {
      const stats = await makeRequest(endPoint, 'GET', getToken());
      return stats;
    },
  });

  return { ...query };
};
