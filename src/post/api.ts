import express, { Request, Response } from "express";
import { v4 } from "uuid";

import { PostService } from "./repository";
import { S3Handler } from "../core/files/s3";
import { PostImageDTO, PostDTO, PostResponseDTO } from "./dtos";
import { Grammer } from "../grammer/models";

export const postsRouter = express.Router();

const paginateResponse = content => content;

/*
 * @param {base64} image
 * @param {string} caption
 * @param {string} description
 */
postsRouter.post('/', async (req: Request, res: Response) => {
  // Base64 representation of the post's image
  //
  // We need to convert this to an actually persisted image
  // and store its route
  //
  // An abstraction layer takes care of pointing to its source
  // (hard drive, s3, etc.)
  //
  // TODO: Abstract all this to helper class?

  const postService = new PostService();
  const author = req.user as Grammer;

  const {image, caption, description} = req.body;
  const fileHandler = new S3Handler();
  const filePath = `/images/userid/${v4()}`;  // Generate uuid v4 string for path
  fileHandler.upload_file(image, filePath);

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
    await postService.createPost(postDto, author);
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

  try {
    const posts = await postService.getAllPosts();
    // TODO: extract to responses file
    const postsResponse = await Promise.all(posts.map(async post => new PostResponseDTO(post.id, post.description, post.images[0].caption, post.images[0].order, post.images[0].image, await postService.getPostLikeCount(post), post.created_at)))

    res.status(200).json(paginateResponse(postsResponse));
  } catch (exc) {
    console.error(exc.stack);
    res.status(500).json({});
  }
});
