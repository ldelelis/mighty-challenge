import express, { Request, Response } from "express";
import { v4 } from "uuid";

import { PAGINATION_LIMIT } from "config";
import { PaginatedResponse } from "core/responses";
import { Grammer } from "grammer/models";

import { PostImageDTO, PostDTO, PostResponseDTO } from "./dtos";
import { PostService } from "./repository";
import { ListPostsResponse } from "./responses";

export const postsRouter = express.Router();

// TODO: extract responses to new layer

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: creates a post with a description and image
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: base64 encoded image
 *                 required: true
 *               description:
 *                 type: string
 *                 description: text body of the post
 *                 required: true
 *               caption:
 *                 type: string
 *                 description: accessibility friendly caption for the image
 *     responses:
 *       201:
 *         description: successful empty response
 *       400:
 *         description: validation error with request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 detail:
 *                   type: string
 *                   description: detail of the validation error
 *       500:
 *         description: an unexpected error ocurred. consult with your friendly neighbor backend dev
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
    res.status(201).json({});
  }
  catch (exc) {
    console.error(exc.stack)
    res.status(500).json({});
  }
});

/**
 * @swagger
 * /posts/{id}/like:
 *   put:
 *     summary: creates a post with a description and image
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: post ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: empty response for correct handling
 *       500:
 *         description: an unexpected error ocurred. consult with your friendly neighbor backend dev
 */
postsRouter.put('/:id/like', async (req: Request, res: Response) => {
  const authUser = req.user as Grammer;
  const postId = req.params.id;
  const postService = new PostService();

  try {
    await postService.handleLike(postId, authUser);

    res.status(204).send();
  } catch (exc) {
    console.error(exc.stack);

    res.status(500).json({});
  }
});

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: lists all visible posts in chronological order
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       description:
 *                         type: string
 *                         example: "look at my cute puppy #dog"
 *                       images:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             image:
 *                               type: string
 *                               description: path to fetch the image from
 *                             caption:
 *                               type: string
 *                               description: accessibility friendly caption for the image
 *                             order:
 *                               type: integer
 *                               description: order of the image in the post
 *                       likes:
 *                         type: integer
 *                         description: amount of likes in a post
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: creation date of the post
 *                       liked_by_grammer:
 *                         type: boolean
 *                         description: whether the user liked this post already
 */
postsRouter.get('/', async (req: Request, res: Response) => {
  const postService = new PostService();
  const grammer = req.user as Grammer;

  // TODO: extract to middleware
  // TODO: add boolean field to response to track whether current user liked each post
  const limit = Number(req.query.limit || PAGINATION_LIMIT);
  const offset = Number(req.query.offset || 0);

  try {
    const [posts, count] = await postService.getAllPostsPaginated(limit, offset);
    const postDtos = await new ListPostsResponse().makeResponse(posts, grammer)

    res.status(200).json(new PaginatedResponse<PostResponseDTO>(count, postDtos));
  } catch (exc) {
    console.error(exc.stack);

    res.status(500).json({});
  }
});
