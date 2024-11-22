import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { BASE_URL } from '../services/baseURL';
import { AuthContext } from '../services/context';
import { makeRequest } from '../services/networkRequest';
import {
  GEOFENCE_LIST_QUERY_KEY,
  LOCATION_LIST_QUERY_KEY,
} from './ApiHooksQueryKeys';

export const useGetLocations = () => {
  const { getToken } = useContext(AuthContext);

  const endPoint = BASE_URL + 'kvk/all_locations/';

  const query = useQuery({
    queryKey: [LOCATION_LIST_QUERY_KEY],
    queryFn: async () => {
      const locations = await makeRequest(endPoint, 'POST', getToken(), {});
      return locations;
    },
  });

  return {
    ...query,
  };
};

export const useGetGeofences = () => {
  const { getToken } = useContext(AuthContext);

  const endPoint = BASE_URL + 'kvk/locations_based_on_geofences/';

  const query = useQuery({
    queryKey: [GEOFENCE_LIST_QUERY_KEY],
    queryFn: async () => {
      const locations = await makeRequest(endPoint, 'POST', getToken(), {});
      return locations;
    },
  });

  return {
    ...query,
  };
};
