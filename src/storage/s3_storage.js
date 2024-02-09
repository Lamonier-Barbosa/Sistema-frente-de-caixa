const s3 = require("./s3_connection");

const uploadFile = async (path, buffer, mimetype) => {
  const arquivo = await s3
    .upload({
      Bucket: process.env.S3_BUCKETNAME,
      Key: path,
      Body: buffer,
      ContentType: mimetype,
    })
    .promise();

  return {
    url: arquivo.Location,
    path: arquivo.Key,
  };
};

const deleteFile = async (path) => {
  await s3.deleteObject({
    Bucket: process.env.S3_BUCKETNAME,
    Key: path
  }).promise();
}

module.exports = { uploadFile, deleteFile };
