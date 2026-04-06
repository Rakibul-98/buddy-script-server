# Buddy Script Backend

## Project Overview

This repository contains the backend services for the Buddy Script application, a social media-like platform designed to facilitate user interaction through posts, comments, and likes. Developed as part of a Full Stack Engineer selection task, this backend provides a robust and scalable foundation for the frontend application, handling user authentication, content management, and social engagement features.

## Features

The Buddy Script Backend offers the following core functionalities:

- **User Authentication & Authorization**: Secure registration and login using email/password, with support for JWT-based authentication. Includes Google OAuth for seamless sign-in.
- **User Management**: Handles user profiles, including first name, last name, and email.
- **Post Management**: Users can create, retrieve, update, and delete posts. Posts can include text and an optional image.
- **Post Visibility**: Supports both public posts (visible to all users) and private posts (visible only to the author).
- **Like System**: Users can like and unlike posts and comments. The system tracks who has liked a specific item.
- **Commenting & Reply System**: Users can add comments to posts and reply to existing comments, creating threaded conversations.
- **Image Upload**: Integration with Cloudinary for efficient image storage and delivery.
- **Scalable Database Design**: Utilizes PostgreSQL with Prisma ORM, designed to handle millions of posts and reads with proper indexing and cascade delete functionalities.

## Tech Stack

The backend is built using a modern and efficient tech stack:

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT), Bcrypt for password hashing, Google OAuth
- **Image Storage**: Cloudinary
- **Validation**: Zod

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Cloudinary account
- Google Cloud Project for OAuth credentials

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd buddy-script-server
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    NODE_ENV=development
    PORT=5000
    DATABASE_URL="your_postgresql_database_url"
    FRONTEND_URL="http://localhost:3000" # Or your frontend\'s deployed URL

    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=7d

    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

    **Note**: Replace placeholder values with your actual credentials.

4.  **Run Prisma migrations:**

    ```bash
    npx prisma migrate dev --name init
    ```

### Running the Application

To start the development server:

```bash
npm run dev
# or yarn dev
```

The server will run on `http://localhost:5000` (or the `PORT` specified in your `.env` file).

## API Endpoints

The API is structured under the `/api/v1` prefix. Key modules and their endpoints include:

- **Authentication (`/api/v1/auth`)**:
  - `POST /register`: Register a new user.
  - `POST /login`: Log in an existing user.
  - `POST /google`: Google OAuth login/registration.

- **Posts (`/api/v1/posts`)**:
  - `POST /`: Create a new post (requires authentication, supports image upload).
  - `GET /`: Retrieve all posts (requires authentication).
  - `GET /:id`: Retrieve a single post by ID (requires authentication).
  - `PATCH /:id`: Update a post by ID (requires authentication).
  - `DELETE /:id`: Delete a post by ID (requires authentication).

- **Comments (`/api/v1/comments`)**:
  - `POST /`: Create a new comment (requires authentication).
  - `GET /post/:postId`: Retrieve comments for a specific post (requires authentication).
  - `PATCH /:id`: Update a comment by ID (requires authentication).
  - `DELETE /:id`: Delete a comment by ID (requires authentication).

- **Likes (`/api/v1/likes`)**:
  - `POST /toggle`: Toggle like status for a post or comment (requires authentication).

## Database Schema

The database schema is managed using Prisma and includes the following key models:

- **User**: Stores user information (first name, last name, email, password hash) and manages relationships with posts, comments, and likes.
- **Post**: Represents a user\'s post, including content, optional image URL, author, and visibility (`PUBLIC` or `PRIVATE`).
- **Comment**: Represents a comment on a post, supporting threaded replies via a `parentId` field.
- **Like**: Records likes on posts or comments, linking to the user and the target item.

All models include `createdAt` and `updatedAt` timestamps.

## Deployment

The frontend application is deployed on Vercel. The backend can be deployed to any cloud platform that supports Node.js applications and PostgreSQL databases, such as Vercel, Render, or AWS.

## License

This project is licensed under the ISC License.
