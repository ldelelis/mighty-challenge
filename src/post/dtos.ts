export class PostImageDTO {
  readonly image: string
  readonly caption: string
  readonly order: number

  constructor(image: string, caption: string, order: number) {
    this.image = image;
    this.caption = caption;
    this.order = order;
  }
}


export class PostDTO {
  readonly description: string;
  readonly images: PostImageDTO[];

  constructor(description: string, images: PostImageDTO[]) {
    this.description = description;
    this.images = images;
  }
}

export class PostResponseDTO {
  readonly id: number;
  readonly description: string;
  readonly images: PostImageDTO[];
  readonly likes: number;
  readonly liked_by_grammer: boolean;

  readonly created_at: Date;

  constructor(id: number, description: string, caption: string, order: number, image: string, likes: number, created_at: Date, likedByGrammer: boolean) {
    this.id = id;
    this.description = description;
    const imageDto = new PostImageDTO(image, caption, order);
    this.images = [imageDto];
    this.likes = likes;
    this.created_at = created_at;
    this.liked_by_grammer = likedByGrammer;
  }
}
