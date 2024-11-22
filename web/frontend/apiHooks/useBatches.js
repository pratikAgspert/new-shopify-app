import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../services/context';
import { makeRequest } from '../services/networkRequest';
import { BASE_URL } from '../services/baseURL';
import {
  BATCH_LIST_QUERY_KEY,
  BATCH_DETAILS_QUERY_KEY,
  BATCH_FLOW_QUERY_KEY,
} from './ApiHooksQueryKeys';

const useNewBatch = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const createNewBatch = async (formData) => {
    try {
      const data = await makeRequest(
        BASE_URL + 'scm/batch/',
        'post',
        getToken(),
        formData
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: createNewBatch,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [BATCH_LIST_QUERY_KEY],
      });
    },
  });

  return mutation;
};

const useGetBatch = (is_complete = false) => {
  const { getToken } = useContext(AuthContext);

  const [selectedWorkflow, setSelectedWorkflow] = useState({
    id: null,
    selectedStates: [],
  });

  const filterBatchData = useCallback(
    (batchData) => {
      const { id, selectedStates } = selectedWorkflow;
      if (!id) return batchData;

      const filteredBatches = batchData.filter(
        ({ workflow, state: batchState }) => {
          const batchWorkflowId = workflow?.id;
          if (!selectedStates.length) return batchWorkflowId === id;
          return batchWorkflowId === id && selectedStates.includes(batchState);
        }
      );
      return filteredBatches;
    },

    [selectedWorkflow]
  );

  const endPoint =
    BASE_URL + `scm/batch/?is_complete=${(is_complete && true) || false}`;

  const query = useQuery({
    queryKey: [BATCH_LIST_QUERY_KEY],
    queryFn: async () => {
      const batchList = await makeRequest(endPoint, 'GET', getToken());
      return batchList;
    },
    select: filterBatchData,
  });

  return {
    ...query,
    batchData: query.data,
    isLoadingBatches: query.isPending,
    batchError: query.isError,
    setSelectedWorkflow,
    selectedWorkflow,
  };
};

const useCompletedBatches = () => {
  const { getToken } = useContext(AuthContext);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const filterBatchData = useCallback(
    (batchData) => {
      const selectedProductId = parseInt(selectedProduct) || null;
      if (!selectedProductId) return batchData;

      return (
        batchData?.filter((batch) => batch?.product === selectedProductId) ?? []
      );
    },
    [selectedProduct]
  );

  const endPoint = BASE_URL + `scm/batch/?is_complete=true&active=false`;
  const query = useQuery({
    queryKey: [BATCH_LIST_QUERY_KEY, 'is_complete'],
    queryFn: async () => {
      const batchList = await makeRequest(endPoint, 'GET', getToken());
      return batchList;
    },
    select: filterBatchData,
  });

  return {
    ...query,
    selectedProduct,
    setSelectedProduct,
  };
};

const useMoveBatch = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const moveBatch = async ({ id, formData }) => {
    try {
      const data = await makeRequest(
        `${BASE_URL}scm/batch/${id}/?action=move`,
        'PATCH',
        getToken(),
        formData
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: moveBatch,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: [BATCH_LIST_QUERY_KEY],
      });

      const selectedBatchId = data?.id ?? null;
      selectedBatchId &&
        (await queryClient.invalidateQueries({
          queryKey: [BATCH_DETAILS_QUERY_KEY, selectedBatchId],
        }));

      selectedBatchId &&
        (await queryClient?.invalidateQueries({
          queryKey: [BATCH_FLOW_QUERY_KEY, selectedBatchId],
        }));
    },
  });

  return mutation;
};

const useUpdateBatch = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const updateBatch = async ({ id, formData }) => {
    try {
      const data = await makeRequest(
        `${BASE_URL}scm/batch/${id}/`,
        'PUT',
        getToken(),
        formData
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: updateBatch,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: [BATCH_LIST_QUERY_KEY],
      });

      const selectedBatchId = data?.id ?? null;

      selectedBatchId &&
        (await queryClient.invalidateQueries({
          queryKey: [BATCH_DETAILS_QUERY_KEY, selectedBatchId],
        }));

      selectedBatchId &&
        (await queryClient?.invalidateQueries({
          queryKey: [BATCH_FLOW_QUERY_KEY, selectedBatchId],
        }));
    },
  });

  return mutation;
};

export {
  useNewBatch,
  useGetBatch,
  useUpdateBatch,
  useCompletedBatches,
  useMoveBatch,
};
