#!/bin/bash
NAME=LAMBDA_FUNCION_NAME
REGION=LAMBDA_REGION
ZIP="../"$NAME".zip"
echo $ZIP
zip -r $ZIP ./

aws lambda update-function-code \
    --region $REGION \
    --function-name $NAME  \
    --zip-file fileb://$ZIP

rm -rf $ZIP
