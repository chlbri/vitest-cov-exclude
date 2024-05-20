import { createTests as _create } from '@bemedev/vitest-extended';
import type { Fc } from '@bemedev/vitest-extended/lib/types';
import { exclude, name } from './vitest';

const environment = 'node';
const enabled = true;
const enforce = 'pre';

const createTests = () => {
  const _f = async (...args: Parameters<typeof exclude>) => {
    const { name, enforce, config: c } = exclude(...args);
    const fn = c as Fc;
    const config = await fn({
      test: { environment, coverage: { enabled } },
    });
    return { config, name, enforce };
  };
  const useTests = _create(_f);
  return useTests;
};

const useTests = createTests();

useTests(
  [
    'No ignore',
    [],
    {
      name,
      enforce,
      config: {
        test: {
          environment,
          coverage: {
            enabled,
            include: [
              'src/vitest.ts',
              'src/vitest.test.ts',
              'src/index.ts',
            ],
          },
        },
      },
    },
  ],
  [
    'Ignore all test files',
    ['**/*.test.ts'],
    {
      name,
      enforce,
      config: {
        test: {
          environment,
          coverage: {
            enabled,
            include: ['src/vitest.ts', 'src/index.ts'],
          },
        },
      },
    },
  ],
  [
    'Ignore all index files',
    ['**/index.ts'],
    {
      name,
      enforce,
      config: {
        test: {
          environment,
          coverage: {
            enabled,
            include: ['src/vitest.ts', 'src/vitest.test.ts'],
          },
        },
      },
    },
  ],
);
