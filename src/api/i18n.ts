import { IpcMainInvokeEvent } from "electron";
import path from 'path';
import fs from 'fs/promises';
import { Mutex } from "async-mutex";

type QueueT = {
    filename: string,
    key: string,
    text: string,
}[];

const mutex = new Mutex();
const queue: QueueT = []
let timeout: NodeJS.Timeout = null;

const groupByArray = function(xs: QueueT, key: "filename" | Function) {
    return xs.reduce(function (rv, x) {
        const v = key instanceof Function ? key(x) : x[key];
        let el = rv.find((r) => r && r.key === v);
        if (el) {
            el.values.push(x);
        } else {
            rv.push({
                key: v,
                values: [x]
            });
        }
        return rv;
    }, []);
}

const mergeJSONData = async (filename: string, values: {key: string; text: string}[]): Promise<{[key: string]: string;}> => {
    try {
        const jsonData = await fs.readFile(path.resolve(filename));
        const sData = jsonData.toString().replace(/^\uFEFF/, "");
        const data = JSON.parse(sData.toString());
        values.forEach((v) => data[v["key"]] = v["text"]);

        return data;
    } catch (err) {
        const data: {[key: string]: string;} = {};
        values.forEach((v) => data[v["key"]] = v["text"]);

        return data;
    }
}

const getResourcesPath = (): string => {
    return process.env.NODE_ENV === 'development'
        ? "."
        : process.resourcesPath;
};

export const handleI18nRead = async (
  _event: IpcMainInvokeEvent,
  language: string,
  namespace: string
): Promise<I18nApiResponse> => {
    return new Promise<I18nApiResponse>((resolve) => {
        const filename = path.join(
            getResourcesPath(),
            "app", "localization", "locales",
            language, `${namespace}.json`
        )

        fs.readFile(path.resolve(filename))
            .then((data) => {
                const sData = data.toString().replace(/^\uFEFF/, "");
                try {
                    const translations = JSON.parse(sData);
                    resolve({
                        status: true,
                        result: translations
                    })
                } catch (err) {
                    resolve({
                        status: false,
                        error: err.message,
                    })
                }
            })
            .catch((err) => {
                resolve({
                    status: false,
                    error: err.message,
                })
            });
    });
}

export const handleI18nCreate = async (
    _event: IpcMainInvokeEvent,
    languages: string[],
    namespace: string,
    key: string,
    fallbackValue: string,
  ): Promise<ApiResponse> => { 
    return new Promise<ApiResponse>(async (resolve) => {
        await mutex.runExclusive(() => {
            languages.forEach((lng) => {
                const filename = path.join(
                    getResourcesPath(),
                    "app", "localization", "locales",
                    lng, `${namespace}.missing.json`
                );

                queue.push({
                    filename,
                    key,
                    text: fallbackValue,
                });
            });
        }); 

        if (timeout === null && queue.length > 0) {
            timeout = setTimeout(async () => {
                await mutex.runExclusive(async () => {
                    const toWork = groupByArray(queue, "filename");
                    for (const data of toWork) {
                        const mergedData = await mergeJSONData(data.key, data.values);
                        await fs.writeFile(path.resolve(data.key), JSON.stringify(mergedData, null, 2));
                    }
                    timeout = null;
                });
            }, 1000);
        }
        resolve({status: true});
    });
  }