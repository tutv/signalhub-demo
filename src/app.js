const signalhub = require('signalhub');

const hub = signalhub('my-game', [
    'http://localhost:6777'
])

const players = {}
const Player = require('./player.js')
const you = new Player()


hub.subscribe('update').on('data', (data) => {
    if (you.color === data.color) return

    if (!players[data.color]) {
        players[data.color] = new Player(data);
    }

    players[data.color].update(data)
});

document.addEventListener('keypress', function (e) {
    const speed = 16
    switch (e.key) {
        case 'a':
            you.x -= speed
            you.update()
            hub.broadcast('update', you)
            break
        case 'd':
            you.x += speed
            you.update()
            hub.broadcast('update', you)
            break
        case 'w':
            you.y -= speed
            you.update()
            hub.broadcast('update', you)
            break
        case 's':
            you.y += speed
            you.update()
            hub.broadcast('update', you)
            break
    }
}, false)