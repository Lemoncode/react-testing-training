import Axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';

const url = '/api/hotels';

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
  const { data } = await Axios.get<HotelEntityApi[]>(url);
  // await new Promise((res) => { setTimeout(() => { res(undefined) }, 4000)});

  return data;
};
