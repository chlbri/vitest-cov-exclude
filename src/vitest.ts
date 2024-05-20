import { glob } from 'glob';
import type { UserConfig } from 'vitest/config';

export type Define<T> = Exclude<T, undefined>;

export type Plugin = Exclude<
  Define<UserConfig['plugins']>[number],
  Promise<any> | null | undefined | false | Array<any>
>;

export const DEFAULT_PATTERN = './src/**/*.ts';
export const name = '@bemedev/exclude-coverage';

export const buildInclude = (
  pattern: string | string[] = DEFAULT_PATTERN,
  ...ignore: string[]
) => {
  const include = glob(pattern, {
    ignore,
    cwd: process.cwd(),
  });

  return include;
};

/**
 * Plugin to add files with glob patterns to vitest
 *
 * @param ignore globs to exclude inside
 * @returns a vitest config
 *
 * @see {@link exclude.withPattern}
 * @remarks
 * You don't have to use test.exclude.
 * The default search patter is './src/**\/\*.ts'
 */
export function exclude(...ignore: string[]) {
  return exclude.withPattern(DEFAULT_PATTERN, ...ignore);
}

/**
 * Plugin to add files with glob patterns to vitest
 *
 * @param pattern The pattern where searching files
 * @param ignore globs to exclude inside
 * @returns a vitest config
 */
exclude.withPattern = (
  pattern: string | string[],
  ...ignore: string[]
): Plugin => {
  return {
    name,
    enforce: 'pre',
    config: async options => {
      const testConfig = options?.test;
      const coverage = options?.test?.coverage;
      const include = await buildInclude(pattern, ...ignore);

      return {
        ...options,
        test: {
          ...testConfig,
          coverage: {
            ...coverage,
            include,
          },
        },
      };
    },
  };
};
