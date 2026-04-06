export const paths = {
  landing: {
    home: {
      path: "/",
      getHref: () => "/",
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
