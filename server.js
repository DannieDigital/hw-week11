// declare variables 

// this will import the express module
const express = require ("express");

// provides an API for interacting with the file system
const fs = require ("fs");

// this path module provides utilities for working with file and directory paths
const path = require ("path");

// this app variable will route the HTTP requests, configure middleware, and rednereing HTML see more here: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction
const app = express ();

// empty array to store user input 
const memo = [];


//  Environment variable
const PORT = process.env.PORT || 8080;

// this will returns middleware that only parses JSON and only looks at requests where the Content-Type header matches the type option. This parser accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings. bp. urlencoded({ extended: true }) - middleware for parsing bodies from URL. https://stackoverflow.com/questions/55558402/what-is-the-mean-of-bodyparser-urlencoded-extended-true-and-bodyparser
app.use(express.urlencoded({extended: true}));

// serve static files ie notes.html & index.html in directory public 
app.use(express.static('public'));

// recognize the incoming Request Object as a JSON Object
app.use(express.json());


//set API Routes 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

//  acquires data from saved notes with express function 
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        return res.json(JSON.parse(data));
    })
})
// saves notes with express function 
app.post("/api/notes", (req, res) => {
    req.body["id"] = memo.length + 1;
    let newMemo = JSON.stringify(req.body);
    memo.push(newMemo);
    fs.writeFile("./db/db.json", `[${memo}]`, "utf-8", (err) => {
        if (err) throw err;
        return res.json(req.body);
    })
})


// deletes the notes with express function 
app.delete("/api/notes/:id", (req,res) => {
    res.json({ ok: true});
});

app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});



//  initates the server with listen function
app.listen(PORT, () => {
    console.log("You have succesfully connected to server at " + PORT);
})