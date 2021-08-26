import { connection } from "core/tests/connection";
import { GrammerService } from "grammer/repositories";

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  return await connection.close();
});

describe("Grammer Service Test cases", () => {
  test("visible name should equal username initially", async () => {
    const grammerService = new GrammerService();

    const grammer = await grammerService.createGrammer("foo", "bar")

    expect(grammer.visible_name).toEqual(grammer.auth_user.username);
  });
});
