export type Query = {
  serviceName: string;
  params: any;
}


export type ResponseSWR = {
  dataResponse: any;
  isLoading: boolean;
  error: any;
  isValidating: boolean;
}
