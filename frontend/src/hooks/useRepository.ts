import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

export const useRepository = (repoId: string) => {
  const { user } = useAuth();

  // Convert URL string param to number
  const id = Number(repoId);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const { repository, installation } = useMemo(() => {
    if (!user) {
      return { repository: undefined, installation: undefined };
    }

    // Look through all installations → flatten repositories → find by ID
    for (const inst of user.installations) {
      const repo = inst.repositories?.find((r) => r.id === id);
      if (repo) {
        return {
          repository: repo,
          installation: inst,
        };
      }
    }

    return { repository: undefined, installation: undefined };
  }, [user, id]);

  return {
    repository,
    installation,
    exists: Boolean(repository),
    loading: !user, // useful for page-level guards
  };
};