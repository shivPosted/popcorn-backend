# Popcorn Backend

This is the backend for the Popcorn application, a platform for users to discover, rate, and discuss movies.

## Features

- User authentication (registration, login) with JWT.
- Movie browsing and searching.
- Movie rating and reviews.
- Image uploads using Multer and Cloudinary.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/popcorn-backend.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd popcorn-backend
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
PORT=8000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_NAME=popcorn

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
```

## Running the Application

- To run the application in development mode (with hot-reloading):
  ```bash
  npm run dev
  ```
- To run the application in production mode:
  ```bash
  npm start
  ```

The application will be available at `http://localhost:8000`.

## API Endpoints

### User Routes

- `POST /api/v1/users/register`: Register a new user.
- `POST /api/v1/users/login`: Log in a user.
- `POST /api/v1/users/logout`: Log out a user.

### Movie Routes

- `GET /api/v1/movies`: Get a list of all movies for the user.
- `DELETE /api/v1/movies/delete`: Delete a particular movie for the user from wathclist.
- `POST /api/v1/movies/addMovie`: Add a particular movie to user wathlist based on user rating.

## Dependencies

### Production Dependencies

- `bcrypt`: For hashing passwords.
- `cloudinary`: For image uploads.
- `cookie-parser`: For parsing cookies.
- `cors`: For enabling Cross-Origin Resource Sharing.
- `dotenv`: For loading environment variables.
- `express`: Web framework for Node.js.
- `jsonwebtoken`: For creating and verifying JSON Web Tokens.
- `mongoose`: MongoDB object modeling tool.
- `multer`: For handling multipart/form-data (file uploads).
- `streamifier`: For creating a readable stream from a buffer.

### Development Dependencies

- `nodemon`: For automatically restarting the server during development.

## Copyright

© 2025 Shiv Pratap Singh
