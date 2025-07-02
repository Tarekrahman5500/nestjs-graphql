import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Profile {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar' })
  bio: string;

  @Field()
  @Column({ type: 'varchar' })
  avatar: string;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
