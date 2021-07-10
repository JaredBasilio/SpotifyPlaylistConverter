const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '08156139e78547f08fdf63867fdfb976',
        clientSecret: 'd5272400556e45d8a4af4a47492af0cc',
        refreshToken,
    })

    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.accesstoken,
                expiresIn: data.body.expiresIn
            })
        }).catch(() => {
            res.sendStatus(400)
        })
})

app.post('/login', (req,res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '08156139e78547f08fdf63867fdfb976',
        clientSecret: 'd5272400556e45d8a4af4a47492af0cc'
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken:data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,

        })
    }).catch(err =>{
            res.sendStatus(400)
    })
})

app.listen(3001)