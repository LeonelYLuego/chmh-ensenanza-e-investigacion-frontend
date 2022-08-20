import { PATHS } from './paths.constant';

/**
 * Constants of the resources of the server
 */
export const SERVER_RESOURCES = {
  AUTH: '/auth',
};

/**
 * Server endpoints
 */
export const SERVER_ENDPOINTS = {
  AUTH: {
    LOGIN: PATHS.SERVER + SERVER_RESOURCES.AUTH + '/log-in',
    LOGGED: PATHS.SERVER + SERVER_RESOURCES.AUTH + '/logged',
  },
  USERS: PATHS.SERVER + '/users',
  SPECIALTIES: PATHS.SERVER + '/specialties',
  STUDENTS: PATHS.SERVER + '/students',
  HOSPITALS: PATHS.SERVER + '/hospitals'
};
