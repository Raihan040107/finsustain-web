import api from "./api";

type AnalysisResponse<T> = {
  data: T | null;
};

const analysisCache = new Map<number, unknown | null>();
const analysisRequests = new Map<number, Promise<unknown | null>>();

export function setCachedAnalysis<T>(idUsaha: number, data: T | null) {
  analysisCache.set(idUsaha, data);
  analysisRequests.delete(idUsaha);
}

export function invalidateAnalysisCache(idUsaha?: number | null) {
  if (!idUsaha) {
    analysisCache.clear();
    analysisRequests.clear();
    return;
  }

  analysisCache.delete(idUsaha);
  analysisRequests.delete(idUsaha);
}

export async function getAnalysis<T>(idUsaha: number): Promise<T | null> {
  if (analysisCache.has(idUsaha)) {
    return analysisCache.get(idUsaha) as T | null;
  }

  const existingRequest = analysisRequests.get(idUsaha) as Promise<T | null> | undefined;
  if (existingRequest) return existingRequest;

  const request = api
    .get<AnalysisResponse<T>>("/jawaban/analisis", {
      params: { id_usaha: idUsaha },
    })
    .then((res) => {
      const data = res.data.data;
      analysisCache.set(idUsaha, data);
      return data;
    })
    .finally(() => {
      analysisRequests.delete(idUsaha);
    });

  analysisRequests.set(idUsaha, request);
  return request;
}
