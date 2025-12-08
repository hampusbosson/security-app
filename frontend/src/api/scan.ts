import api from "./http";

export const ScanAPI = {
    runScan: async (repositoryId: number) => {
        const res = await api.post(`/api/scan/run/${repositoryId}`);
        return res.data;
    }
};