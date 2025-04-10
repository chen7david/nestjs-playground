# Development Container Guide

## Overview

This project uses Development Containers (Dev Containers) to provide a consistent, reproducible development environment for all team members. This document explains what Dev Containers are, how to use them, and details about our specific configuration.

## What is a Dev Container?

A Dev Container is a Docker container specifically configured for development purposes. It includes:

- A runtime environment (Node.js in our case)
- Required tools and dependencies
- Extensions and configurations for your IDE

The main benefit is that everyone on the team works with identical development environments, eliminating "it works on my machine" problems.

## Prerequisites

Before you can use our Dev Container, you'll need:

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
2. [Visual Studio Code](https://code.visualstudio.com/)
3. [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for VS Code

## Getting Started

### Local Development

1. Clone the repository
2. Open the project in VS Code
3. When prompted to "Reopen in Container", click "Reopen in Container"
   - Alternatively, open the Command Palette (F1) and select "Dev Containers: Reopen in Container"
4. Wait for the container to build (this might take a few minutes the first time)

### GitHub Codespaces

1. Navigate to the repository on GitHub
2. Click "Code" > "Codespaces" > "Create codespace on main"
3. Wait for the codespace to initialize

> **Important**: Remember to shut down your codespace when you're not using it to avoid unnecessary charges. Go to [github.com/codespaces](https://github.com/codespaces), select your codespace, and click "Stop codespace".

## Container Configuration

Our Dev Container is defined by three main files:

- `.devcontainer/devcontainer.json`: Configuration for VS Code and the container
- `.devcontainer/Dockerfile`: Definition of the development environment
- `.devcontainer/docker-compose.yml`: Service configuration (app, databases, etc.)

### Installed Packages

Our container includes the following tools:

#### System Packages

- **tree**: Displays directory structure in a tree format
  ```bash
  tree src/ # Shows the structure of the src directory
  ```
- **unzip**: Utility for extracting .zip files (required for AWS CLI installation)

#### Node.js Packages

- **@nestjs/cli**: Command-line interface for NestJS development
  ```bash
  nest new my-project # Create a new NestJS project
  nest generate controller users # Generate a controller
  ```
- **prettier**: Code formatter to ensure consistent style
  ```bash
  prettier --write "src/**/*.ts" # Format all TypeScript files in src directory
  ```
- **prettier-plugin-jsdoc**: Plugin for formatting JSDoc comments consistently
- **eslint**: JavaScript/TypeScript linter to find and fix code problems
  ```bash
  eslint src --fix # Lint and automatically fix issues in src directory
  ```
- **eslint-config-prettier**: ESLint configuration that disables rules that conflict with Prettier

#### Cloud Tools

- **AWS CLI**: Command-line interface for Amazon Web Services
  ```bash
  aws s3 ls # List S3 buckets
  aws configure # Set up AWS credentials
  ```

### Services

Our development environment includes the following services:

#### PostgreSQL

- **Image**: postgres:latest
- **Credentials**:
  - Username: `postgres`
  - Password: `postgres`
  - Database: `postgres`
- **Port**: 5432
- **Data**: Persisted in the `postgres-data` Docker volume

> Note: These credentials are for local development only. Production environments use different, secure credentials.

#### Redis

- **Image**: redis:7-alpine (lightweight version)
- **Configuration**:
  - Save data every 60 seconds if at least 1 key changed
  - Warning-level logging for reduced verbosity
- **Port**: 6379
- **Data**: Persisted in the `redis-data` Docker volume

### Port Forwarding

In Dev Containers, ports are not automatically exposed to your host machine. Instead, they are specified in the `devcontainer.json` file under the `forwardPorts` property. We've configured the following ports:

- 3000: NestJS application
- 5432: PostgreSQL
- 6379: Redis

When using Codespaces, GitHub will create secure URLs for accessing your services.

### VS Code Extensions

Our Dev Container comes with the following VS Code extensions pre-installed:

- **Docker** (ms-azuretools.vscode-docker): Provides commands and features for working with Docker containers and images
- **GitLens** (eamodio.gitlens): Enhances Git capabilities in VS Code with features like blame annotations and code lens

### Features

The Dev Container includes various tools and utilities installed directly in the container environment. For code formatting and linting, Prettier and ESLint are installed globally from the Dockerfile, ensuring consistent code style and quality across the team.

## Data Persistence

All state in the Dev Container is stored in Docker volumes:

- `postgres-data`: Stores PostgreSQL database files
- `redis-data`: Stores Redis data

This means your data will persist even if you rebuild or restart your container. However, if you remove the volumes, your data will be lost.

## NestJS Development with the Container

The container provides everything you need to develop NestJS applications:

```bash
# Create a new module
nest generate module users

# Create a controller
nest generate controller users

# Create a service
nest generate service users

# Create a complete CRUD resource
nest generate resource products
```

### Code Quality Tools

The development environment comes with pre-configured linting and formatting tools:

#### ESLint

ESLint is configured to work with TypeScript and integrated with Prettier to avoid conflicts. The configuration can be found in `.eslintrc.js`.

```bash
# Lint all files in src directory
eslint src

# Lint and automatically fix issues
eslint src --fix
```

#### Prettier

Prettier is set up for consistent code formatting across the project with configurations in `.prettierrc`.

```bash
# Format a specific file
prettier --write src/app.module.ts

# Format all TypeScript files
prettier --write "src/**/*.ts"

# Check if files are formatted correctly (useful in CI)
prettier --check "src/**/*.ts"
```

#### Integration Between ESLint and Prettier

The development environment uses `eslint-config-prettier` to disable ESLint rules that might conflict with Prettier. This setup ensures that:

1. ESLint handles code quality concerns (potential bugs, suspicious patterns)
2. Prettier handles code formatting (spaces, commas, etc.)

This integration ensures there are no conflicting rules, allowing both tools to work together seamlessly.

### Database Connections

When working with databases, configure your NestJS application to connect to the services:

```typescript
// TypeORM PostgreSQL connection in app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'db', // Service name from docker-compose.yml
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [],
  synchronize: true, // Set to false in production
});
```

## Modifying the Dev Container

If you need to modify the Dev Container (e.g., install new tools, add services), please follow these steps:

1. Make the necessary changes to the Dev Container configuration files
2. Rebuild the container to test your changes
3. Document your changes clearly in the pull request
4. Send a memo to the team with a comprehensive list of all updates and their implications

> **Important**: Changes to the Dev Container will affect all developers, so make sure your modifications are necessary and well-communicated.

## Troubleshooting

If you encounter issues with your Dev Container:

1. Try rebuilding the container (F1 > "Dev Containers: Rebuild Container")
2. Check Docker logs for errors
3. Ensure your Docker Desktop has sufficient resources allocated
4. Verify that all required ports are available on your host machine

## Additional Resources

- [Dev Containers documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [GitHub Codespaces documentation](https://docs.github.com/en/codespaces)
- [Docker Compose documentation](https://docs.docker.com/compose/)
- [NestJS documentation](https://docs.nestjs.com/)
