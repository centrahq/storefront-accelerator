import { Mutex } from 'async-mutex';

/**
 * A mutex to ensure that only one mutation is processed at a time. This is useful to prevent race conditions.
 */
export const mutationMutex = new Mutex();
