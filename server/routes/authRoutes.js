import express from 'express';
import cors from 'cors';
import { test, registerUser, loginUser, getProfile, logoutUser } from '../controllers/authController.js';  // Use import
import { getFhirReferenceByUserId } from '../controllers/infoController.js';

const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

router.get('/', test);
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.get('/logout', logoutUser);
router.post('/getfhir', getFhirReferenceByUserId);


export default router;
