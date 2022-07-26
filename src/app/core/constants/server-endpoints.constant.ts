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
  TEMPLATES: PATHS.SERVER + '/templates',
  ROTATION_SERVICES: PATHS.SERVER + '/rotation-services',
  OPTIONAL_MOBILITIES: PATHS.SERVER + '/optional-mobilities',
  OBLIGATORY_MOBILITIES: PATHS.SERVER + '/obligatory-mobilities',
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
    BASE_ENDPOINT: SERVER_RESOURCES.SOCIAL_SERVICES,
    PERIODS: SERVER_RESOURCES.SOCIAL_SERVICES + '/periods',
    GENERATE: SERVER_RESOURCES.SOCIAL_SERVICES + '/generate',
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.SOCIAL_SERVICES}/${_id}`;
    },
    BY_DOCUMENT_ID: (_id: string) => {
      return `${SERVER_RESOURCES.SOCIAL_SERVICES}/document/${_id}`;
    },
  },
  TEMPLATES: {
    BASE_ENDPOINT: SERVER_RESOURCES.TEMPLATES,
    BY_DOCUMENT: (document: 'socialService') => {
      return `${SERVER_RESOURCES.TEMPLATES}/${document}`;
    },
  },
  ROTATION_SERVICES: {
    BASE_ENDPOINT: SERVER_RESOURCES.ROTATION_SERVICES,
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.ROTATION_SERVICES}/${_id}`;
    },
  },
  OPTIONAL_MOBILITIES: {
    BASE_ENDPOINT: SERVER_RESOURCES.OPTIONAL_MOBILITIES,
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OPTIONAL_MOBILITIES}/${_id}`;
    },
    INTERVAL: SERVER_RESOURCES.OPTIONAL_MOBILITIES + '/interval',
    BY_DOCUMENT_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OPTIONAL_MOBILITIES}/document/${_id}`;
    },
    CANCEL_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OPTIONAL_MOBILITIES}/cancel/${_id}`;
    },
    UNCANCEL_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OPTIONAL_MOBILITIES}/uncancel/${_id}`;
    },
  },
  OBLIGATORY_MOBILITIES: {
    BASE_ENDPOINT: SERVER_RESOURCES.OBLIGATORY_MOBILITIES,
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OBLIGATORY_MOBILITIES}/${_id}`;
    },
    INTERVAL: SERVER_RESOURCES.OBLIGATORY_MOBILITIES + '/interval',
  },
};
