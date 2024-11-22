import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../services/networkRequest';
import { BASE_URL } from '../services/baseURL';
import { AuthContext } from '../services/context';
import { useContext } from 'react';
import { WORKFLOW_LIST_QUERY_KEY } from './ApiHooksQueryKeys';

export const useWorkflows = () => {
  const { getToken } = useContext(AuthContext);

  const query = useQuery({
    queryKey: [WORKFLOW_LIST_QUERY_KEY],
    queryFn: async () => {
      const workflows = await makeRequest(
        BASE_URL + 'scm/workflow',
        'GET',
        getToken()
      );
      return workflows;
    },
  });

  return {
    ...query,
    workflows: query.data,
    isWorkflowsSuccess: query.isSuccess,
    isWorkflowsLoading: query.isPending,
    isWorkflowsError: query.isError,
  };
};

export const useCreateWorkflow = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  /*
      NOTE: Data Format
      data: {
        name: "string",
          dag: {
          nodes: [Node]
          edges: [Edge]
          }
      }
      */

  const mutation = useMutation({
    mutationFn: async ({ data }) => {
      const base_url = BASE_URL + 'scm/workflow/';
      return makeRequest(base_url, 'POST', getToken(), data);
    },
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [WORKFLOW_LIST_QUERY_KEY],
      });
    },
  });

  return {
    ...mutation,
    createWorkflow: mutation.mutate,
    isCreatingWorkflow: mutation.isPending,
    isCreatingWorkflowError: mutation.isError,
  };
};

export const useDeleteWorkflow = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id }) => {
      return await makeRequest(
        `${BASE_URL}/scm/workflow/${id}`,
        'DELETE',
        getToken()
      );
    },
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries([WORKFLOW_LIST_QUERY_KEY]);
      variables.closeModal();
    },
  });

  return {
    ...mutation,
    deleteWorkflow: mutation.mutate,
    isDeleteWorkflowLoading: mutation.isPending,
    isDeleteWorkflowError: mutation.isError,
  };
};

export const useUpdateWorkflow = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ data, id, requestType = 'PUT' }) => {
      const base_url = BASE_URL + 'scm/workflow/' + id + '/';
      return makeRequest(base_url, requestType, getToken(), data);
    },
    onSuccess: async (data, payload) => {
      console.log('UPDATE WORKFLOW: ', data, '::', payload);

      await queryClient.invalidateQueries({
        queryKey: [WORKFLOW_LIST_QUERY_KEY],
      });
    },
  });

  return {
    ...mutation,
    updateWorkflow: mutation.mutate,
    isUpdatingWorkflow: mutation.isPending,
    isUpdatingWorkflowError: mutation.isError,
  };
};
