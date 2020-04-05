let express = require('express')
let request = require('request')
let querystring = require('querystring')

let app = express()
let clientID = '5737379c912a4127bd009ea65f0fa760'
let clientSecret = 'e14ce407075e4dc4b032d54d4178a108'
let redirectUri = 'https://auduo-backend.herokuapp.com/callback'
let frontEnd = 'https://auduo-frontend.herokuapp.com/'


let redirect_uri = 
  'https://auduo-backend.herokuapp.com/callback' || 
  'http://localhost:8888/callback'

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientID,
      scope: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-read-playback-state',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        clientID + ':' + clientSecret
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = 'https://auduo-frontend.herokuapp.com/' || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)