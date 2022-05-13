var express = require("express")
var app = express()
const PORT = 3000;
var path = require("path")

app.use(express.static('static'))
app.use(express.text())

let players = []

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

app.post("/loginPlayer", function (req, res) {
    userLogin = req.body
    if (players.length == 0) {
        players.push(userLogin)
        let color = "white"
        const jsonBack = { color: color, login: userLogin }
        res.end(JSON.stringify(jsonBack))
    }
    else if (players.length == 1 && players[0] != userLogin) {
        players.push(userLogin)
        let color = "black"
        const jsonBack = { color: color, login: userLogin }
        res.end(JSON.stringify(jsonBack))
    }
    else if (players.length >= 2) {
        const color = "no color"
        const jsonBack = { color: color, login: userLogin }
        res.end(JSON.stringify(jsonBack))
    }
    else {
        const jsonBack = { color: "login powtórzony", login: "login powtórzony" }
        res.end(JSON.stringify(jsonBack))
    }

})

app.post("/reset", function (req, res) {
    players = []
    console.log("clear");
    res.end(JSON.stringify({}))
})

app.post("/quee", function (req, res) {
    const users = { users: players.length }
    res.end(JSON.stringify(users))
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})