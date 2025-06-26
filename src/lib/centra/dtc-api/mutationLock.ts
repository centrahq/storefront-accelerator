import { Mutex } from 'async-mutex';

export const mutationMutex = new Mutex();
