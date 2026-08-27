import { userApi } from "./client";

export function signup({ name, email, password }) {
  return userApi("/auth/v1/sign-up", {
    body: { name, email, password },
  });
}

export function signin({ email, password }) {
  return userApi("/auth/v1/sign-in", {
    body: { email, password },
  });
}
