/// <reference types="vite/client" />

// Type declarations for Vite's special query imports
declare module "*.css?raw" {
  const content: string;
  export default content;
}
