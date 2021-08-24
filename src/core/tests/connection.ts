import { createConnection, getConnection } from "typeorm";

export const connection = {
  async create() {
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

  async close() {
    return await getConnection().close()
  }
}
