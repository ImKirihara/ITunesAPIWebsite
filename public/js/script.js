var sqlite3 = require('sqlite3').verbose() //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/playlistDatabase.db')
var currentUsername;
var currentPassword;
var isAdmin = false;

exports.index = function (request, response){
    response.render('register');
}

//Signs User Into Website
function signIn() {
  let uid = document.getElementById('username').value
  let pword = document.getElementById('password').value
  let xhr = new XMLHttpRequest()

  //Posts to /checkData in server.js
  xhr.open('POST', '/checkData');
  xhr.setRequestHeader('Content-Type', 'application/json');
  var userData = {username: uid, password: pword}

  //Gets INTEGER from /checkData in server.js
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let response = JSON.parse(xhr.responseText)
        if (response == 1){
          currentUsername = uid
          currentPassword = pword
          isAdmin = false
          createSongSearch()

        }else if (response == 2) {
          currentUsername = uid
          currentPassword = pword
          isAdmin = true
          createSongSearch()
          
        } else {
          alert("Error: Invalid Login")
        }
    }
  }

  xhr.send(JSON.stringify(userData));
}

//Register User Into Website
function register() {
  let uid = document.getElementById('username').value
  let pword = document.getElementById('password').value

  if (uid == '' || pword == ''){
    alert("Please Enter Username and Password")
    return;
  }

  let xhr = new XMLHttpRequest()
  //POSTS userData to server.js
  xhr.open('POST', '/insertData');
  xhr.setRequestHeader('Content-Type', 'application/json');
  var userData = {username: uid, password: pword}

  //GETS Username and Password if valid
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let response = JSON.parse(xhr.responseText)
        currentUsername = response[0]
        currentPassword = response[1]
        createSongSearch()
    }
  }

  xhr.send(JSON.stringify(userData));

}

//Gets Song From ITunesAPI
function getSong() {
    let oldsongName = document.getElementById('song').value
    let songName = oldsongName.replaceAll(" ","+")
    if(songName === '') {
        return alert('Please enter a song')
    }

    let songDiv = document.getElementById('songdetails')
    
    songDiv.innerHTML = ''

    let xhr = new XMLHttpRequest()

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
      searchHeading.textContent = `Songs matching: ${oldsongName}`
 			songDiv.innerHTML = generateTable(response);
      makeButtons();
        }
    }
    xhr.open('POST', `/songs?title=${songName}`, true)
    xhr.send()


}

function getUsers(){
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
          let response = JSON.parse(xhr.responseText)
          generateUserData(response)
      }
  }
  xhr.open('POST', '/getUsers', true)
  xhr.send()

}

//Adds To Playlist
function addToPlaylist(artistName, trackName, artworkUrl, trackId) {
  // Use the retrieved data attributes as needed
  
  let xhr = new XMLHttpRequest()
  //POSTS userData to server.js
  xhr.open('POST', '/insertSong');
  xhr.setRequestHeader('Content-Type', 'application/json');
  var songInfo = {username: currentUsername, artist: artistName, track: trackName, art: artworkUrl, trackId: trackId}

  //GETS true if Insert was successful if so Print Image (Should always work even with Dupes)
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        displayPlaylist()    
    }
  }

  xhr.send(JSON.stringify(songInfo));
}

function removeFromPlaylist(trackId){
  let Playlist = document.getElementById('playlistTable')

  let xhr = new XMLHttpRequest()

  xhr.open('POST', '/removeData');
  xhr.setRequestHeader('Content-Type', 'application/json');
  var trackId = {trackId: trackId, username: currentUsername}

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          let response = JSON.parse(xhr.responseText)
 			    Playlist.innerHTML = generatePlaylistTable(response);
          makeRemoveButtons();
      }
    }
  xhr.send(JSON.stringify(trackId))
}

//Displays Playlist
function displayPlaylist(){
  let Playlist = document.getElementById('playlistTable')

  let xhr = new XMLHttpRequest()

  xhr.open('POST', '/displaySongs');
  xhr.setRequestHeader('Content-Type', 'application/json');
  var userInfo = {username: currentUsername}

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          let response = JSON.parse(xhr.responseText)
 			    Playlist.innerHTML = generatePlaylistTable(response);
          makeRemoveButtons();

      }
    }
  xhr.send(JSON.stringify(userInfo))
}

function getIsAdmin(){
  return isAdmin
}
