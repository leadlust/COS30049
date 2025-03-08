// Folder Structure
// └─ src
//    ├─ pages
//    │   └─ api       // API Routes
//    ├─ models       // Mongoose Models
//    ├─ utils        // Utility Functions
//    └─ config       // Database Configuration

// 1. Install Dependencies
// npm install mongoose jsonwebtoken bcryptjs nodemailer

// 2. Database Configuration (src/config/db.js)

// Import the Mongoose library, which is an ODM (Object Data Modeling) library for MongoDB and Node.js
import mongoose from 'mongoose';

// Define an asynchronous function to establish a connection to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string stored in the environment variable MONGO_URI
    await mongoose.connect(process.env.MONGO_URI, {
      // Use the new URL parser to avoid deprecation warnings
      useNewUrlParser: true,
      // Use the unified topology engine for better connection management and performance
      useUnifiedTopology: true,
    });
    // Log a success message to the console if the connection is established
    console.log('MongoDB Connected');
  } catch (error) {
    // If an error occurs during connection, log the error details to the console
    console.error('Database Connection Error:', error);
    // Exit the Node.js process with a failure status code (1) to indicate an error
    process.exit(1);
  }
};

// Export the connectDB function as the default export so it can be imported and used elsewhere
export default connectDB;