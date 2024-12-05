import { createCookieSessionStorage } from "@remix-run/node";
import { getEnv } from "~/config/env";

export type SessionData = {
  hardwareId: string;
};

export type SessionFlashData = {
  error: string;
};

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",
      secure: getEnv("NODE_ENV") === "production",
      secrets: [getEnv("SESSION_SECRET")!],
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
    },
  });
