require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express(); ///to use all property of express
const Contactt = require("./model/contcatmodel.js");
const Collections = require("./model/models");
require("./db/mongo");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { ObjectId } = require("mongoose");

const cookieparser = require("cookie-parser");
const spath = path.join(__dirname, "../public");
const staticpath = path.join(__dirname, "../templets2/views");
const partialpath = path.join(__dirname, "../templets2/partials");

const auth = require("./middleware/auth.js");
const { log } = require("console");
const signup = require("./middleware/zod2.js");
const login = require("./middleware/zodvalid.js");
const errormiddle = require("./smiddleware/errormid.js");
const validator = require("./smiddleware/validator.js");
const contactform = require("./middleware/zodcontact.js");
const validatoorr = require("./smiddleware/validation.js");

const port = process.env.PORT || 4000;
// const partialpath = path.join(__dirname, "../templets2/partials");

const corsOption = {
  origin: "http://localhost:3000",
  method: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(cors(corsOption));

app.use(express.static("../speech/build"));
app.get("*", () => {
  res.sendFile(path.join(__dirname, "..", "speech", "build", "index.html"));
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());

// --------------------------------------*/REGISTER*/----------------------------------------.

app.post("/register", validator(signup), async (req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;
    console.log(req.body);
    if (password !== confirmpassword) {
      return res.status(401).json({ message: "Password must be same" });
    } else {
      const userexist = await Collections.findOne({ email: email });
      if (userexist) {
        return res.status(401).json({ message: "User is already exist" });
      }
      const user = new Collections({
        name: name,
        email: email,
        password: password,
        confirmpassword: confirmpassword,
      });
      console.log(user);
      if (!name || !email || !password || !confirmpassword) {
        console.log("enter all the data");
      } else {
        const token = await user.generateAuth();
        console.log(token);
        const userv = await user.save();
        console.log(userv);
        console.log("manas");
        console.log("Done");
        console.log("Done");
        res.render("login");
      }
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
////////////////////////////////////////////////////////////////////////////////

// ----------------------------------*/CONTACT*/---------------------------------.
app.post("/contact", validatoorr(contactform), async (req, res) => {
  try {
    const { Name, Email, Message } = req.body;
    const count = new Contactt({
      Name: Name,
      Email: Email,
      Message: Message,
    });
    console.log(count);
    const show = await count.save();
    console.log(show);
    res.send(count);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
//////////////////////////////////////////////////////////////////////////////////////
// --------------------------------------*/SECRET*/---------------------------------------.

app.get("/secret", auth, async (req, res) => {
  try {
    console.log("secret page");
    res.send(req.user);
  } catch (error) {
    res.status(401).send(error);
  }
});
app.get("/secrets", auth, async (req, res) => {
  try {
    // console.log(req.user);//// only use req.value
    console.log(req.user.tokens); //// only use req.value

    req.user.tokens = [];
    res.send(req.user);
    console.log("logout succesfully");
    await req.user.save();
  } catch (e) {
    console.log(e);
  }
});

/////////////////////////////////////////////////////////////////////////////////
// ------------------------------------*/ADMIN*/-------------------------------------
app.get("/user", async (req, res) => {
  try {
    const Alldata = await Collections.find();
    if (!Alldata || Alldata.length === 0) {
      res.status(404).json({ message: " Data is not found in the backend" });
    }

    res.send(Alldata);
  } catch (error) {
    res.status(401).send(error);
    next(error);
  }
});
app.patch("/update/:id", async (req, res) => {
  try {
    console.log("UPDATE");
    const id = req.params.id;
    const updatedata = req.body;
    console.log(updatedata);
    const dragta = await Collections.updateOne(
      { _id: id },
      {
        $set: updatedata,
      }
    );
    console.log("WIN");
    return res.status(201).json(dragta);
  } catch (error) {
    console.log(error);
  }
});
app.get("/singleuser/:id", async (req, res) => {
  try {
    id = req.params.id;
    const singledata = await Collections.findOne({ _id: id }, { password: 0 });
    console.log(singledata);
    res.send(singledata);
  } catch (error) {
    console.log(error);
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    await Collections.deleteOne({ _id: id });
    res.send(id);
    console.log("successful");
  } catch (error) {
    res.status(401).send(error);
    // next(error);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////
app.get("/contactdata", async (req, res) => {
  try {
    const contactdata = await Contactt.find();
    console.log("COntact dataatttatatt");
    if (!contactdata || contactdata.length === 0) {
      res.status(404).json({ message: " Data is not found in the backend" });
    } else {
      res.send(contactdata);
      console.log("succesfully");
    }
  } catch (error) {
    res.status(401).send(error);
    next(error);
  }
});

// ----------------------------------------*/LOGIN*/-------------------------------------.

app.get("/login", async (req, res) => {
  console.log("Login page");
  res.render("login");
});

app.post("/login", validator(login), async (req, res) => {
  try {
    console.log("Loginnnn page");
    const password = req.body.password;
    console.log(password);
    console.log(req.body.email);
    const logine = await Collections.findOne({ email: req.body.email });
    if (!logine) {
      return res.status(400).json({ message: " Invalid User" });
    }

    const exact = await bcrypt.compare(password, logine.password);
    if (exact) {
      console.log("successfully");
      // res.render("register");
      const token = await logine.generateAuth();
      console.log(`the token is   ${token}`);
      console.log("Cookie");
      res.cookie("jwt", token);
      console.log("manas");
      console.log("lo lo lol");
      res.send(logine);
    } else {
      console.log("invalid password");
      res.status(401).json({ message: "Enter a valid password" });
    }
  } catch (e) {
    res.send(e);
    console.log("invalid email");
  }
});
/////////////////////////////////////////////////////////////////////////////////////////

app.use(errormiddle);

app.listen(port, "127.0.0.1", (req, res) => {
  console.log(` iam listening at  port ${port}`);
});
