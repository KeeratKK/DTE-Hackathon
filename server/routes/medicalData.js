import { S3Client } from "@aws-sdk/client-s3";
import {v4 as uuidv4} from "uuid";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import createPatient from "../controllers/medicalDataController.js";

dotenv.config();

const medicalRouter = express.Router();

const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
});

const upload = multer({

    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const fileExt = path.extname(file.originalname);
            cb(null, `${uuidv4()}${fileExt}`);
        },
    })

});

medicalRouter.post('/', upload.single('pdfFile'), createPatient);

export default medicalRouter;