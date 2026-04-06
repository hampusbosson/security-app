import api from "./http";

export const GithubAPI = {
  installGithubApp: async () => {
    const res = await api.get("/api/github/install-url");
    window.location.href = res.data.url;
  },

  syncRepositories: async () => {
    const res = await api.get("/api/github/sync-repos");
    return res.data;
  },
};
