import { v2 as cloudinary } from 'cloudinary';

/**
 * Connect to Cloudinary
 * This function configures the Cloudinary client using the credentials specified in the environment variables.
 */

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('Connected to Cloudinary');
};

export default connectCloudinary;