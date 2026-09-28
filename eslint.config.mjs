import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import vitest from 'eslint-plugin-vitest';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'eslint/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'public/**',
      'coverage/**',
      'scripts/**'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  
  {
    files: ['**/*.ts'],
    plugins: { vitest, prettier: eslintPluginPrettier },
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        project: './tsconfig.vitest.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        args: 'after-used',
        // TypeScript 特有的选项
        ignoreRestSiblings: true, // 忽略解构剩余变量（如 const { a, ...rest } = obj）
      }],
      "curly": "error", // 强制使用大括号
      // 2. 强制大括号换行风格
      "brace-style": ["error", "1tbs", { "allowSingleLine": false }],
    },
  },
  prettier,
);
