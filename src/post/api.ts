import express, { Request, Response } from "express";
import { v4 } from "uuid";

import { PostService } from "./repository";
import { PostImageDTO, PostDTO, PostResponseDTO } from "./dtos";
import { Grammer } from "../grammer/models";
import { PaginatedResponse } from "../core/responses";
import { PAGINATION_LIMIT } from "../config";

export const postsRouter = express.Router();

// TODO: document all endpoints with swagger-compatible format

/*
 * @param {base64} image
 * @param {string} caption
 * @param {string} description
 */
postsRouter.post('/', async (req: Request, res: Response) => {
  const postService = new PostService();
  const author = req.user as Grammer;

  const {image, caption, description} = req.body;
  // TODO: extract to validation layer
  if (!image) {
    return res.status(400).json({"detail": "image is required"});
  }
  if (!description) {
    return res.status(400).json({"detail": "post description is required"});
  }

  const filePath = `images/${author.id}/${v4()}`;  // Generate uuid v4 string for path

  // For the time being, we support single-image posts
  // Although the domain was designed with multiple images per post in mind
  const postImageDto = new PostImageDTO(
    filePath,
    caption,
    1
  );
  const postDto = new PostDTO(
    description,
    [postImageDto]
  );

  try {
    await postService.createPost(postDto, author, image);
    res.status(200).json({});
  }
  catch (exc) {
    console.error(exc.stack)
    res.status(500).json({});
  }
});

postsRouter.put('/:id/like', async (req: Request, res: Response) => {
  const authUser = req.user as Grammer;
  const postId = req.params.id;
  const postService = new PostService();

  await postService.handleLike(postId, authUser);

  res.status(204).send();
});

postsRouter.get('/', async (req: Request, res: Response) => {
  const postService = new PostService();

  // TODO: extract to middleware
  // TODO: add boolean field to response to track whether current user liked each post
  const limit = Number(req.query.limit || PAGINATION_LIMIT);
  const offset = Number(req.query.offset || 0);

  try {
    const [posts, count] = await postService.getAllPostsPaginated(limit, offset);
    // TODO: extract to responses file
    const postDtos = await Promise.all(posts.map(async post => new PostResponseDTO(post.id, post.description, post.images[0].caption, post.images[0].order, post.images[0].image, await postService.getPostLikeCount(post), post.created_at)))

    res.status(200).json(new PaginatedResponse<PostResponseDTO>(count, postDtos));
  } catch (exc) {
    console.error(exc.stack);
    res.status(500).json({});
  }
});
