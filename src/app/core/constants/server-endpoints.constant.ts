import { PATHS } from './paths.constant';

/**
 * Constants of the resources of the server
 */
export const SERVER_RESOURCES = {
  AUTH: PATHS.SERVER + '/auth',
  SOCIAL_SERVICES: PATHS.SERVER + '/social-services',
  HOSPITALS: PATHS.SERVER + '/hospitals',
  SPECIALTIES: PATHS.SERVER + '/specialties',
};

/**
 * Server endpoints
 */
export const SERVER_ENDPOINTS = {
  AUTH: {
    LOGIN: SERVER_RESOURCES.AUTH + '/log-in',
    LOGGED: SERVER_RESOURCES.AUTH + '/logged',
  },
  USERS: PATHS.SERVER + '/users',
  SPECIALTIES: {
    DURATION: SERVER_RESOURCES.SPECIALTIES + '/duration'
  },
  STUDENTS: PATHS.SERVER + '/students',
  HOSPITALS: {
    SOCIAL_SERVICE: SERVER_RESOURCES.HOSPITALS + '/social-service',
  },
  SOCIAL_SERVICES: {
    PERIODS: SERVER_RESOURCES.SOCIAL_SERVICES + '/periods',
    DOCUMENT: SERVER_RESOURCES.SOCIAL_SERVICES + '/document',
  },
};
