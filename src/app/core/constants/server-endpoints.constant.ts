import { PATHS } from './paths.constant';

export const SERVER_RESOURCES = {
  AUTH: '/auth',
};

export const SERVER_ENDPOINTS = {
  AUTH: {
    LOGIN: PATHS.SERVER + SERVER_RESOURCES.AUTH + '/log-in',
    LOGGED: PATHS.SERVER + SERVER_RESOURCES.AUTH + '/logged',
  },
  USERS: PATHS.SERVER + '/users',
};
