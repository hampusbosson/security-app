export const paths = {
  landing: {
    home: {
      path: "/",
      getHref: () => "/",
    },
  },
  demo: {
    home: {
      path: "/demo",
      getHref: () => "/demo",
    },
  },

  auth: {
    signup: {
      path: "/signup",
      getHref: () => "/signup",
    },
    login: {
      path: "/login",
      getHref: () => "/login",
    },
  },

  app: {
    dashboard: {
      path: "dashboard",
      getHref: () => "/dashboard",
    },
  },
} as const;
