import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Tag } from './tag.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar' })
  title: string;

  @Field()
  @Column({ type: 'varchar' })
  content: string;

  @Field(() => ID)
  @Column()
  userId: number; // <-- Explicit foreign key
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  user: Promise<User>;
  @Field(() => Tag)
  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Promise<Tag[]>;
}
