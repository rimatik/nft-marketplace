const express = require('express')
const path = require('path')
const footballPlayerDb = require('./src/football-database')
const basketballPlayerDb = require('./src/football-database')

const PORT = process.env.PORT || 5001

const app = express()
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

// Static public files
app.use( function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  express.static(path.join(__dirname, 'public'))
  next();
}
 
  )

app.get('/', function(req, res) {
  res.send('Get ready for OpenSea!');
})

app.get('/api/token/:token_id', function(req, res) {
  const tokenId = parseInt(req.params.token_id).toString()
  const footballPlayer = footballPlayerDb[tokenId];
  const image =  footballPlayer.image;
  const description =  footballPlayer.description;
  const external_url =  footballPlayer.external_url;
  const name =  footballPlayer.name;
  const data = {
    "image": image,
    "description": description,
    "external_url": external_url,
    "name": name
  }
  res.send(data)
})


app.get('/api/football-tokens', function(req, res) {
    const player1 = footballPlayerDb["1"];
    const player2 = footballPlayerDb["2"];
    const player3 = footballPlayerDb["3"];

    let list = [];
    list.push({
      "id": player1.id,
      "image": player1.image,
      "description": player1.description,
      "external_url": player1.external_url,
      "name": player1.name
    });

    list.push({
      "id": player2.id,
      "image": player2.image,
      "description": player2.description,
      "external_url": player2.external_url,
      "name": player2.name
    })
  
    list.push({
      "id": player3.id,
      "image": player3.image,
      "description": player3.description,
      "external_url": player3.external_url,
      "name": player3.name
    })
    
    const data = {
      assets: list
    }

    res.send(data)
})

app.get('/api/basketball-token/:token_id', function(req, res) {
  const tokenId = parseInt(req.params.token_id).toString()
  const basketballPlayer = basketballPlayerDb[tokenId];
  const image =  basketballPlayer.image;
  const description =  basketballPlayer.description;
  const external_url =  basketballPlayer.external_url;
  const name =  basketballPlayer.name;
  const data = {
    "image": image,
    "description": description,
    "external_url": external_url,
    "name": name
  }
  res.send(data)
})


app.get('/api/basketball-tokens', function(req, res) {
    const player1 =  basketballPlayerDb["1"];
    const player2 =  basketballPlayerDb["2"];
    const player3 =  basketballPlayerDb["3"];

    let list = [];
    list.push({
      "id": player1.id,
      "image": player1.image,
      "description": player1.description,
      "external_url": player1.external_url,
      "name": player1.name
    });

    list.push({
      "id": player2.id,
      "image": player2.image,
      "description": player2.description,
      "external_url": player2.external_url,
      "name": player2.name
    })
  
    list.push({
      "id": player3.id,
      "image": player3.image,
      "description": player3.description,
      "external_url": player3.external_url,
      "name": player3.name
    })
    
    const data = {
      assets: list
    }

    res.send(data)
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})

