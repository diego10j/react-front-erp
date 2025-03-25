export type MutateOptions = {
  revalidate?: boolean;
  optimisticData?: any;
  rollbackOnError?: boolean;
  populateCache?: boolean;
  fetchOptions?: { signal?: AbortSignal }; // Añadido fetchOptions
};

export type MutateFunction = {
  (): Promise<any>;
  (newParams: Record<string, any>): Promise<any>;
  (newParams: Record<string, any>, options: MutateOptions): Promise<any>;
  (updateFn: (currentData: any) => any, shouldRevalidate?: boolean): Promise<any>;
};

export type ResponseSWR = {
  dataResponse: any;
  isLoading: boolean;
  error: any;
  isValidating: boolean;
  mutate: MutateFunction;
  currentParams: Record<string, any>;
  updateParams: (newParams?: Record<string, any>, options?: MutateOptions) => Promise<any>;
};