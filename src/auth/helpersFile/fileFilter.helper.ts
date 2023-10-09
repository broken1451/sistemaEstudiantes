import { Request } from "express";


// export const fileFilter = (res: Request, ) => {
export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    
    if (!file) {
        return callback(new Error('File is emty'), false);
    }
  
    const fileExtension = file.mimetype.split('/')[1]
    const validExt = ['jpg', 'jpeg', 'png', 'gif']
    if (validExt.includes(fileExtension)) {
        return callback(null, true);
    }
    
    // callback(null, aceptamos el archivo); // ejecuta el callback
    callback(null, false);
}