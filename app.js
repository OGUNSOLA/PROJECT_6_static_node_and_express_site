const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express(); // initialise the express app
const {projects}= require('./data.json'); // import data 

//app.use(bodyParser.urlencoded({extended: false}));
app.use( express.static('public'));

//set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//Root route to home page
app.get("/", (req, res)=>{
  res.render('index', {projects:projects});
});


//route to About page
app.get("/about", (req, res)=>{
  res.render('about');
});


//route to Individual project page
app.get("/projects/:id",(req, res, next)=>{
  const projectId = req.params.id;
  const project =projects.find(({id}) => id === +projectId);

  // check to see if requested project is valid
  if(project){
        res.render('project', {project:project});
  }else {
    next();
  }
});


// 404 error handler
app.use(( req, res, next)=>{
  const err = new Error();
  err.status = 404;
  err.message = " oh oh!. Looks like the project you are looking for doesnt exist yet! ";
  next(err);


});


// global error handler
app.use(( err, req, res, next) => {

  if (err) {
    console.log('Global error handler called', err);

    if (err.status === 404) {
      res.status(404).render('page-not-found', { err });

    } else {
      err.message = err.message || `Bummer!  It looks like something went wrong on the server.`;
      res.status(err.status || 500).render('error', { err });
  
    }
  }
 
});


  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log('Server listening on port 3000'));