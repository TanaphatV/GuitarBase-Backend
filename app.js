const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

const pgp = require('pg-promise')();
const db = pgp('postgres://guitarbase_user:TekJC4tD3tfYzI4waX1hpnWYmvxoUgNR@dpg-chifrpu7avj2ivcedt30-a/guitarbase');

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const top3Course = [
  { code: "DT160", cname: "C programming", description: "loren ipsum c" },
  { code: "DT161", cname: "C++ programming", description: "loren ipsum +" },
  { code: "DT261", cname: "Data Structures", description: "loren ipsum d" }
];

app.use(cors());
app.use(fileUpload());
app.options('/uploadGuitar', cors());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/top3', (req, res) => {
  res.json(top3Course);
});

app.post('/', (req, res) => {
  res.send('Post request Hello World!');
});

app.get('/Brand', (req, res) => {
  db.any('SELECT "value" FROM public."Brand"')
    .then((data) => {
      //console.log('Brand: ', data);
      res.json(data);
    })
    .catch((error) => {
      console.log('ERROR:', error);
      res.send("ERROR: can't get data");
    });
});

app.get('/BodyShape', (req, res) => {
  db.any('SELECT "value" FROM public."BodyShape"')
    .then((data) => {
     // console.log('BodyShape: ', data);
      res.json(data);
    })
    .catch((error) => {
      console.log('ERROR:', error);
      res.send("ERROR: can't get data");
    });
});

app.get('/Pickup', (req, res) => {
  db.any('SELECT "value" FROM public."Pickup"')
    .then((data) => {
  //    console.log('Pickup: ', data);
      res.json(data);
    })
    .catch((error) => {
      console.log('ERROR:', error);
      res.send("ERROR: can't get data");
    });
});

app.get('/Guitars', (req, res) => {
  let brand = req.query.brand;
  let body = req.query.body;
  let pickup = req.query.pickup;
  if (brand === "none" || brand === "undefined") brand = '"Brand"';//using "Brand"="Brand" in sql will return everything in the column
  if (body === "none"|| body === "undefined") body = '"BodyShape"';
  if (pickup === "none"|| pickup === "undefined") pickup = '"Pickup"';
  const text = 'SELECT * FROM public."Guitar" WHERE "Brand" = \'' + brand + '\' AND "BodyShape" = \'' + body + '\' AND "Pickup" = \'' + pickup + '\'';//single quote encapsulating double quote seems to messup everything
  const sqlText = (text.replace(/"'/g,"\"")).replace(/'"/g,"\"");//the single quote will stackup with the double quote
  console.log(sqlText);

  db.any(sqlText)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log('ERROR:', error);
      res.send("ERROR: can't get data");
    });
});


app.post('/uploadGuitar', (req, res) => {
  const { name, brand, body, pickup, imageUrl } = req.body;

  if (!imageUrl) {
    console.log('No image URL provided');
    res.sendStatus(400);
    return;
  }

  const text = 'INSERT INTO public."Guitar" ("Name", "Brand", "BodyShape", "Pickup", "ImageUrl") VALUES ($1, $2, $3, $4, $5)';
  const values = [name, brand, body, pickup, imageUrl];

  db.none(text, values)
    .then(() => {
      console.log('Guitar data inserted successfully');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error inserting guitar data:', error);
      res.sendStatus(500);
    });
});

app.get('*', (req, res) => {
  res.send("I don't know this request");
});

app.listen(port, () => {
  console.log(`My Example app listening on port ${port}`);
});
