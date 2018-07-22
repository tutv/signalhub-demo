const signalhub = require('signalhub')
const WebRTCSwarm = require('webrtc-swarm')

const hub = signalhub('my-game', [
    'http://localhost:6777'
])

const players = {}
const Player = require('./player.js')
const you = new Player()

const swarm = WebRTCSwarm(hub)

swarm.on('connect', (peer, id) => {
    console.log('new peer', id);

    if (!players[id]) {
        players[id] = new Player()

        peer.on('data', (str) => {
            const data = JSON.parse(str);

            players[id].update(data);
        });
    }
});

swarm.on('disconnect', (peer, id) => {
    if (players[id]) {
        players[id].remove()
        delete players[id];
    }
});

setInterval(() => {
    const yourString = JSON.stringify(you);

    swarm.peers.forEach(peer => {
        peer.send(yourString);
    })
}, 100);

document.addEventListener('keypress', function (e) {
    const speed = 16
    switch (e.key) {
        case 'a':
            you.x -= speed
            you.update()
            break
        case 'd':
            you.x += speed
            you.update()
            break
        case 'w':
            you.y -= speed
            you.update()
            break
        case 's':
            you.y += speed
            you.update()
            break
    }
}, false)