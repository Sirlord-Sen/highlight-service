import { Request } from 'express'
import multer, { diskStorage, FileFilterCallback} from 'multer';

const storage = diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + "_" + file.originalname);
    }
})

const filefilter = (req: Request, file: Express.Multer.File , cb: FileFilterCallback) => {
    if(file.mimetype === 'image/png' || 'image/jpg' || 'image/jpeg`')
        return cb(null, true);
    cb(null, false)    
}

export const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 2
    },
    fileFilter: filefilter
}).single("photo")
