

const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://guitarbase_user:TekJC4tD3tfYzI4waX1hpnWYmvxoUgNR@dpg-chifrpu7avj2ivcedt30-a/guitarbase')
//const db = pgp('postgres://db_486exampledatabase_user:hvTCzmU5PWO2vjLhGo6x5eQuhDNKxEOr@dpg-cghvpno2qv2772ga8bn0-a.singapore-postgres.render.com/db_486exampledatabase')


const bodyParser = require('body-parser')

const top3Course = [{code:"DT160",cname:"C programming", description:"loren ipsum c"},
{code:"DT161",cname:"C++ programming", description:"loren ipsum +"},
{code:"DT261",cname:"Data Structures", description:"loren ipsum d"}]



app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }))

app.use(cors({origin: '*'}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/top3', (req, res) => {
  //res.json({result: top3Course})//select * from public.course order by code limit 3

  res.json(top3Course)
})

app.post('/', (req, res) => {
  res.send('Post request Hello World!')
})

app.get('/Brand', (req, res) => {
  db.any('SELECT "value" FROM public."Brand"')
    .then((data) => {
      console.log('Brand: ', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data ")
    })
})

app.get('/BodyShape', (req, res) => {
  db.any('SELECT "value" FROM public."BodyShape"')
    .then((data) => {
      console.log('BodyShape: ', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data ")
    })
})

app.get('/Pickup', (req, res) => {
  db.any('SELECT "value" FROM public."Pickup"')
    .then((data) => {
      console.log('Pickup: ', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data ")
    })
})

app.post('/uploadGuitar', (req, res) => {
  const { name, brand, body, pickup, imgByte } = req.body;
  const text = 'INSERT INTO public."Guitar" ("Name", "Brand", "BodyShape", "Pickup", "Image") VALUES ($1, $2, $3, $4, $5)';
  const values = [name, brand, body, pickup, imgByte];

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


app.get('/students', (req, res) => {
  db.any('select * from public.student')
    .then((data) => {
      console.log('all student: ', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data")
    })
})


app.get('*', (req, res) => {
  res.send("I don't know this request")
})

app.listen(port, () => {
  console.log(`My Example app listening on port ${port}`)
})