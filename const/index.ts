const PageSize = {
  DEFAULT: 10,
  MAX_PAGE_SIZE: 25,
};

const Order = {
  DEFAULT: 'RANDOM',
  OPTIONS: ['ASC', 'DESC', 'RANDOM'] as const,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { Order, PageSize };
