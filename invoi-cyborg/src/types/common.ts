export type IMeta = {
  page: number;
  total: number;
  limit: number;
};

export interface DrawerItem {
  title: string;
  path: string;
  parentPath?: string;
  child?: DrawerItem[];
}

export type ResponseSuccessType = {
  data: any;
  meta?: IMeta;
};

export type IGenericErrorMessage = {
  statusCode: number;
  message: string;
  errorMessages: string;
};
