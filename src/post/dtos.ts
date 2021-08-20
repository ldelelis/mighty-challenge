import { DTO } from "../core/dto";

export class PostImageDTO implements DTO {
  readonly image: string
  readonly caption: string
  readonly order: number

  constructor(image: string, caption: string, order: number) {
    this.image = image;
    this.caption = caption;
    this.order = order;
  }
}


export class PostDTO implements DTO {
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
  readonly caption: string;
  readonly order: number;
  readonly image: string;
  readonly likes: number;

  readonly created_at: Date;

  constructor(id: number, description: string, caption: string, order: number, image: string, likes: number, created_at: Date) {
    this.id = id;
    this.description = description;
    this.caption = caption;
    this.order = order;
    this.image = image;
    this.likes = likes;
    this.created_at = created_at;
  }
}
