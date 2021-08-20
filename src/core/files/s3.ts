import { FileHandler } from "./base";

export class S3Handler implements FileHandler {
  public upload_file(content: string, path: string): void {
  }

  public retrieve_file(path): string {
    return "/";
  }
}
