import type { NextConfig } from "next";

const dotenv = require('dotenv');
const envFile = `.env.${process.env.ENVIRONMENT}`;
console.log("envFile", envFile);
dotenv.config({ path: envFile });

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
