/**
 * Resources paths
 */
export const RESOURCE_PATHS = {
  AUTH: 'auth',
  OTHERS: 'otros',
  SOCIAL_SERVICES: 'servicios-sociales',
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
  },
  SOCIAL_SERVICES: {
    BASE_PATH: RESOURCE_PATHS.SOCIAL_SERVICES,
    BASE: '',
    ADD: 'agregar',
    STUDENT: ':_id',
    DOCUMENTS: 'generar-documentos',
  },
};
