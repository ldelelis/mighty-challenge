import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { AuthUser } from "authentication/models";
import { Post } from "post/models";

@Entity()
export class Grammer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  visible_name: string;

  @Column({ default: "profile_picture.png "})
  profile_picture: string;

  @OneToOne(() => AuthUser)
  @JoinColumn({ name: "auth_user_id"})
  auth_user: AuthUser;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];
}
