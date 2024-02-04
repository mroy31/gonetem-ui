import * as path from "path";
import * as fs from "fs/promises";

export function decodeB64(b64Str: string): string {
  return Buffer.from(b64Str, "base64").toString("utf8");
}

/**
 * @param {string} exe executable name (without extension if on Windows)
 * @return {Promise<string|null>} executable path if found
 * */
export async function findExecutable(exe: string): Promise<string | null> {
  const envPath = process.env.PATH || "";
  const envExt = process.env.PATHEXT || "";
  const pathDirs = envPath
    .replace(/["]+/g, "")
    .split(path.delimiter)
    .filter(Boolean);
  const extensions = envExt.split(";");
  const candidates = pathDirs.flatMap((d) =>
    extensions.map((ext) => path.join(d, exe + ext))
  );
  try {
    return await Promise.any(candidates.map(checkFileExists));
  } catch (e) {
    return null;
  }

  async function checkFileExists(filePath: string) {
    if ((await fs.stat(filePath)).isFile()) {
      return filePath;
    }
    throw new Error("Not a file");
  }
}
