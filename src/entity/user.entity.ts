import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Post } from './post.entity';
import { Profile } from './profile.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar' })
  username: string;
  @Field()
  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'enum', enum: ['ADMIN', 'USER'] }) // Assuming Role is an enum
  role: string;
  @Field(() => Profile)
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
