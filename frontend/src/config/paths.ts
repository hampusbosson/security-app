export const paths = {
  // landing page routes
  landing: {
    home: {
        path: "/",
        getHref: () => "/",
    },
  },

  // App (protected) routes
  app: {
    dashboard: {
      path: "dashboard",
      getHref: () => "/dashboard"
    }
  }
} as const;