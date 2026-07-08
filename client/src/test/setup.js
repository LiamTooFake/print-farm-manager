// Vitest global setup: extend `expect` with jest-dom matchers and unmount
// React trees after each test so state/DOM never leaks between tests.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
