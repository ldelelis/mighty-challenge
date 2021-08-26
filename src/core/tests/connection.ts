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
        "dist/**/models.js"
      ]
    });
  },

  async close(): Promise<void> {
    await getConnection().close()
  }
}
