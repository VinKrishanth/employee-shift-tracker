import multer from 'multer';

// Configure Multer storage
const storage = multer.diskStorage({}); 
const upload = multer({ storage });

export default upload; 