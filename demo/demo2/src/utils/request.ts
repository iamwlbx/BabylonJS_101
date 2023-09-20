import axios from "axios";

const service = axios.create({
  baseURL: 'http://testapi.xuexiluxian.cn'
});

service.interceptors.request.use(config => {
  return config;
}), (error: any) => {
  Promise.reject(error);
};
interface abc<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}
service.interceptors.response.use(response: abc => {
  return response.data;
}), (error: any) => {
  return Promise.reject(error);
};

export default service;
