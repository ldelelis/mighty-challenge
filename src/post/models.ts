import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Grammer } from "../grammer/models";


@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ default: true })
  is_visible: boolean;

  @OneToMany(() => PostImage, image => image.post)
  images: PostImage[];

  @ManyToOne(() => Grammer, grammer => grammer.posts)
  author: Grammer;

  @OneToMany(() => PostLike, like => like.post)
  likes: PostLike[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


@Entity()
@Unique(["post", "order"])
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column({ default: "" })
  caption: string;

  @Column()
  order: number;

  @ManyToOne(() => Post, post => post.images)
  post: Post;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


@Entity()
@Unique(["post", "grammer"])
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => Grammer)
  grammer: Grammer;
}
