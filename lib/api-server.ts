import { headers } from "next/headers";
import { auth } from "./auth";

export async function serverFetch(endpoint: string, options: RequestInit = {}) {
  const jwtToken = await auth.api.getToken({ headers: await headers() });
  const token = jwtToken?.token;

  return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
