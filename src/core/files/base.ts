export interface FileHandler {
  upload_file(content: string, path: string): void;

  retrieve_file(path: string): string;
}
