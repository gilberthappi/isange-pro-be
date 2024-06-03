/* eslint-disable import/no-extraneous-dependencies */
import multer from 'multer';

export const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'Images/');
  },
  filename(req, file, cb) {
    cb(null, Date.now()+'-'+ file.originalname);
  },
});

const upload = multer({ dest: 'Images/', storage: storage });
 export const uploaded = upload.fields([{name: 'photo', maxCount: 1}, {name: 'documents', maxCount: 8}]);
// export const uploaded = upload.fields([{name: 'photo', maxCount: 1}]);
// export const uploaded = upload.fields([{name: 'documents', maxCount: 1}]);