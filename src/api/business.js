import { productApi } from "./client";

export function createBusiness(token, { name, slug }) {
  return productApi("/businesses", {
    token,
    body: { name, slug },
  });
}

export function fetchBusinesses(token) {
  return productApi("/businesses", {
    method: "GET",
    token,
  });
}
