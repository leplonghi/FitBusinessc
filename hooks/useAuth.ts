// This file re-exports from useAuth.tsx to solve a module resolution issue.
// Some bundlers prioritize .ts over .tsx, and this empty file was being picked up.
export * from './useAuth.tsx';
