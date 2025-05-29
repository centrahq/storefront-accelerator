import { parseAsJson } from 'nuqs';
import { z } from 'zod';

const schema = z.record(z.string());

export const parseAsBundledItems = parseAsJson((value) => schema.parse(value)).withDefault({});
