import { Response } from "express";

const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Set authentication token in secure httpOnly cookie
 */
export function setAuthCookie(res: Response, token: string): void {
  res.cookie("auth_token", token, {
    ...COOKIE_CONFIG,
    path: "/",
  });
}

/**
 * Set user data in a secure cookie (non-httpOnly, readable by client JS)
 * This is for non-sensitive user info
 */
export function setUserCookie(res: Response, userData: string): void {
  res.cookie("user_data", userData, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(res: Response): void {
  res.clearCookie("auth_token", { path: "/" });
  res.clearCookie("user_data", { path: "/" });
}

/**
 * Create a response with auth cookies
 */
export function setAuthResponse(
  res: Response,
  token: string,
  userData: string
): void {
  setAuthCookie(res, token);
  setUserCookie(res, userData);
}
