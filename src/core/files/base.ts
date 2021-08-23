export interface FileHandler {
  upload_file(content: string, path: string): void;
}
