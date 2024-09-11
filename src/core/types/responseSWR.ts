// import { ResultQuery } from './resultQuery';
export type ResponseSWR = {
  dataResponse: any; //antes any ResultQuery
  isLoading: boolean;
  error: any;
  isValidating: boolean;
  mutate?: any;
}
