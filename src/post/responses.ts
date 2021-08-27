import { Grammer } from "grammer/models";

import { PostResponseDTO } from "./dtos";
import { Post } from "./models";
import { PostService } from "./services";

export class ListPostsResponse {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  async makeResponse(posts: Post[], grammer: Grammer): Promise<PostResponseDTO[]> {
    const postDtos: PostResponseDTO[] = [];

    for (const post of posts) {
      const postLikes = await this.postService.getPostLikeCount(post);
      const isLiked = await this.postService.isLikedByGrammer(post, grammer)
      const dto = new PostResponseDTO(
        post.id,
        post.description,
        post.images[0].caption,
        post.images[0].order,
        post.images[0].image,
        postLikes,
        post.created_at,
        isLiked
      );
      postDtos.push(dto);
    }

    return postDtos;
  }
}
