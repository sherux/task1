const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
require("dotenv").config();
const uniqid = require("uniqid");

// ------------------------------file upload on aws s3---------------------

const accessKeyId = process.env.AWS_ID;
const secretAccessKey = process.env.AWS_SECRET;
const bucketName = process.env.AWS_BUCKET;

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
});

const path = uniqid();

exports.uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: bucketName,

    metadata: function (req, file, cb) {
      cb(null, { fieldName: path });
    },
    key: function (req, file, cb) {
      cb(null, path + "." + file.originalname.split(".")[1]);
    },
  }),
});

