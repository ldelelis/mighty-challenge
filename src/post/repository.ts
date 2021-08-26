import { FindManyOptions, getRepository, Repository } from "typeorm";

import { LocalHandler } from "core/files/local";
import { Grammer } from "grammer/models";

import { PostDTO, PostImageDTO } from "./dtos";
import { PostImage, Post, PostLike } from "./models";

export class PostService {
  private postImageRepository: Repository<PostImage>;
  private postRepository: Repository<Post>;
  private postLikeRepository: Repository<PostLike>;

  constructor() {
    this.postRepository = getRepository(Post);
    this.postImageRepository = getRepository(PostImage);
    this.postLikeRepository = getRepository(PostLike);
  }

  public async getAllPostsPaginated(limit: number, offset: number): Promise<[Post[], number]> {
    const pagination_options: FindManyOptions<Post> = {
      take: limit,
      skip: offset
    };

    return await this.getAllPosts(pagination_options);
  }

  public async getAllPosts(extra_options?: FindManyOptions<Post>): Promise<[Post[], number]> {
    if (!extra_options) {
      extra_options = {};
    }

    const [posts, count] = await this.postRepository.findAndCount({
      select: [
        "id", "description", "created_at", "images"
      ],
      where: {
        is_visible: true
      },
      order: {
        created_at: 'DESC'
      },
      relations: ['images'],
      ...extra_options
    });

    return [posts, count];
  }

  public async getPostLikeCount(post: Post): Promise<number> {
    return await this.postLikeRepository.count({ post });
  }

  public async isLikedByGrammer(post: Post, grammer: Grammer): Promise<boolean> {
    return await this.postLikeRepository.count({ post, grammer }) === 1;
  }

  public async createPost(body: PostDTO, author: Grammer, imageContent: string): Promise<Post> {
    const postImages = await Promise.all(body.images.map(async pi => await this.createPostImage(pi)));

    const newPost = new Post();
    newPost.images = postImages;
    newPost.description = body.description;
    newPost.author = author;

    await this.postRepository.save(newPost);
    await this.handlePostImage(imageContent, postImages[0].image);

    return newPost;
  }

  public async createPostImage(postImageDto: PostImageDTO): Promise<PostImage> {
    const postImage = new PostImage();
    postImage.image = postImageDto.image;
    postImage.caption = postImageDto.caption;
    postImage.order = postImageDto.order;

    await this.postImageRepository.save(postImage);

    return postImage;
  }

  public async handleLike(postId: string | number, grammer: Grammer): Promise<void> {
    const post = await this.postRepository.findOne(postId);
    const postLike = await this.postLikeRepository.findOne({ post: post, grammer: grammer });

    if (!postLike) {
      await this.likePost(post, grammer);
    } else {
      await this.unlikePost(postLike.id);
    }
  }

  private async likePost(post: Post, grammer: Grammer): Promise<void> {
    const postLike = new PostLike();
    postLike.post = post;
    postLike.grammer = grammer;

    try {
      await this.postLikeRepository.save(postLike);
    } catch (exc) {
      console.log(exc.stack)
    }
  }

  private async unlikePost(postLikeId: number): Promise<void> {
    await this.postLikeRepository.delete(postLikeId);
  }

  private async handlePostImage(content: string, imagePath: string): Promise<void> {
    const fileHandler = new LocalHandler();

    fileHandler.upload_file(content, imagePath);
  }
}
