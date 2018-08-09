const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
var compress_images = require('compress-images'), INPUT_path_to_your_images, OUTPUT_path;
const app = express();
const router = express.Router();

var cors = require('cors');

// use it before all route definitions
app.use(cors());

const DIR = './uploads';
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
  }
});

let upload = multer({storage: storage});
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));
// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4204');
//   res.setHeader('Access-Control-Allow-Methods', 'POST');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
//
// });

app.get('/api', function (req, res) {
  res.end('file catcher example');
});

app.post('/api/upload',upload.single('photo'), function (req, res) {
  if (!req.file) {
    console.log("No file received");
     res.send({
      success: false
    });
  } else {
    console.log('file received');
    compress(req.file.filename,req,res,true);
  }
});

app.use("/upload", express.static(__dirname+ "/uploads"));

// app.get('*', (req, res) => {
//   path.join(__dirname, )
// })


function compress (filepath,req,res,flag) {
  var filename = filepath.split('.jpg');
  INPUT_path_to_your_images = 'uploads/**/'+filename[0]+'.{jpg,JPG,jpeg,JPEG,png,svg,gif}';
  OUTPUT_path = 'uploads/compressed/';
  compress_images(INPUT_path_to_your_images, OUTPUT_path, {compress_force: false, statistic: true, autoupdate: true}, false,
    {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
    {png: {engine: 'pngquant', command: ['--quality=20-50']}},
    {svg: {engine: 'svgo', command: '--multipass'}},
    {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, function(err){
    if(flag) {
      flag=!flag;
      res.send({
        file: req.file.filename,
        success: true
      });
    }
  });
}


const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Node.js server is running on port ' + PORT);
});
