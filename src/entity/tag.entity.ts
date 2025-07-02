import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Post } from './post.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Tag {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar' })
  name: string;
  @Field(() => [Post])
  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
