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

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

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

  @Column({
    type: 'enum',
    enum: UserRole, // Pass the TypeScript enum directly
    default: UserRole.USER, // Use the enum member for the default
  })
  role: UserRole; // Type the property with your enum
  @Field(() => Profile)
  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true, // Enable automatic saving of related profile when user is saved
    onDelete: 'CASCADE', // Enable automatic deletion of related profile when user is deleted
  })
  profile: Promise<Profile>;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.user)
  posts: Promise<Post[]>;
}
