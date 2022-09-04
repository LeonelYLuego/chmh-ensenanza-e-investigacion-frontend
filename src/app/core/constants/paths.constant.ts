/**
 * Resources paths
 */
export const RESOURCE_PATHS = {
  OTHERS: 'others',
  SOCIAL_SERVICES: 'social-services',
};

/**
 * Paths for routing
 */
export const PATHS = {
  SERVER: 'http://localhost:3000',
  ROOT: '/',
  LOG_IN: 'log-in',
  PAGE_NOT_FOUND: '404',
  OTHERS: {
    BASE: RESOURCE_PATHS.OTHERS,
    USERS: RESOURCE_PATHS.OTHERS + '/users',
    SPECIALTIES: RESOURCE_PATHS.OTHERS + '/specialties',
    STUDENTS: RESOURCE_PATHS.OTHERS + '/students',
    HOSPITALS: RESOURCE_PATHS.OTHERS + '/hospitals',
  },
  SOCIAL_SERVICES: {
    BASE: RESOURCE_PATHS.SOCIAL_SERVICES,
    ADD: RESOURCE_PATHS.SOCIAL_SERVICES + '/add',
  },
};
