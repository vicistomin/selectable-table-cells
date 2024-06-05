import { Cat, PageQueryParams } from '@/types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

export const getCatsPage = (params: PageQueryParams): Promise<Cat[]> =>
  axios
    .get<Cat[]>(`${API_URL}/images/search`, {
      params: {
        // get links to small images
        size: 'small',
        // only return cats with breed data
        has_breeds: true,
        // filter by mime type
        mime_types: 'image/jpeg',
        ...params,
      },
      // Basic auth for public API to get additional features
      headers: { 'x-api-key': API_KEY },
    })
    .then((r) => r?.data ?? [])
    .catch((err) => {
      console.error('Axios error: ', err);
      return [];
    });
