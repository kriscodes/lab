/** @file Applies Next.js accessibility, performance, and TypeScript lint rules to source files. */

import { defineConfig, globalIgnores } from 'eslint/config';
import nextWebVitalsRules from 'eslint-config-next/core-web-vitals';
import nextTypescriptRules from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextWebVitalsRules,
  ...nextTypescriptRules,
  globalIgnores(['.next/**', 'out/**', 'coverage/**', 'next-env.d.ts']),
]);
