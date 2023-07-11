// routes/user.route.js
import express from 'express';
import multer from 'multer';
import userController from '../controllers/usercontroller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/signup', upload.single('profilePicture'), userController.signUp);
router.get('/getprofile', userController.getProfile);

router.post('/signin', userController.signIn);
router.post('/signout', userController.signOut);
router.get('/profile', userController.getProfile);
router.post('/upload', upload.single('file'), userController.uploadFile);

export default router;
 
