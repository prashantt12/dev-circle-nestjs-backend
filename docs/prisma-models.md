# Prisma Models Documentation

## User Model

The User model represents application users.

- **Relationships:**
  - **One-to-Many with Post**: A user can create multiple posts (`posts` field)
  - **One-to-Many with Comment**: A user can create multiple comments (`comments` field)
  - **One-to-Many with Like**: A user can like multiple posts (`likes` field)

## Post Model

The Post model represents blog posts or content entries.

- **Relationships:**
  - **Many-to-One with User**: Each post belongs to a single user (`user` field)
  - **One-to-Many with Comment**: A post can have multiple comments (`comments` field)
  - **One-to-Many with Like**: A post can have multiple likes (`likes` field)
  - **Many-to-Many with Tag**: A post can have multiple tags, and tags can be applied to multiple posts (`tags` field using the "PostTags" relation)

## Comment Model

The Comment model represents user comments on posts.

- **Relationships:**
  - **Many-to-One with Post**: Each comment belongs to a single post (`post` field)
  - **Many-to-One with User**: Each comment is created by a single user (`user` field)

## Like Model

The Like model represents a user liking a post.

- **Relationships:**
  - **Many-to-One with Post**: Each like is associated with a single post (`post` field)
  - **Many-to-One with User**: Each like is created by a single user (`user` field)

## Tag Model

The Tag model represents categories or labels that can be applied to posts.

- **Relationships:**
  - **Many-to-Many with Post**: A tag can be applied to multiple posts, and posts can have multiple tags (`posts` field using the "PostTags" relation) 