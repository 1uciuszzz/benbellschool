import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({ Component: (await import("./layout")).default }),
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("./pages/home/page")).default,
        }),
      },
    ],
  },
  {
    path: "/auth",
    lazy: async () => ({
      Component: (await import("./pages/auth/layout")).default,
    }),
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("./pages/auth/signin")).default,
        }),
      },
      {
        path: "signup",
        lazy: async () => ({
          Component: (await import("./pages/auth/signup")).default,
        }),
      },
    ],
  },
]);
