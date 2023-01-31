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
  INCOMING_STUDENTS: PATHS.SERVER + '/incoming-students',
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
    INCOMING: SERVER_RESOURCES.SPECIALTIES + '/incoming',
    INCOMING_BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.SPECIALTIES}/incoming/${_id}`;
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
    BY_DOCUMENT: (
      document: 'socialService' | 'optionalMobility' | 'obligatoryMobility'
    ) => {
      return `${SERVER_RESOURCES.TEMPLATES}/${document}`;
    },
  },
  ROTATION_SERVICES: {
    BASE_ENDPOINT: SERVER_RESOURCES.ROTATION_SERVICES,
    INCOMING: SERVER_RESOURCES.ROTATION_SERVICES + '/incoming',
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.ROTATION_SERVICES}/${_id}`;
    },
    INCOMING_BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.ROTATION_SERVICES}/incoming/${_id}`;
    },
  },
  OPTIONAL_MOBILITIES: {
    BASE_ENDPOINT: SERVER_RESOURCES.OPTIONAL_MOBILITIES,
    INTERVAL: SERVER_RESOURCES.OPTIONAL_MOBILITIES + '/interval',
    GENERATE_PRESENTATION_OFFICE_DOCUMENTS:
      SERVER_RESOURCES.OPTIONAL_MOBILITIES + '/generate/presentation_offices',
    GENERATE_SOLICITUDE_DOCUMENTS:
      SERVER_RESOURCES.OPTIONAL_MOBILITIES + '/generate/solicitudes',
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OPTIONAL_MOBILITIES}/${_id}`;
    },
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
    BY_HOSPITAL: SERVER_RESOURCES.OBLIGATORY_MOBILITIES + '/hospital',
    BY_STUDENT: SERVER_RESOURCES.OBLIGATORY_MOBILITIES + '/student',
    INTERVAL: SERVER_RESOURCES.OBLIGATORY_MOBILITIES + '/interval',
    ATTACHMENTS: SERVER_RESOURCES.OBLIGATORY_MOBILITIES + '/attachments',
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OBLIGATORY_MOBILITIES}/${_id}`;
    },
    CANCEL_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OBLIGATORY_MOBILITIES}/cancel/${_id}`;
    },
    UNCANCEL_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OBLIGATORY_MOBILITIES}/uncancel/${_id}`;
    },
    BY_DOCUMENT_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OBLIGATORY_MOBILITIES}/document/${_id}`;
    },
    ATTACHMENTS_BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OBLIGATORY_MOBILITIES}/attachments/${_id}`;
    },
    BY_ATTACHMENTS_DOCUMENT_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OBLIGATORY_MOBILITIES}/attachments/document/${_id}`;
    },
    ATTACHMENTS_GENERATE_BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.OBLIGATORY_MOBILITIES}/attachments/generate/${_id}`;
    },
  },
  INCOMING_STUDENTS: {
    BASE_ENDPOINT: SERVER_RESOURCES.INCOMING_STUDENTS,
    INTERVAL: SERVER_RESOURCES.INCOMING_STUDENTS + '/interval',
    BY_ID: (_id: string) => {
      return `${SERVER_RESOURCES.INCOMING_STUDENTS}/${_id}`;
    },
    BY_DOCUMENT_ID: (_id: string) => {
      return `${SERVER_RESOURCES.INCOMING_STUDENTS}/document/${_id}`;
    },
    CANCEL_ID: (_id: string) => {
      return `${SERVER_RESOURCES.INCOMING_STUDENTS}/cancel/${_id}`;
    },
    UNCANCEL_ID: (_id: string) => {
      return `${SERVER_RESOURCES.INCOMING_STUDENTS}/uncancel/${_id}`;
    },
    VOBO_ID: (_id: string) => {
      return `${SERVER_RESOURCES.INCOMING_STUDENTS}/document/vobo/${_id}`;
    },
  },
};
