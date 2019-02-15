type PrimitiveType = number | string | boolean | void | null | undefined | any;

type PrimitiveArray = PrimitiveType[];

interface JsonObject {
  [key: string]: JsonObject | PrimitiveType | PrimitiveArray;
}

type JsonType = JsonObject | PrimitiveType | PrimitiveArray;

interface CacheObject {
  data: JsonType;
  expire: number;
}

const KEY_ERROR = "key must be a not empty string.";
const LOCAL_STORAGE_ERROR = "localStorage is not available.";

function checkKey(key: string) {
  if (typeof key !== "string" || key.length === 0) {
    throw new Error(KEY_ERROR);
  }
}

export function getCache(key: string): CacheObject {
  checkKey(key);

  let json: string | null = null;

  try {
    json = localStorage.getItem(key);
  } catch {
    throw new Error(LOCAL_STORAGE_ERROR);
  }

  if (json) {
    try {
      const data: CacheObject = JSON.parse(json);

      return data;
    } catch {}
  }

  return {
    data: null,
    expire: 0,
  };
}

export function setCache(key: string, data: JsonType, time: number) {
  checkKey(key);

  const cachedData = {
    data: data,
    expire: Date.now() + time,
  };

  const json = JSON.stringify(cachedData);

  localStorage.setItem(key, json);
}

export async function cache(
  key: string,
  callback: () => void,
  time = 300000,
): Promise<JsonType> {
  checkKey(key);

  try {
    let { data, expire } = getCache(key);

    if (expire > Date.now()) {
      return data;
    }
  } catch (err) {}

  let data = await callback();

  setCache(key, data, time);

  return data;
}

export default {
  get: getCache,
  set: setCache,
};
