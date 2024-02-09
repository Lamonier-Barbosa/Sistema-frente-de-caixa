const aws = require("aws-sdk");

const endpoint = new aws.Endpoint(process.env.S3_ENDPOINT);

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.S3_KEYID,
    secretAccessKey: process.env.S3_APPKEY,
  },
});

module.exports = s3;
