
export type MutateFunction = {
  (): Promise<any>;
  (newParams: Record<string, any>): Promise<any>;
  (newParams: Record<string, any>, options: any): Promise<any>;
};


export type ResponseSWR = {
  dataResponse: any;
  isLoading: boolean;
  error: any;
  isValidating: boolean;
  mutate: MutateFunction;
  currentParams: Record<string, any>;
  updateParams: (newParams?: Record<string, any>, shouldRevalidate?: boolean) => Promise<any>;
};