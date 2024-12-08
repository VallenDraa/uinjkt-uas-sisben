declare global {
  interface Window {
    env: { API_URL: string };
  }
}

export const getEnv = (
  key: "API_URL" | "WS_URL" | "SESSION_SECRET" | "NODE_ENV",
) => {
  const value =
    typeof process !== "undefined"
      ? process.env?.[key]
      : window.env?.[key as keyof typeof window.env];

  return value;
};

export const envLoader = () => {
  return {
    env: {
      API_URL: process.env.API_URL,
      WS_URL: process.env.WS_URL,
    },
  };
};
