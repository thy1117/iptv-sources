import { default_m3u_filter, type TSources } from './utils';

export const hotel_tvn_sources: TSources = [
  {
    name: 'whyun-pages/hotel-tvn',
    f_name: 'hotel_tvn',
    url: 'https://hotel-tvn.pages.dev/lives.m3u',
    filter: default_m3u_filter,
  },
];
