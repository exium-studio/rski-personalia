import { useEffect, useState, useRef } from "react";
import req from "../lib/req";
import useRenderTrigger from "./useRenderTrigger";

interface Props<T> {
  initialData?: T;
  url?: string;
  payload?: any;
  limit?: number;
  dependencies?: any[];
  conditions?: boolean;
  page?: number;
  noRt?: boolean;
}

const useDataState = <T>({
  initialData,
  payload,
  url,
  limit,
  dependencies = [],
  conditions = true,
  page = 1,
  noRt = false,
}: Props<T>) => {
  const [error, setError] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>(initialData);
  const [paginationData, setPaginationData] = useState<T | undefined>(
    initialData
  );
  // const [offset, setOffset] = useState<number>((page - 1) * (limit || 0));
  const { rt } = useRenderTrigger();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setError(false);
    setLoading(true);
    if (conditions && url) {
      makeRequest();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditions, url, page, ...(noRt ? [] : [rt]), ...dependencies]);

  const makeRequest = () => {
    // console.log(abortControllerRef.current);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const method = payload ? "POST" : "GET";
    const data = {
      ...payload,
      limit: limit,
      // offset: offset,
    };

    req({
      method,
      url,
      data: method === "POST" ? data : undefined,
      // params: method === "GET" ? data : undefined,
      signal: abortController.signal,
    })
      .then((response) => {
        setLoading(false);
        setError(false);
        if (response.status === 200) {
          setData(response.data.data);
          setPaginationData(response.data?.pagination);
        }
      })
      .catch((error) => {
        if (error.name === "CanceledError") {
          return;
        } else {
          setLoading(false);

          if (error?.response?.status === 404) {
            setNotFound(true);
          }
          setError(true);
          console.log(error);
        }
      });
  };

  function retry() {
    setError(false);
    setLoading(true);
    makeRequest();
  }

  function loadMore() {
    setLoadingLoadMore(true);
    // if (limit) {
    //   setOffset((ps) => ps + limit);
    // }

    //TODO http request dan append ke data
  }

  return {
    data,
    setData,
    loading,
    setLoading,
    notFound,
    setNotFound,
    error,
    setError,
    retry,
    loadMore,
    loadingLoadMore,
    setLoadingLoadMore,
    paginationData,
  };
};

export default useDataState;
