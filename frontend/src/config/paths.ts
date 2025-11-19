export const paths = {
  // landing page routes
  landing: {
    home: {
      path: "/",
      getHref: () => "/",
    },
  },

  // Authentication routes (public)
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

  // App routes (protected)
  app: {
    dashboard: {
      path: "dashboard",
      getHref: () => "/dashboard",
    },
    repositories: {
      path: "repositories",
      getHref: () => "/dashboard/repositories",
    },
    findings: {
      path: "findings",
      getHref: () => "/dashboard/findings",
    },
    pullRequests: {
      path: "pull-requests",
      getHref: () => "/dashboard/pull-requests",
    },
    trends: {
      path: "trends",
      getHref: () => "/dashboard/trends",
    },
    settings: {
      path: "settings",
      getHref: () => "/dashboard/settings",
    },
  },
} as const;
