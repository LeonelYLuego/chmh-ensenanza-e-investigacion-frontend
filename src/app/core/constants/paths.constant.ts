/**
 * Resources paths
 */
export const RESOURCE_PATHS = {
  AUTH: 'auth',
  OTHERS: 'otros',
  SOCIAL_SERVICES: 'servicios-sociales',
  OPTIONAL_MOBILITIES: 'movilidades-optativas',
  OBLIGATORY_MOBILITIES: 'movilidades-obligatorias',
  INCOMING_STUDENTS: 'rotantes',
  ERROR: 'error',
};

/**
 * Paths for routing
 */
export const PATHS = {
  SERVER: 'http://localhost:3000/api',
  ROOT: '/',
  ERROR: {
    BASE_PATH: RESOURCE_PATHS.ERROR,
    PAGE_NOT_FOUND: '404',
  },
  AUTH: {
    BASE_PATH: RESOURCE_PATHS.AUTH,
    LOG_IN: 'iniciar-sesion',
  },
  OTHERS: {
    BASE_PATH: RESOURCE_PATHS.OTHERS,
    BASE: '',
    USERS: 'usuarios',
    SPECIALTIES: 'especialidades',
    STUDENTS: 'alumnos',
    HOSPITALS: 'hospitales',
    TEMPLATES: 'plantillas',
    ROTATION_SERVICES: 'servicios-a-rotar',
    INCOMING_SPECIALTIES: 'especialidades-externas',
    INCOMING_ROTATION_SERVICES: 'servicios-a-rotar-externos',
  },
  SOCIAL_SERVICES: {
    BASE_PATH: RESOURCE_PATHS.SOCIAL_SERVICES,
    BASE: '',
    ADD: 'agregar',
    STUDENT: ':_id',
    DOCUMENTS: 'generar-documentos',
  },
  OPTIONAL_MOBILITIES: {
    BASE_PATH: RESOURCE_PATHS.OPTIONAL_MOBILITIES,
    BASE: '',
    ADD: 'agregar',
    STUDENT: ':_id',
  },
  OBLIGATORY_MOBILITIES: {
    BASE_PATH: RESOURCE_PATHS.OBLIGATORY_MOBILITIES,
    BASE: '',
    ADD: 'agregar',
  },
  INCOMING_STUDENTS: {
    BASE_PATH: RESOURCE_PATHS.INCOMING_STUDENTS,
    BASE: '',
    ADD: 'agregar',
    UPDATE: 'editar',
    STUDENT: ':_id',
  },
};
