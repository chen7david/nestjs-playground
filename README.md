# NestJS Playground

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

## Introduction

NestJS Playground is a development environment for quickly prototyping, learning, and experimenting with NestJS applications. This environment comes pre-configured with PostgreSQL and Redis, making it perfect for building and testing modern, scalable backend applications.

## Development Environment

This project uses Development Containers to provide a consistent environment for all developers.

- [Dev Container Documentation](./docs/dev-container.md) - Learn about our containerized development setup
- [Documentation Guidelines](./docs/documentation-guidelines.md) - Standards for creating project documentation

## Quick Start Examples

### Creating a New NestJS Controller

```bash
# Generate a new CRUD controller
nest generate controller cats --no-spec

# Generate a resource with CRUD operations
nest generate resource products
```

### Working with Database (TypeORM + PostgreSQL)

```typescript
// Example entity
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
```

### Implementing Caching with Redis

```typescript
// In app.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'redis',
      port: 6379,
    }),
  ],
})
export class AppModule {}

// In a service
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getHello(): Promise<string> {
    const cachedData = await this.cacheManager.get('hello');
    if (cachedData) {
      return cachedData as string;
    }
    
    const result = 'Hello World!';
    await this.cacheManager.set('hello', result, 60000); // 1 minute
    return result;
  }
}
```

## What Can You Build?

This playground is ideal for:

- Building REST APIs
- Experimenting with GraphQL
- Testing microservice architectures
- Learning NestJS fundamentals
- Implementing authentication and authorization
- Practicing database interactions with TypeORM
- Testing caching strategies with Redis

## Getting Started

See our [Development Container Guide](./docs/dev-container.md) for instructions on getting started with this playground.
