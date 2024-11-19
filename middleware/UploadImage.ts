import { NextFunction,Request,Response } from 'express';
import multer from 'multer';
import path from "path";

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, "../public/uploads");

      console.log("Upload path:", uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = Date.now() + path.extname(file.originalname);
      console.log("Generated filename:", filename);
      cb(null, filename);
    },
  });
  
  // Create Multer instance
  const upload = multer({ storage });
  const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    try{
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(404).json({ error: "Image upload failed", details: err.message });
        console.log(err)
      }     
      next();
    });
}catch(err){
    console.log(err)
}
  };
  export default uploadImage;
