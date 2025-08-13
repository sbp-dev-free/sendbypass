import { envSchema } from "@/validations/env";

const env = envSchema.parse({
  NEXT_PUBLIC_BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
  NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
});

export const getConfigs = () => ({
  baseApiUrl: env.NEXT_PUBLIC_BASE_API_URL,
  apiVersion: env.NEXT_PUBLIC_API_VERSION,
  isDev: env.NEXT_PUBLIC_BASE_API_URL.includes("api-dev"),
  baseUrl: `${env.NEXT_PUBLIC_BASE_API_URL}/${env.NEXT_PUBLIC_API_VERSION}`,
  INTERCOM_APP_ID: "mmk6mce2",
  GTAG_ID: "G-SZFK12YHNV",
  CLARITY_ID: "oyywdh1a32",
  isApp: process.env.NEXT_PUBLIC_ORIGIN == "app",
});
