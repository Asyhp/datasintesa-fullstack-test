const express = require('express');
const app = express();
const PORT = 4000
const mongoose = require('mongoose');
const path = require('path')
const csv = require('csvtojson');
const bodyParser = require('body-parser');
const multer = require('multer');
const csvSchema = require('./model/csvSchema');

//connect db
mongoose.connect('mongodb://127.0.0.1:27017/datasintesa', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('connected to db')).catch((error) => console.log(error))

app.set('view engine', 'ejs');
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploads = multer({ storage: storage})

app.get('/', (req, res) => {
    csvSchema.find((err, data) => {
        if (!data) {
            console.log('nggak ada data nih')
        } else {
            res.render('demo',{data})
        }
    })
});

let temp

app.post('/', uploads.single('csv'), (req, res) => {
    csv().fromFile(req.file.path).then((jsonObj) => {
        console.log(jsonObj);
        for( let i=0; i<jsonObj; i++){
            temp = parseFloat(jsonObj[i].availDur)
            jsonObj[i].availDur = temp;
        }
        csvSchema.insertMany(jsonObj, (err, data) => {
            if (err){
                console.log(err)
            } else {
                res.redirect('/')
            }
        })
    })
});

app.listen(PORT, () => {
    console.log(`app listening on http://localhost:${PORT}`)
});