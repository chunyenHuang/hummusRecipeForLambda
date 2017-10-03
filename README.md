# Hummus Recipe for Lambda

## Lambda Settings

### Function Code

- Code entry type: Upload a .ZIP file
- Runtime: Node.js 6.10
- Handler: index.handler

### Basic Settings

It is always good to set the memory to 1536 MB(XD). Also remember to increase the timeout to 5 min.

### Execution Role

To use S3, you will need to create a execution role with the correct permission.

### Triggers and Data

Lambda has the size limit for incoming payload, so I recommend to put your pdf files to a s3 bucket, 
and just pass the bucket name and key to your Lambda function. You can use `S3.getObject` to retrieve the pdf file and save it to `/tmp`. Dont forget to remove the file at the end.

## Update Function

`deploy.sh`

```bash
#!/bin/bash
NAME=LAMBDA_FUNCION_NAME
REGION=
ZIP="../"$NAME".zip"
echo $ZIP
zip -r $ZIP ./

aws lambda update-function-code \
    --region $REGION \
    --function-name $NAME  \
    --zip-file fileb://$ZIP

rm -rf $ZIP
```

## Hummus in Lambda

You will need to use prebuilt version or build your own on EC2 and match the lambda version
For current Lambda version, you can use the following link:
[Hummus Prebuilt 48](https://hummus.s3-us-west-2.amazonaws.com/hummus/v1.0.82/node-v48-linux-x64.tar.gz)