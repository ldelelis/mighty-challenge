import { getRepository, QueryFailedError } from "typeorm";
import { connection } from "../../core/tests/connection";
import { Grammer } from "../../grammer/models";
import { Post, PostImage, PostLike } from "../models";

let post: Post;
let grammer: Grammer;

beforeAll(async () => {
  await connection.create();
  post = new Post();
  post.images = [];
  post.description = "asdf";
  grammer = new Grammer();
  grammer.visible_name = "asdf";
  await getRepository(Grammer).save(grammer);
  await getRepository(Post).save(post);
});

afterAll(async () => {
  return await connection.close();
});

describe("Post Image Model test cases", () => {
  test("should be unique for post and order", async () => {
    const postImage = new PostImage();
    const postImage2 = new PostImage();
    postImage.post = post;
    postImage.order = 1;
    postImage.image = "";
    postImage2.post = post;
    postImage2.order = 1;
    postImage2.image = "";

    await getRepository(PostImage).save(postImage);
    const shouldFail = async () => await getRepository(PostImage).save(postImage2);

    await expect(shouldFail).rejects.toThrow(QueryFailedError);
    await expect(shouldFail).rejects.toThrow("SQLITE_CONSTRAINT: UNIQUE constraint failed: post_image.postId, post_image.order");
  });
});

describe("Post Like Model test cases", () => {
  test("should be unique for post and grammer", async () => {
    const postLike = new PostLike();
    const postLike2 = new PostLike();
    postLike.grammer = grammer;
    postLike.post = post;
    postLike2.grammer = grammer;
    postLike2.post = post;

    await getRepository(PostLike).save(postLike);
    const shouldFail = async () => await getRepository(PostLike).save(postLike2);

    await expect(shouldFail).rejects.toThrow(QueryFailedError);
    await expect(shouldFail).rejects.toThrow("SQLITE_CONSTRAINT: UNIQUE constraint failed: post_like.postId, post_like.grammerId");
  });
});
