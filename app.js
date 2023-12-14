const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const path=require('path')
app.use(express.static("views"))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
const userDB = {
  email: 'nishad@gmail.com',
  password: '1013'
}

// middleware
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  next()
})


// route
app.get('/',(req,res)=>{
  if(req.cookies.lemail){
    res.redirect("/home")
  }
  else{
  return res.render('login')
  }
})

app.get('/login',(req,res)=>{
  if(req.cookies.lemail){
    res.redirect("/home")
  }
  else{
  return res.render('login')
  }
})


// reads from form
app.post('/login', (req, res) => {
  const semail = req.body.email
  const spassword = req.body.password

  // validation
  if(semail == userDB.email&&spassword==userDB.password){ 
    res.cookie('lemail', semail, { maxAge: 24 * 60 * 60 * 1000 })
    return res.redirect('/home');
  } else if(semail =='' || spassword==''){
    res.render('login', { message: 'Enter Something' });
  }
  else if(!semail.match(/^[a-zA-Z0-9._%+-]+@(gmail\.com|icloud\.com|outlook\.com)$/)){
    res.render('login', { message: 'Your Email is Incorrect ' })
  }
  else{
  res.render('login', { message: 'Incorrect Email or password.' });}
 
})

app.use((req,res,next)=>{
  if(!req.cookies.lemail){
    return res.redirect('/login')
  }

  next();
})

app.get('/home', (req, res) => {
  res.render('home', { email: req.cookies.lemail })
})

app.get('/signout', (req, res) => {
  res.clearCookie('lemail')
  res.redirect('/')
})

app.listen(5000, () => {
  console.log('Server is listening at http://localhost:3000')
})
module.exports = app 

