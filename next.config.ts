import type { NextConfig } from "next";

const dotenv = require('dotenv');
const envFile = `.env.${process.env.ENVIRONMENT}`;
dotenv.config({ path: envFile });

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;
