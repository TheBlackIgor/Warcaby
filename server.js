var express = require("express")
var app = express()
const PORT = 3000;
var path = require("path")

app.use(express.static('static'))
app.use(express.text())

let players = []
let infoToPass = { pawnColor: "none" }

let board = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
]


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
    infoToPass = { pawnColor: "none" }
    res.end(JSON.stringify({}))
})

app.post("/quee", function (req, res) {
    const users = { users: players.length }
    res.end(JSON.stringify(users))
})

app.post("/setBoard", function (req, res) {
    let data = JSON.parse(req.body)
    let pawnColor = data.pawnColor
    let newPos = data.newPos
    let lastPos = data.lastPos
    let pawnID = data.pawnID

    board[lastPos.y][lastPos.x] = 0
    board[newPos.y][newPos.x] = pawnColor === "white" ? 1 : 2

    infoToPass = {
        pawnColor: pawnColor,
        newPos: newPos,
        lastPos: lastPos,
        pawnID: pawnID
    }

    res.end("success")
})

app.post("/getBoard", function (req, res) {
    res.end(JSON.stringify(infoToPass))
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})