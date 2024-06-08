import { IGenericErrorMessage, ResponseSuccessType } from "@/types";
import axios from "axios";

const instance = axios.create();

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;
export { instance };

instance.interceptors.request.use(
  function (config) {
    // const accessToken = getFromLocalStorage(authKey);
    // if (accessToken) {
    //   config.headers.Authorization = accessToken;
    // }
    // setAccessToken(authKey);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  //@ts-ignore
  function (response) {
    const responseObject: ResponseSuccessType = {
      data: response?.data?.data,
      meta: response?.data?.meta,
    };
    return responseObject;
  },
  function (error) {
    const responseObject: IGenericErrorMessage = {
      statusCode: error?.response?.data?.statusCode || 500,
      message: error?.response?.data?.message || "Wrong",
      errorMessages: error?.response?.data?.message,
    };

    return responseObject;
  }
);
