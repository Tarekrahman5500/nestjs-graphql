import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

import 'reflect-metadata';
import { Post, Profile, Tag, User } from './entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pg@17',
  database: 'nestjs_graphql',
  synchronize: true, // use only for dev/seeding
  entities: [User, Post, Profile, Tag],
});

async function seed() {
  await AppDataSource.initialize();

  const tagNames = [
    'nestjs',
    'graphql',
    'typescript',
    'docker',
    'bun',
    'api',
    'postgres',
    'auth',
  ];
  const tags: Tag[] = [];

  for (const name of tagNames) {
    const tag = new Tag();
    tag.name = name;
    await AppDataSource.manager.save(tag);
    tags.push(tag);
  }

  for (let i = 0; i < 25; i++) {
    const user = new User();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    user.username = faker.helpers
      .slugify(`${firstName} ${lastName}`)
      .toLowerCase();
    user.email = faker.internet.email();
    user.role = faker.helpers.arrayElement(['ADMIN', 'USER']);
    await AppDataSource.manager.save(user);

    const profile = new Profile();
    profile.bio = faker.lorem.sentence();
    profile.avatar = faker.image.avatar();
    profile.user = user;
    await AppDataSource.manager.save(profile);

    const postCount = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < postCount; j++) {
      const post = new Post();
      post.title = faker.lorem.words(5);
      post.content = faker.lorem.paragraphs(2);
      post.user = user;
      post.tags = faker.helpers.arrayElements(
        tags,
        faker.number.int({ min: 1, max: 3 }),
      );
      await AppDataSource.manager.save(post);
    }
  }

  console.log('✅ Seeding complete!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
