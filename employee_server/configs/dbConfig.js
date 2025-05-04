import mongoose from 'mongoose';

/**
 * Connect to MongoDB Database
 * This function establishes a connection to the MongoDB database using the URI specified in the environment variables.
 */

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);

        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;