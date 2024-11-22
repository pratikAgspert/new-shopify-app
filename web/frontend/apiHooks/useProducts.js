import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useCallback, useContext, useMemo, useState } from 'react';
import { BASE_URL } from '../services/baseURL';
import { AuthContext } from '../services/context';
import { makeRequest } from '../services/networkRequest';
import {
  PRODUCT_INVENTORY_QUERY_KEY,
  PRODUCT_LIST_QUERY_KEY,
  PRODUCT_HSN_CODE_LIST_QUERY_KEY,
  PRODUCT_SAC_CODE_LIST_QUERY_KEY,
} from './ApiHooksQueryKeys';

export const useProducts = () => {
  const { getToken, getShop } = useContext(AuthContext);

  const getProducts = async () => {
    const endPoint = BASE_URL + `/kvk/product/shopify/?shop=${getShop()}`;

    try {
      const productList = await makeRequest(endPoint, 'GET', getToken());
      return productList;
    } catch (error) {
      throw error;
    }
  };

  const query = useQuery({
    queryKey: [PRODUCT_LIST_QUERY_KEY],
    queryFn: getProducts,
    select: (productData) => productData?.data ?? [],
  });

  const categories = useMemo(() => {
    const filteredCategories = [
      ...new Set(
        query?.data
          ?.flatMap((item) => item?.category)
          .filter((category) => category)
      ),
    ];

    return filteredCategories;
  }, [query]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const filterProductsList = useCallback(
    (products) => {
      if (!selectedCategory) return products;

      return products?.filter(
        (product) => product.category === selectedCategory
      );
    },
    [selectedCategory]
  );

  return {
    ...query,
    categories,
    productList: filterProductsList(query?.data),
    selectedCategory,
    setSelectedCategory,
  };
};

export const useAddProduct = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const newProduct = async (formData) => {
    const endPoint = BASE_URL + 'kvk/product/';
    try {
      const data = await makeRequest(endPoint, 'POST', getToken(), formData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: newProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PRODUCT_LIST_QUERY_KEY],
      });
    },
  });

  return mutation;
};

export const useEditProduct = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const editProduct = async ({ id, formData }) => {
    const endPoint = BASE_URL + `kvk/product/${id}/`;
    try {
      const data = await makeRequest(endPoint, 'PUT', getToken(), formData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: editProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PRODUCT_LIST_QUERY_KEY],
      });
    },
  });

  return mutation;
};

export const useDeleteProduct = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const deleteProduct = async (id) => {
    const endPoint = BASE_URL + `kvk/product/${id}/`;

    try {
      const data = await makeRequest(endPoint, 'DELETE', getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PRODUCT_LIST_QUERY_KEY],
      });
    },
  });

  return {
    ...mutation,
    deleteProduct: mutation.mutate,
    deletingProducts: mutation.isPending,
    deletingProductError: mutation.isError,
    productDeletionSuccess: mutation.isSuccess,
  };
};

export const useDeleteSKU = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const deleteProductSKU = async (id) => {
    const endPoint = BASE_URL + `kvk/sku/${id}/`;

    try {
      const data = await makeRequest(endPoint, 'DELETE', getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: deleteProductSKU,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PRODUCT_LIST_QUERY_KEY],
      });
    },
  });

  return {
    ...mutation,
    deleteProduct: mutation.mutate,
    deletingProducts: mutation.isPending,
    deletingProductError: mutation.isError,
    productDeletionSuccess: mutation.isSuccess,
  };
};

export const useProductInventory = () => {
  const { getToken } = useContext(AuthContext);

  let endPoint = BASE_URL + `inventory/product_inventory/`;
  let queryKey = [PRODUCT_INVENTORY_QUERY_KEY];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const productInventory = await makeRequest(endPoint, 'GET', getToken());
      return productInventory;
    },
  });

  return {
    ...query,
  };
};

export const useProductCSVFileUpload = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const uploadProductCSVFile = async (formData) => {
    const endPoint = BASE_URL + `kvk/product/upload_csv/`;

    try {
      const data = await fetch(endPoint, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: getToken(),
        },
      });

      if (!data?.ok) {
        const error = await data?.json();

        const message =
          error?.message ??
          error?.detail ??
          'Something went wrong while uploading the CSV File';

        throw new Error(`${message} (Status ${data?.status})`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: uploadProductCSVFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PRODUCT_LIST_QUERY_KEY],
      });
    },
  });

  return mutation;
};

export const useProductInventoryCSVFileUpload = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const uploadProductInventoryCSVFile = async (formData) => {
    const endPoint = BASE_URL + `inventory/product_inventory/upload_csv/`;

    try {
      const data = await fetch(endPoint, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: getToken(),
        },
      });

      if (!data?.ok) {
        const error = await data?.json();

        const message =
          error?.message ??
          error?.detail ??
          'Something went wrong while uploading the CSV Template';

        throw new Error(`${message} (Status ${data?.status})`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: uploadProductInventoryCSVFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PRODUCT_INVENTORY_QUERY_KEY],
      });

      await queryClient.invalidateQueries({
        queryKey: [PRODUCT_LIST_QUERY_KEY],
      });
    },
  });

  return mutation;
};

