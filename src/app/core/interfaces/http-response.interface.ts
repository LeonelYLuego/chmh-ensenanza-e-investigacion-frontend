/**
 * Http Response Error interface
 */
export interface HttpResponseError {
  /** @property status code of the error */
  statusCode: number;

  /** @property time stamp of the error */
  timestamp: string;

  /** @property path in the server of the error */
  path: string;

  /** @property exception */
  exception: any;
}

/**
 * Http Response interface
 */
export interface HttpResponse<T> {
  /** @property {T} data Data of the response */
  data?: T;

  /** @Property Error response */
  error?: HttpResponseError;
}
