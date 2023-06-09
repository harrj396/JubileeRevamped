// import logo from './logo.svg';
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useEffect, useState } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";


function SearchSpotify() {
  const spotify_client_Id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  const [accessToken, setAccessToken] = useState("")
  const [albums, SetAlbums] = useState([]);
  const authParameters = {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id=' + spotify_client_Id + '&client_secret=' + spotify_client_secret
  }


  function ypp() {
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }

  useEffect(() => {
    ypp();
  });

  // Search function
  async function search() {
    console.log("Searching for " + searchInput);

    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        return data.tracks.items[0].id
      })
    console.log("ID is " + artistID)


    var returnedAlbums = await fetch('https://api.spotify.com/v1/tracks/' + artistID, searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log("trackdata", data.name)
        console.log("URL", data.album.images[0].url);
        SetAlbums(data);
      })

    var returnedAlbums = await fetch(
      "https://api.spotify.com/v1/tracks/" + artistID,
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("trackdata", data.name);
        console.log("URL", data.album.images[0].url);
        SetAlbums(data);
      });
  }
  //  console.log(albums);

  // Page data
  const [searchInput, setSearchInput] = useState("");
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for Artist"
            type="input"
            onKeyPress={event => {
              if (event.key == "Enter") {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Search Artist</Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4 justify-content-center">

          {albums === [] ? (
            <p>enter your search above</p>
          ) : (
            <Card>
              <Card.Img src={albums?.album?.images[0]?.url} />
              <Card.Body>
                <Card.Title>{albums?.name}</Card.Title>
              </Card.Body>
              <Card.Img src={albums?.album?.images[1]?.url} />
              <Card.Body>
                <Card.Title>{albums?.name}</Card.Title>
              </Card.Body>
              <Card.Img src={albums?.album?.images[2]?.url} />
              <Card.Body>
                <Card.Title>{albums?.name}</Card.Title>
              </Card.Body>
            </Card>
            )
            }


        </Row>
      </Container>
    </div>
  );
}




export default SearchSpotify;