export const useProductInventoryCSVFileDownload = () => {
  const { getToken } = useContext(AuthContext);

  const getProductInventoryCSVTemplate = async () => {
    try {
      const endPoint = BASE_URL + `kvk/product/get_csv/`;

      const response = await fetch(endPoint, {
        method: 'GET',
        headers: {
          Authorization: getToken(),
        },
      });

      if (!response?.ok) {
        const error = await response?.json();

        const message =
          error?.message ??
          error?.detail ??
          'Something went wrong while downloading the CSV Template';

        throw new Error(`${message} (Status ${response?.status})`);
      }

      const blob = await response?.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Product_Template.csv`;
      link.click();
    } catch (error) {
      throw error;
    }
  };
  const mutation = useMutation({
    mutationFn: getProductInventoryCSVTemplate,
  });

  return mutation;
};

export const useProductHSNAndSACCodes = (
  searchQuery = null,
  codeType = null,
  pageNumber = null
) => {
  const { getToken } = useContext(AuthContext);

  const { endPoint, queryKey } = useMemo(() => {
    const validCodeTypes = ['HSN', 'SAC'];
    const targetCodeType = validCodeTypes?.includes(codeType)
      ? codeType
      : validCodeTypes?.[0];

    const isHSNCodeType = targetCodeType === 'HSN';
    const routeParameterCodeType = targetCodeType?.toLowerCase();

    let endPoint = BASE_URL + `billing/gst/${routeParameterCodeType}/`;

    const CODE_SPECIFIC_QUERY_KEY = isHSNCodeType
      ? PRODUCT_HSN_CODE_LIST_QUERY_KEY
      : PRODUCT_SAC_CODE_LIST_QUERY_KEY;

    let queryKey = [CODE_SPECIFIC_QUERY_KEY];

    if (searchQuery?.trim()?.length) {
      endPoint += `?query=${searchQuery}`;
      queryKey = [CODE_SPECIFIC_QUERY_KEY, searchQuery];
    }

    if (pageNumber >= 1) {
      const prefix = endPoint?.includes(`?`) ? '&' : '?';
      endPoint += `${prefix}page=${pageNumber}`;
      queryKey = [CODE_SPECIFIC_QUERY_KEY, searchQuery, pageNumber];
    }

    return { endPoint, queryKey };
  }, [searchQuery, codeType, pageNumber]);

  const getCodeSpecificData = async (endPoint) => {
    try {
      const data = await makeRequest(endPoint, 'GET', getToken());
      return data;
    } catch (error) {
      throw error;
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: () => getCodeSpecificData(endPoint),
  });

  return { ...query };
};

export const useProductCSVFileDownload = () => {
  const { getToken } = useContext(AuthContext);

  const getProductCSVTemplate = async () => {
    try {
      const endPoint = BASE_URL + `kvk/product/get_product_csv/`;

      const response = await fetch(endPoint, {
        method: 'GET',
        headers: {
          Authorization: getToken(),
        },
      });

      if (!response?.ok) {
        const error = await response?.json();

        const message =
          error?.message ??
          error?.detail ??
          'Something went wrong while downloading the CSV Template';

        throw new Error(`${message} (Status ${response?.status})`);
      }

      const blob = await response?.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Product_Template.csv`;
      link.click();
    } catch (error) {
      throw error;
    }
  };
  const mutation = useMutation({
    mutationFn: getProductCSVTemplate,
  });

  return mutation;
};

export const useAddItemsToProductInventory = () => {
  const { getToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const addItemsToProductInventory = async (requestData) => {
    const endPoint = BASE_URL + `inventory/product_inventory/`;

    try {
      const data = await makeRequest(endPoint, 'POST', getToken(), requestData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: addItemsToProductInventory,
    onSuccess: async () => {
      const queryKeys = [PRODUCT_LIST_QUERY_KEY, PRODUCT_INVENTORY_QUERY_KEY];

      await Promise.all(
        queryKeys?.map(async (key) => {
          await queryClient.invalidateQueries({
            queryKey: [key],
          });
        })
      );
    },
  });

  return mutation;
};

export const useGetAllProductsStats = (filterParams = '') => {
  const { getToken } = useContext(AuthContext);
  let endPoint = BASE_URL + `/kvk/product/generic_stats/`;
  let queryKey = ['all_product_stats']
  

  const searchParams = new URLSearchParams(filterParams ?? {})
  const queryString = searchParams?.toString() || null

  if(queryString){
    endPoint += `?${queryString}`
    queryKey =  ['all_product_stats', queryString]
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

export const useGetProductStats = (id) => {
  const { getToken } = useContext(AuthContext);
  const endPoint = BASE_URL + `/kvk/product/analytics/?product=${id}`;

  const query = useQuery({
    queryKey: ['product_stats', id],
    queryFn: async () => {
      const products = await makeRequest(endPoint, 'GET', getToken());
      return products;
    },
    enabled: !!id
  });

  return { ...query };
};
