const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const util = require('util');
const fs = require('fs');
const HummusRecipe = require('hummus-recipe');

exports.handler = (event, context, callback) => {

    const bucket = undefined;
    const key = `${(Date.now()).toString()}.pdf`;
    const filePath = `/tmp/${key}`;

    const pdfDoc = new HummusRecipe('new', filePath, {
        version: 1.6,
        author: 'John Doe',
        title: 'Hummus Recipe',
        subject: 'A brand new PDF'
    });

    pdfDoc
        // 1st Page
        .createPage('letter-size')
        .circle('center', 100, 30, { stroke: '#3b7721', fill: '#eee000' })
        .polygon([
            [50, 250],
            [100, 200],
            [512, 200],
            [562, 250],
            [512, 300],
            [100, 300],
            [50, 250]
        ], {
            color: [153, 143, 32],
            stroke: [0, 0, 140],
            fill: [153, 143, 32],
            lineWidth: 5
        })
        .rectangle(240, 400, 50, 50, {
            stroke: '#3b7721',
            fill: '#eee000',
            lineWidth: 6,
            opacity: 0.3
        })
        .moveTo(200, 600)
        .lineTo('center', 650)
        .lineTo(412, 600)
        .text('Welcome to Hummus-Recipe', 'center', 250, {
            color: '066099',
            fontSize: 30,
            font: 'Courier New',
            align: 'center center'
        })
        .comment('Feel free to open issues to help us!', 'center', 100)
        .endPage()
        // 2nd page
        .createPage('A4', 90)
        .circle(150, 150, 300)
        .endPage()
        // end and save
        .endPDF(() => {
            console.log(fs.existsSync(filePath));
            if (!bucket) {
                callback(null, { filePath });
            } else {
                const fileStream = fs.createReadStream(filePath);
                fileStream.on('error', callback);
                return s3.putObject({
                        Bucket: bucket,
                        Key: key,
                        Body: fileStream,
                        ContentType: 'application/pdf'
                    }).promise()
                    .then(() => {
                        callback(null, { bucket, filePath });
                    })
                    .catch(callback);
            }
        });
};
