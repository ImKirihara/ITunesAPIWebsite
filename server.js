const express = require('express');
const http = require('http');
var path = require('path');
const PORT = process.env.PORT || 3000;
const routes = require('./public/js/script')
const sqlite3 = require('sqlite3').verbose() //verbose provides more detailed stack trace
const db = new sqlite3.Database('data/playlistDatabase.db')

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //use hbs handlebars wrapper

// Middleware
app.use(express.static(__dirname + '/public')); // Serve static files
app.use(express.json());

// Define routes
app.get('/', routes.index);

app.post('/checkData', (req, res) => {
  let loginType = 0;
  //0 = Invalid, 1 = Guest, 2 = Admin
  let username = req.body.username;
  let password = req.body.password;
  db.all("SELECT userid, password, role FROM users", function(err, rows){
    for(var i=0; i<rows.length; i++){
      if(rows[i].userid == username & rows[i].password == password) {
        authorized = true;
        if (rows[i].role == 'admin'){
          loginType = 2
          break;
        } else {
          loginType = 1
          break;
        }

      }
    }
    res.json(loginType)
  });
  
});

app.post('/insertData', (req, res) => {
  let inUse = false;
  let username = req.body.username;
  let password = req.body.password;
  db.all("SELECT userid FROM users", function(err, rows){
    for(var i=0; i<rows.length; i++){
      if(rows[i].userid == username){
        console.log('Error: Username Is Already In Use');
        inUse = true
        break
      }
    }
    if (inUse === false){
      let userInfo = []
      userInfo[0] = username
      userInfo[1] = password
      const sql = "INSERT INTO users values (?,?, 'Guest')"
      db.run(sql, userInfo,)
      console.log("Inserted: " + userInfo)
      res.json(userInfo)
    }
  });
});

app.post('/getUsers', (req, res) =>{
  db.all("SELECT * FROM USERS", function(err, rows){
    res.json(rows)
  });
});

app.post('/removeData', (req, res) => {
  let username = req.body.username
  let trackId = req.body.trackId
  db.run("DELETE FROM playlist WHERE trackId = ?", trackId)

  db.all("SELECT * FROM playlist WHERE userid = ?", (username), function(err, rows){
    res.json(rows)
  });
});

app.post('/insertSong', (req, res) => {
  let username = req.body.username;
  let artist = req.body.artist;
  let track = req.body.track;
  let art = req.body.art;
  let trackId = req.body.trackId;

  db.all("SELECT * FROM playlist", function(err, rows){
      let userInfo = []
      userInfo[0] = username
      userInfo[1] = artist
      userInfo[2] = track
      userInfo[3] = art
      userInfo[4] = trackId
      const sql = "INSERT INTO playlist values (?,?,?,?,?)"
      db.run(sql, userInfo,)
      console.log("Song Info: " + userInfo)
      res.json(true)
  });
});

app.post('/displaySongs', (req, res) => {
  let username = req.body.username

  console.log(username)
  db.all("SELECT * FROM playlist WHERE userid = ?", (username), function(err, rows){
    res.json(rows)
  });
});

app.post('/songs', (req, res) => {
  let titleWithPlusSigns = req.query.title ? req.query.title.replaceAll(" ", "+") : null;
  console.log(titleWithPlusSigns);
  if (!titleWithPlusSigns) {
    res.json({ message: 'Please enter a song title' });
    return;
  }

  let options = {
    method: 'GET',
    hostname: 'itunes.apple.com',
    port: null,
    path: `/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=3`,
    headers: {
      'useQueryString': true
    }
  };

  http.request(options, function(apiResponse) {
    let songData = '';
    apiResponse.on('data', function(chunk) {
      songData += chunk;
    });
    apiResponse.on('end', function() {
      res.contentType('application/json').json(JSON.parse(songData));
    });
  }).end();
});


app.listen(PORT, err => {
  if (err) console.log(err);
  else {
    console.log(`Server listening on port: ${PORT}`);
    console.log(`To Test:`);
    console.log(`http://localhost:3000/songs?title=Body+And+Soul`);
    console.log(`http://localhost:3000`);
  }
});
