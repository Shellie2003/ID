import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';

import { idealySchema } from './schema';
import { createDatabase, onSetUpError } from './createDatabase';

// Web entry point (see index.ts for the native/SQLite counterpart). Metro
// resolves this file automatically for `expo start --web` so the SQLite (JSI)
// adapter — and its native-only dependencies — never enter the web bundle.
export const database = createDatabase(
  new LokiJSAdapter({
    schema: idealySchema,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    onSetUpError,
  })
);
