
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

//assume this data from backend files
const predefinedUsername = 'Aswin K';
const predefinedPassword = 'PASSWORD';

//  middlewares 
app.use(express.static(path.join(__dirname,"views")));
app.use(express.urlencoded({ extended: true }));


//session handling
app.use(cookieParser());
app.use(session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false , maxAge: 24 * 60 * 60 * 1000 
         }
}));
//FOR avoiding , once the user has signed out, the home page shouldn't be loaded on pressing the back button. 

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

//setting handlebars 
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//assume this dynamic data from database
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

//routing sections

app.get('/',(req,res)=>{
    if(req.session.loggin){
        res.redirect('/home');
    }else{
        res.redirect('/login');
    }
    
})

app.get('/login',isAuth, (req, res) => {
    console.log("user want to loggin for home page");
    res.render('login', { errorMessage: req.query.message });
});

app.post('/login',(req,res)=>{
    const body = req.body;
    const { username , password } = body;
    
    
    if(username === predefinedUsername && password === predefinedPassword ){
        req.session.loggin = true;
        req.session.username = username;
        
        res.redirect('/home');
        
    }else{
       
       res.redirect('/login?message=Incorrect%20Username%20or%20Password');
    }
    
});
function isAuth(req,res,next){
    
    if( req.session.loggin ){
        console.log("user already loggined")
        return res.redirect('/home');
    }else{
        next();
    }
}



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
        console.log("user signouted");
        res.clearCookie('connect.sid');
        res.redirect('/login');
    })
   
})


app.listen(PORT,()=>{console.log("server running ")})