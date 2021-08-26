// fs requires old style require, as module import brings an old version into the namespace
// I really really really REALLY dislike this language.
const fs = require('fs/promises');  // eslint-disable-line
import path from "path";

import { FileHandler } from "./base";

export class LocalHandler implements FileHandler {
  public async upload_file(content: string, path: string): Promise<void> {
    const basePath = "./data";
    const fullPath = `${basePath}/${path}`;
    await this.ensureDirExists(fullPath);

    await fs.writeFile(fullPath, content, "base64");
  }

  private async ensureDirExists(fullPath: string): Promise<void> {
    const directoryPath = path.dirname(fullPath);
    try {
      await fs.mkdir(directoryPath, { recursive: true });
    } catch(exc) {
      console.error(exc.stack);
    }
  }
}
