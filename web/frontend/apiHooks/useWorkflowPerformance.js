import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../services/networkRequest';
import { BASE_URL } from '../services/baseURL';
import { AuthContext } from '../services/context';
import { useContext } from 'react';
import { buildUrlWithQueryParams as buildUrl } from '../utils/buildUrlWithQueryParams';
import { WORKFLOW_PERFORMANCE_QUERY_KEY } from './ApiHooksQueryKeys';

export const useWorkflowPerformance = (workflowId, days = 7) => {
  const { getToken } = useContext(AuthContext);

  const baseURL = BASE_URL + `scm/insight/workflow_performance/`;

  const urlWithQueryParams = buildUrl(baseURL, {
    workflow: workflowId,
    days,
  });

  const query = useQuery({
    queryKey: [WORKFLOW_PERFORMANCE_QUERY_KEY, workflowId, days],

    queryFn: async () => {
      const workflowPerformance = await makeRequest(
        urlWithQueryParams,
        'GET',
        getToken()
      );

      return workflowPerformance;
    },
  });

  return {
    ...query,
    workflowPerformanceData: query.data,
    workflowPerformanceDataIsLoading: query.isPending,
    workflowPerformanceError: query.isError,
  };
};

export default useWorkflowPerformance;
