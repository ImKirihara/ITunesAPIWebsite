//Makes The Buttons In The Search Table
function makeButtons() {
  let addToPlaylistButtons = document.querySelectorAll('.addToPlaylist');
  addToPlaylistButtons.forEach(button => {

    const artist = button.getAttribute('data-artist');
    const track = button.getAttribute('data-track');
    const artwork = button.getAttribute('data-artwork');
    const trackId = button.getAttribute('data-trackId');

    button.addEventListener('click', () => {
      addToPlaylist(artist, track, artwork, trackId);
    });

  });
}

function makeRemoveButtons() {
  let addToPlaylistButtons = document.querySelectorAll('.removeFromPlaylist');
  addToPlaylistButtons.forEach(button => {
    const trackId = button.getAttribute('data-trackId');

    button.addEventListener('click', () => {
      console.log(trackId)
      removeFromPlaylist(trackId);
    });

  });
}


//Makes The Song Search Overlay
function makeMainButtons() {
  let submitButton = document.querySelectorAll('.submitButton');
  submitButton.forEach(button => {
  button.addEventListener('click', getSong);
  //button.addEventListener('keyup', handleKeyUp)
  });
}

function makeAdminButton(){
  let submitButton = document.querySelectorAll('.adminstuff');
  submitButton.forEach(button => {
    button.addEventListener('click', getUsers);
  });
}

function makeAdminBack(){
  let submitButton = document.querySelectorAll('.adminButton');
  submitButton.forEach(button => {
    button.addEventListener('click', createSongSearch);
  });
}

//Makes The Table for Song Search
function generateTable(data) {
  ////https://www.w3schools.com/tags/att_data-.asp
  let table = '<table border="1">';
  //Headers
  table += '<thead><tr><th>Actions</th><th>Artist</th><th>Title</th><th>Artwork</th></tr></thead>';

  //Body
  table += '<tbody>';
  data.results.forEach(results => {
      table += `<tr>
          <td><button class="addToPlaylist" data-artist="${results.artistName}" data-track="${results.trackName}" data-artwork="${results.artworkUrl100}" data-trackId="${results.trackId}"> <p> &#x2795; </p> </button></td>
          <td>${results.artistName}</td>
          <td>${results.trackName}</td>
          <td><img src="${results.artworkUrl100}" alt="Artwork" width="100"></td>
      </tr>`;
  });
  table += '</tbody></table>';
  return table;
}

function generatePlaylistTable(data) {
  ////https://www.w3schools.com/tags/att_data-.asp
  let table = '<table border="1">';
  //Headers
  table += '<thead><tr><th>Actions</th><th>Artist</th><th>Title</th><th>Artwork</th></tr></thead>';

  //Body
  table += '<tbody>';
  data.forEach(results => {
      table += `<tr>
          <td><button class="removeFromPlaylist" data-artist="${results.artist}" data-track="${results.title}" data-artwork="${results.artwork}" data-trackId="${results.trackId}"> <p> &#x2796; </p> </button></td>
          <td>${results.artist}</td>
          <td>${results.title}</td>
          <td><img src="${results.artwork}" alt="Artwork" width="100"></td>
      </tr>`;
  });
  table += '</tbody></table>';
  return table;
}

function generateUserData(data){
  document.body.innerHTML = '';
  let table = '<table border="1">';
  //Headers
  table += '<thead><tr><th>Username</th><th>Password</th><th>Role</th></tr></thead>';
  //Body
  table += '<tbody>';
  data.forEach(results => {
      table += `<tr>
          <td>${results.userid}</td>
          <td>${results.password}</td>
          <td>${results.role}</td>
      </tr>`;
  });
  table += '</tbody></table>';
  table += '<button class="adminButton" style="margin-bottom: 50px;">Go Back</button>'
  document.body.innerHTML = table;
  makeAdminBack()
}

function createSongSearch() {
  document.body.innerHTML = '';

  const htmlString = `
<!DOCTYPE html>
<html lang="en">

<head>
  <title></title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="styles/styles.css">
  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
</head>

<style>
  .container {
      display: flex;
      flex-direction: column;
      align-items: center;
  }

  table {
      border-collapse: collapse;
      width: 100%;
  }

  th,
  td {
      padding: 8px;
      text-align: left;
  }

  th {
      border-right: 1px solid black;
      border: 1px solid black;
  }

  th {
      background-color: #f2f2f2;
  }
</style>

<body>
  <div class="container">
      <div class="wrapper">
          <h2>Playlist:</h2>

          <table id="playlistTable" border="1">
          <div id="playlistTable"></div>
          </table>

          <h2>Enter Song Title:</h2>
          <input type="text" id="song" />
          <button class="submitButton" style="margin-bottom: 50px;">Submit</button>

          <h2 id="searchHeading">Songs matching:</h2>
          <div id="songdetails"></div>
          <div id="adminbutton"></div>
          <div id="admincontent"></div>
      </div>
  </div>
</body>
</html>`;
  document.body.innerHTML = htmlString;

  makeMainButtons()
  displayPlaylist()
  if (getIsAdmin()) {
    let adminButton = document.getElementById('adminbutton')
    adminButton.innerHTML += `<button class="adminstuff"> <p> Admin Button </p> </button>`
    makeAdminButton();
  }

  
}