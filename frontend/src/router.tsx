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
      {
        path: "/rooms",
        lazy: async () => ({
          Component: (await import("./pages/rooms/page")).default,
        }),
      },
      {
        path: "/rooms/:id",
        lazy: async () => ({
          Component: (await import("./pages/rooms/roomDetail")).default,
        }),
        children: [
          {
            path: "pay/:payeeId",
            lazy: async () => ({
              Component: (await import("./pages/rooms/payForm")).default,
            }),
          },
        ],
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
    ],
  },
]);
