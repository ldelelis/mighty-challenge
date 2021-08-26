import { createConnection, getConnection } from "typeorm";

export const connection = {
  async create(): Promise<void> {
    await createConnection({
      "name": "default",
      "type": "sqlite",
      "database": ":memory:",
      "dropSchema": true,
      "synchronize": true,
      "logging": false,
      "entities": [
        "src/**/models.ts"
      ]
    });
  },

  async close(): Promise<void> {
    await getConnection().close()
  }
}
