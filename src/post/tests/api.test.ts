import jsonwebtoken from "jsonwebtoken";
import request from "supertest";
import { app } from "../../app";
import { JWT_SECRET_KEY } from "../../config";
import { connection } from "../../core/tests/connection";
import { Grammer } from "../../grammer/models";
import { GrammerService } from "../../grammer/repositories";

let grammer: Grammer;
let token: string;
let grammerService: GrammerService;

beforeAll(async () => {
  await connection.create();
  grammerService = new GrammerService();
  grammer = await grammerService.createGrammer("foo", "bar");
  token = jsonwebtoken.sign({ user: { id: grammer.auth_user.id, username: grammer.visible_name } }, JWT_SECRET_KEY);
});

afterAll(async () => {
  return await connection.close();
});

describe('Post API routes test cases', () => {
  // CRUD
  test('should require a post description on creation', async () => {
    const body = { image: "fasfasf" };

    const response = await request(app)
      .post('/posts/')
      .set("Authorization", `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(400);
  });

  test('should require a post image on creation', async () => {
    const body = { description: "fasfasf" };

    const response = await request(app)
      .post('/posts/')
      .set("Authorization", `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(400);
  });

  // authz/authn
  test('should disallow post lists for unauthenticated grammers', async () => {
    const response = await request(app).get("/posts/").send()

    expect(response.status).toBe(401);
  });

  test('should disallow post creation for unauthenticated grammers', async () => {
    const body = { description: "foo", image: "bar" };

    const response = await request(app).post("/posts/").send(body)

    expect(response.status).toBe(401);
  })

  // pagination
  test('should return a pagination structure on listing posts', async () => {
    const expectedStructure = { count: 0, data: [] };

    const response = await request(app)
      .get("/posts/")
      .set("Authorization", `Bearer ${token}`)
      .send()

    expect(response.body).toMatchObject(expectedStructure);

  });
});
