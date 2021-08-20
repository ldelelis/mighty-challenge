import { Service } from "typedi";
import { Connection, Repository } from "typeorm";
import { PostImage, Post, PostLike } from "./models";
import { PostDTO, PostImageDTO } from "./dtos";
import { Grammer } from "../grammer/models";

@Service()
export class PostService {
  private postImageRepository: Repository<PostImage>;
  private postRepository: Repository<Post>;
  private postLikeRepository: Repository<PostLike>;

  // TODO: refactor using getRepository instead
  constructor(private readonly connection: Connection) {
    this.postRepository = connection.getRepository(Post);
    this.postImageRepository = connection.getRepository(PostImage);
    this.postLikeRepository = connection.getRepository(PostLike);
  }

  public async getAllPosts(): Promise<Post[]> {
    const posts = await this.postRepository.find({
      select: [
        "id", "description", "created_at", "images"
      ],
      where: {
        is_visible: true
      },
      order: {
        created_at: 'DESC'
      },
      relations: ['images']
    });

    return posts;
  }

  public async getPostLikeCount(post: Post): Promise<number> {
    return await this.postLikeRepository.count({ post });
  }

  public async createPost(body: PostDTO, author: Grammer): Promise<Post> {
    const postImages = await Promise.all(body.images.map(async pi => await this.createPostImage(pi)));

    const newPost = new Post();
    newPost.images = postImages;
    newPost.description = body.description;
    newPost.author = author;

    await this.postRepository.save(newPost);

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

  public async handleLike(postId: string, grammer: Grammer): Promise<void> {
    const post = await this.postRepository.findOne(postId);
    const postLike = await this.postLikeRepository.findOne({ post: post, grammer: grammer });

    if (!postLike) {
      this.likePost(post, grammer);
    } else {
      this.unlikePost(postLike.id);
    }
  }

  private async likePost(post: Post, grammer: Grammer): Promise<void> {
    const postLike = new PostLike();
    postLike.post = post;
    postLike.grammer = grammer;

    await this.postLikeRepository.save(postLike);
  }

  private async unlikePost(postLikeId: number): Promise<void> {
    await this.postLikeRepository.delete(postLikeId);
  }
}
