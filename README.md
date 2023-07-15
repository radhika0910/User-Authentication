# User Authentication 

This is a server-side application built using Node.js and Express. It provides API endpoints for user authentication and protected routes.

## Prerequisites

- Node.js and npm should be installed on your machine.
- MongoDB should be installed and running.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git

2. Install the dependencies:
   
   ```bash
   cd your-repo
   npm install
   
3.Set up environment variables:

Create a .env file in the root directory of your project.
Add the following environment variables to the .env file:

  ```
        MONGODB_URI=mongodb+srv://<username>:<password>@your-mongodb-uri
        SECRET_KEY=your-secret-key
```


Replace <username>, <password>, and your-mongodb-uri with your MongoDB Atlas credentials. The MONGODB_URI variable holds the connection string for your MongoDB database, and the SECRET_KEY variable is used for token generation and verification.

Start the server:
```
npm start
```
The server will start running on http://localhost:3000.
# API Endpoints
### POST /api/login
Endpoint for user authentication. It expects the following JSON payload:
```
{
  "username": "your-username",
  "password": "your-password"
}
```
It will return a JSON response containing the authentication token if the login is successful.
### Explanation:
   This endpoint handles user authentication. The provided username and password are validated against the stored user credentials in the MongoDB database. If the authentication is successful, a JSON response containing an authentication token is returned.



   ## Customization
**Routes:** You can customize the routes in the `routes/user.route.js` file to add or modify the endpoints. These routes handle user-related operations such as signup, signin, signout, and profile.

**User Schema** : The user schema is defined in the `models/user.schema.js `file. You can modify it according to your requirements to include additional user fields or validation rules.

**Controller Functions**: The controller functions for user signup, signin, signout, and profile are defined in the `controllers/user.controller.js file`. You can customize them as needed to implement additional business logic or integrate with other services.


## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.
