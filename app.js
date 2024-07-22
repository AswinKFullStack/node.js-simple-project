
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

//assume this data from backend files
const predefinedUsername = 'Aswin K';
const predefinedPassword = 'PASSWORD';

//  middlewares 
app.use(express.static(path.join(__dirname,"views")));
app.use(express.urlencoded({ extended: true }));



app.use(cookieParser());
app.use(session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false , 
        maxAge: 1000 * 60 * 60 * 24 }
}));


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


const categories = {
    
    Happy: [
      { title: 'Family Joy', description: 'Happy Songs with Family', image: '/images/happy-family.jpeg' },
      { title: 'Friendship Vibes', description: 'Happy Songs with Friends', image: '/images/happy-friends.jpeg' },
      { title: 'Dance Party', description: 'Happy Songs for Dancing', image: '/images/dancing -alone.jpeg' },
      { title: 'Solo Bliss', description: 'Happy Songs Alone', image: '/images/happy-alone.jpeg' }
    ],
    Motivation: [
      { title: 'Rise and Shine', description: 'Motivation songs for Comeback', image:'/images/combak.jpeg' },
      { title: 'Pump Up Your Workout', description: 'Motivation songs for Gym', image: '/images/gym-motivation.jpeg' },
      { title: 'Rise and Shine', description: 'Motivation songs for Hard Work', image: '/images/hardwork.jpeg' }
    ]
  };
//for checking the user logginn
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});


app.get('/',(req,res)=>{
    if(req.session.loggin){
        res.redirect('/home');
    }else{
        res.render('login')
    }
    
})

app.post('/login',(req,res)=>{
    const body = req.body;
    const { username , password } = body;
    
    
    if(username === predefinedUsername && password === predefinedPassword ){
        req.session.loggin = true;
        req.session.username = username;
        
        res.redirect('/home');
        
    }else{
        res.render('login',{errorMessage : 'Incorrect username or password'});
    }
    
});




app.get('/home',(req,res)=>{
    
    

    if(req.session.loggin){
    
        res.render('home' ,{categories , username :req.session.username});
        
    }else{
        res.redirect('/');
    }
     
    
})

app.post('/signout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
             res.redirect('/');
             return;
        }
        
        res.redirect('/');
    })
   
})


app.listen(PORT,()=>{console.log("server running ")})