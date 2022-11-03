import { PATHS } from './paths.constant';

/**
 * Constants of the resources of the server
 */
export const SERVER_RESOURCES = {
  AUTH: PATHS.SERVER + '/auth',
  SOCIAL_SERVICES: PATHS.SERVER + '/social-services',
  HOSPITALS: PATHS.SERVER + '/hospitals',
  SPECIALTIES: PATHS.SERVER + '/specialties',
  USERS: PATHS.SERVER + '/users',
  STUDENTS: PATHS.SERVER + '/students',
};

/**
 * Server endpoints
 */
export const SERVER_ENDPOINTS = {
  AUTH: {
    LOGIN: SERVER_RESOURCES.AUTH + '/log-in',
    LOGGED: SERVER_RESOURCES.AUTH + '/logged',
  },
  USERS: {
    BASE_ENDPOINT: SERVER_RESOURCES.USERS,
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.USERS}/${_id}`;
    },
  },
  SPECIALTIES: {
    BASE_ENDPOINT: SERVER_RESOURCES.SPECIALTIES,
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.SPECIALTIES}/${_id}`;
    },
  },
  STUDENTS: {
    BASE_PATH: SERVER_RESOURCES.STUDENTS,
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.STUDENTS}/${_id}`;
    },
  },
  HOSPITALS: {
    BASE_ENDPOINT: SERVER_RESOURCES.HOSPITALS,
    SOCIAL_SERVICE: SERVER_RESOURCES.HOSPITALS + '/social-service',
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.HOSPITALS}/${_id}`;
    },
  },
  SOCIAL_SERVICES: {
    PERIODS: SERVER_RESOURCES.SOCIAL_SERVICES + '/periods',
    DOCUMENT: SERVER_RESOURCES.SOCIAL_SERVICES + '/document',
    GENERATE: SERVER_RESOURCES.SOCIAL_SERVICES + '/generate',
  },
};
