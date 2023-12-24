const express = require("express");
const app = express();
const {Todo,User} = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const session = require('express-session');
const localStrategey = require('passport-local');
const bcrypt = require('bcrypt')


const saltRounds = 10;



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret:"this-is-my-secrete-key",
  cookie:{
    maxAge:24*60*60*100
  }
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategey({
  usernameField: 'email',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { email: username } });

    if (!user) {
      return done("User not found");
    }

    if (!password || !user.password) {
      return done("Invalid password or hash");
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      return done(null, user);
    } else {
      return done("Invalid password");
    }
  } catch (error) {
    return done(error);
  }
}));


passport.serializeUser((user,done)=>{

  console.log("Serializing user in session",user.id);
  done(null,user.id)
})


passport.deserializeUser((id,done)=>{
      User.findByPk(id)
      .then(user =>{
        done(null,user)
      })
      .catch(error =>{
        done(error,null)
      })
})


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async function (request, response) {
  response.render("index",{
    title:"Todo application"
  })
});

app.get("/todos",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE
  try {
    const overdues = await Todo.overdue(request.user.id);
    const todaydues = await Todo.todaydue(request.user.id);
    const laterdues = await Todo.laterdue(request.user.id);
    const comptodos = await Todo.completedtodos(request.user.id);
    console.log(overdues,todaydues,laterdues,comptodos)
    if (request.accepts("html")) {
      response.render("todos", { overdues, todaydues, laterdues, comptodos });
    } else {
      response.json({ overdues, todaydues, laterdues, comptodos });
    }
  } catch (err) {
    console.log(err);
    response.status(422).send(err);
  }


});

app.get("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  console.log(request.user)
  try {
    const todo = await Todo.addTodo(request.body,request.user.id);
    if (request.accepts("html")) {
      return response.redirect("/todos");
    } else {
      return response.json(todo);
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return response.status(422).json(error);
  }
});

app.put("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);

  try {
    const deleteTodo = await Todo.deleteTodo(request.params.id);
    response.send(deleteTodo ? true : false);
  } catch (err) {
    console.log(err);
    return response.status(422).json(err);
  }
});

app.get("/signup", async function (request, response) {
  response.render('signup',{title:"signup"})
});
app.post("/users", async function (request, response) {

  console.log("test models",Todo,User)

  const hashpass = await bcrypt.hash(request.body.password,saltRounds);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashpass, 
    });

    console.log("User created:", user);

    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }

      console.log("User logged in:", user);

      response.redirect("/todos");
    });
  } catch (err) {
    console.log(err);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/login",(request,response)=>{
  response.render("login",{title:"Login"})
})

app.post("/sessions",passport.authenticate('local',{failureRedirect:"/login"}),(request,response)=>{
  console.log(request.user);
  response.redirect("/todos")
})

app.get('/signout',(req,res)=>{
  req.logOut((err)=>{
    if (err) { return next(err);}
    res.redirect("/")
})

})
module.exports = app;
