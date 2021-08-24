import { getRepository, Repository } from "typeorm";
import { connection } from "../../core/tests/connection";
import { Grammer } from "../../grammer/models";
import { Post, PostLike } from "../models";
import { PostService } from "../repository";

let grammer: Grammer;
let postRepository: Repository<Post>;
let postOldest: Post;
let postNewest: Post;
let postNonVisible: Post;

beforeAll(async () => {
  const conn = await connection.create();

  grammer = new Grammer();
  grammer.visible_name = "asdf";

  await getRepository(Grammer).save(grammer);

  postRepository = getRepository(Post);
  postOldest = new Post();
  postNewest = new Post();
  postNonVisible = new Post();
  postOldest.images = [];
  postOldest.description = "oldest post";
  postNewest.images = [];
  postNewest.description = "newest post";
  postNonVisible.images = [];
  postNonVisible.description = "invisible post";
  postNonVisible.is_visible = false;

  await postRepository.save(postOldest);
  await postRepository.save(postNewest);
  await postRepository.save(postNonVisible);

  return conn;
});

afterAll(async () => {
  return await connection.close();
});


describe("Post service test cases", () => {
  test('getAllPostsPaginated should return subset of posts', async () => {
    const postService = new PostService();
    // We created 2 visible posts during setup
    const limit = 1;
    const offset = 0;

    const [posts, count] = await postService.getAllPostsPaginated(limit, offset);

    // total posts
    expect(count).toEqual(2);
    // total returned posts
    expect(posts.length).toEqual(1);
  });

  test('getAllPosts should return all visible posts', async () => {
    const postService = new PostService();

    const [posts, count] = await postService.getAllPosts();
    const shouldBeEmpty = posts.filter(p => p.description == "invisible post");

    expect(count).toEqual(2);
    expect(shouldBeEmpty).toEqual([]);
  });

  test('getAllPosts should display from newest to oldest', async () => {
    const postService = new PostService();

    const [posts, _] = await postService.getAllPosts();
    const firstPostResultDate = new Date(posts[0].created_at).getTime();
    const lastPostResultDate = new Date(posts[1].created_at).getTime();

    expect(firstPostResultDate).toBeGreaterThanOrEqual(lastPostResultDate);
  });

  test('getPostLikeCount should track new likes', async () => {
    const postService = new PostService();

    const likesBeforeAct = await postService.getPostLikeCount(postNonVisible);
    await postService.handleLike(postNonVisible.id, grammer);
    const likesAfterAct = await postService.getPostLikeCount(postNonVisible);

    expect(likesBeforeAct).toEqual(0);
    expect(likesAfterAct).toEqual(1);

    // Cleanup for future tests
    await getRepository(PostLike).delete({ post: postNonVisible });
  });

  test('handleLike should create like for unliked post', async () => {
    const postService = new PostService();

    await postService.handleLike(postNonVisible.id, grammer);
    const likes = await postService.getPostLikeCount(postNonVisible);

    expect(likes).toEqual(1);

    // Cleanup for future tests
    await getRepository(PostLike).delete({ post: postNonVisible });
  });

  test('handleLike should remove like from liked post', async () => {
    const postService = new PostService();

    // Like, and then dislike
    await postService.handleLike(postNonVisible.id, grammer);
    await postService.handleLike(postNonVisible.id, grammer);
    const likes = await postService.getPostLikeCount(postNonVisible);

    expect(likes).toEqual(0);
  });
});
