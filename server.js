const express = require('express');
const path = require('path');
const app = express();
const basicAuth = require('express-basic-auth');
const cookieParser = require('cookie-parser')

const auth = basicAuth({
  users: {
    admin: '123',
    user: '456',
  },
});
const PORT = process.env.PORT || 5000;
app.use(cookieParser('82e4e438a0705fabf61f9854e3b575af'));

app
  .use(express.static(path.join(__dirname, '/app-client/build')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/app-client/build/index.html'));
});
// End-point on Server

app.get('/authenticate', auth, (req, res) => {
  const options = { httpOnly: true, signed: true};
  console.log(req.auth.user);
  if (req.auth.user === 'admin') {
    //res.send('admin');
    res.cookie('name','admin', options).send({screen: 'admin'});
  } else if (req.auth.user === 'user') {
    //res.send('user');
    res.cookie('name', 'user', options).send({screen: 'user'});
  }
});

app.get('/read-cookie',(req,res) => {
  console.log(req.signedCookies);
  if (req.signedCookies.name === 'admin'){
      res.send({screen: 'admin'});
  } else if (req.signedCookies.name === 'user'){
    res.send({screen: 'user'});
  } else{
    res.send({screen: 'auth'});
  }
});
app.get('/clear-cookie',(req,res) => {
    res.clearCookie('name').end();
});

app.get('get-data',(req, res) =>{
    if(req.signedCookies.name === 'admin'){
      res.send('this is admin panel');
    } else if(req.signedCookies.name === 'admin'){
      res.send('this is user panel');
    } else {
      res.end();
    }
});
// Request on Client

