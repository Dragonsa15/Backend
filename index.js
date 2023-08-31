const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { MongoClient, ServerApiVersion } = require('mongodb');
const { kMaxLength } = require("buffer");
const mongoose = require("mongoose");

const imageSchema = require('./models/Image'); 

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });


const uri = "mongodb+srv://admin:testing123@image-catalog.f3kizhp.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(uri, {
        useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

connectDB();


app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
        console.log(req.file.path)
        var img = fs.readFileSync(req.file.path);
        var encode_img = img.toString('base64');
        var final_img = {
            contentType: req.file.mimetype,
            image: Buffer.from(encode_img,'base64')
        };

        console.log(final_img)
        console.log(req.body)
        const metadata = JSON.parse(JSON.stringify(req.body)); // Assuming metadata is sent as JSON in the request body

        const newImage = new imageSchema({
            contentType: final_img.contentType,
            data: final_img.image,
            title: metadata.title,
            Favourite: metadata.Favorite
        });
        console.log(newImage)

        newImage.save()
            .then((item,err)=> {
                if(err) {
                    console.log(err)
                    res.status(500).send(err)
                }
                else {
                    res.status(201).send('Image and metadata saved successfully');
        
                }
            })
        } 
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});


app.get("/api/images", (req, res) => {
    imageSchema.find({})
    .then((err, images) => {
        if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
        } else {
            res.send({ images: images });
        }
    });
});



app.listen(5000, () => {
  console.log("Server is listening on Port 5000");
});