import api from "./http";

export const ScanAPI = {
  getLatestRepositoryScan: async (repositoryId: number) => {
    const res = await api.get(`/api/scan/repository/${repositoryId}/latest`);
    return res.data.scan;
  },

  getScanById: async (scanId: number) => {
    const res = await api.get(`/api/scan/${scanId}`);
    return res.data.scan;
  },

  runScan: async (repositoryId: number) => {
    const res = await api.post(`/api/scan/run/${repositoryId}`);
    return res.data.scan;
  },

  stopScan: async (scanId: number) => {
    const res = await api.post(`/api/scan/stop/${scanId}`);
    return res.data;
  },
};
