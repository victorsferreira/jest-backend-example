const express = require('express');
const app = express();

const PORT = 8000;
const GAMES = [
    { id: '1', name: 'Catan', year: '1995', designer: 'Klaus Teuber' },
    { id: '2', name: 'Carcassonne', year: '2000', designer: 'Klaus-Jürgen' },
    { id: '3', name: 'Pandemic', year: '2008', designer: 'Matt Leacock' },
    { id: '4', name: 'Azul', year: '2017', designer: 'Michael Kiesling' }
];

app.get('/games', (req, res, next) => {
    const { id, name, designer } = req.query;

    if (!id && !name && !designer) {
        return res.status(400).send("Bad Request");
    }

    let game;

    if (id) {
        game = getGameByProperty('id', id);
    } else if (name) {
        game = getGameByProperty('name', name);
    } else if (designer) {
        game = getGameByProperty('designer', designer);
    }

    if (!game) return res.status(404).json("Not Found");

    res.status(200).json({ data: [game] });
});

function findItemInArrayByProperty(array, propKey, propVal) {
    return array.find(c => (propKey in c) && c[propKey] === propVal);
}

function getGameByProperty(propKey, propVal) {
    return findItemInArrayByProperty(Object.values(GAMES), propKey, propVal);
}

function startServer() {
    return app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

module.exports = {
    findItemInArrayByProperty,
    startServer
}