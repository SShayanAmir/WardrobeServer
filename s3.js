const aws = require('aws-sdk')
const {crypto, randomBytes} = require("crypto")
const promisify = require("util")

require("dotenv").config();

const region ="ap-northeast-1"
const bucketName = "wardrobe-pk"
const accessKeyId = `${process.env.AWS_ACCESS_KEY}`
const secretAccessKey = `${process.env.AWS_SECRET_ACCESS_KEY}`

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

const generateUploadURL = async () => {
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}

module.exports = {generateUploadURL}