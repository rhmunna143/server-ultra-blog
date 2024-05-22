# project: Ultra Blog
## Live Website: https://ultrablog.vercel.app
## Client-side source code: https://github.com/rhmunna143/client-ultra-blog

Here's a general guide:

1. Clone the repository: Use git to clone the repository to your local machine.
`git clone <repository_url>`

2. Navigate to the project directory: Use the cd command to navigate into the directory that was just cloned.
`cd <project_directory>`

3. Install dependencies: Most Node.js projects will have a package.json file that lists the project's dependencies. Use npm (Node Package Manager) to install these dependencies.
`npm install`

4. Start the server: This step can vary depending on how the project is set up. Many projects will have a start script defined in the package.json file. If this is the case, you can start the server using npm.
`npm start`

5. Access the application: Once the server is running, you can access the application by opening a web browser and navigating to http://localhost:<port>, where <port> is the port number the server is running on. The port number is usually printed to the console when the server starts.

##
Remember to replace <repository_url> and <project_directory> with your specific details.

## Environment

1. Copy the file: Make a copy of the .env file and name it  .env.development or .env.production based on your environment.
`copy .env`

2. Edit the file: Open the new file in your text editor. Replace the values of the variables with your own values. Be sure not to remove the = sign between the variable name and its value.

For example, if you have your own Postgres database, you would replace the POSTGRES_URL line with your own database URL:

`POSTGRES_URL="postgres://youruser:yourpassword@yourhost:yourport/yourdatabase?sslmode=require"`

3. Use the file: In your Node.js code, you can use the dotenv package to load the variables from your .env file.
`require('dotenv').config()`

After this, you can access the variables using process.env.
`const port = process.env.PORT;`

Remember to add your .env.local or .env.development or .env.production to your .gitignore file to prevent it from being committed to your repository. This is important because this file will contain sensitive information such as database passwords and API keys.

5. JWT_SECRET is a secret key used in the process of signing JSON Web Tokens (JWTs).
##
When a JWT is created, it is signed using this secret key. This means that the server can verify that the token is legitimate and hasn't been tampered with when it is returned.
##
The JWT_SECRET should be a long, complex, and unique string that is kept secret. It should not be shared or exposed publicly, as anyone with access to the secret can sign tokens as if they were your server.
##
In your .env file, you should assign a value to JWT_SECRET like so:
`JWT_SECRET=yourSuperSecretKeyHere`
##
Then, in your application, you can access this value with process.env.JWT_SECRET (assuming you're using a package like dotenv to load your .env file).

## Now you are ready to go

##

# Live API's:

1. Posts API

- Base URL: https://server-ultra-blog.vercel.app/api/posts

- Create a New Post
- URL: /
- Method: POST
- Description: Create a new post.
- Request Body: JSON object with title, content, and optionally image_link.
##
- Get All Posts
- URL: /
- Method: GET
- Description: Retrieve all posts.
##
- Get All Posts by the Current User
- URL: /users-post
- Method: GET
- Description: Retrieve all posts authored by the current user.
##
- Get a Single Post
- URL: /:id
- Method: GET
- Description: Retrieve a single post by its ID.
##
- Update a Post
- URL: /:id
- Method: PUT
- Description: Update a post by its ID.
- Request Body: JSON object with title, content, and optionally image_link.
##
- Delete a Post
- URL: /:id
- Method: DELETE
- Description: Delete a post by its ID.
##
2. Authentication (User) API

- Base URL: https://server-ultra-blog.vercel.app/api/auth

- Register User
- URL: /register
- Method: POST
- Description: Register a new user.
- Request Body: JSON object with username, password, full_name, image_link, and email.
##
- Login User
- URL: /login
- Method: POST
- Description: Log in a user.
- Request Body: JSON object with username and password.
##
- Update User
- URL: /update-user/:id
- Method: PUT
- Description: Update user details.
- Request Body: JSON object with newUsername, full_name, image_link, and email.
##
- Logout User
- URL: /logout
- Method: POST
- Description: Log out a user.
##
- Check Login Status
- URL: /check-login
- Method: GET
- Description: Check if a user is logged in.