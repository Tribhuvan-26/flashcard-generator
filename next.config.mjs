/** @type {import('next').NextConfig} */
const nextConfig = {
  // Multiple lockfiles exist on this machine; pin the workspace root here.
  turbopack: { root: import.meta.dirname },
};
export default nextConfig;
