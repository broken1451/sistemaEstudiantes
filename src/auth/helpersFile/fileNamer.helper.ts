import { Request } from "express";
import { v4 as uuid } from 'uuid';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import * as FileSystem from 'fs';
import { promisify } from "util";

// export const fileFilter = (res: Request, ) => {
export const fileNamer = async (req: any, file: Express.Multer.File, callback: Function) => {
  
    if (!file) {
        return callback(new Error('File is emty'), false);
    }

    const fileExtension = file.mimetype.split('/')[1]
    // let filename = `${uuid()}.${fileExtension}`;
    let filename = `${req.params.id}.${fileExtension}`;

    callback(null, filename);
}