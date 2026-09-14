import axiosInstance from './axiosInstance';

export const fetchProducts = async () => {
  const response = await axiosInstance.get('/products/');
  return response.data;
};