# crowdbyte

Crowdbyte was inspired by the work on artificial swarm intelligence done a [Unanimous.ai](https://unanimous.ai).

The principle difference between this and voting is that community members are able to implicity negotiate and update their views in real time to reach a consensus without bias.

| ![The voter/player dashboard](https://github.com/hnhaefliger/crowdbyte/blob/main/demo/Screenshot%20from%202021-10-12%2008-09-44.png) | ![The host dashboard](https://github.com/hnhaefliger/crowdbyte/blob/main/demo/Screenshot%20from%202021-10-12%2008-09-52.png) |
|---|---|
|[The player](https://crowdbyte.co/room) only sees the options and the puck which represents the swarm. When the session begins, they attempt to pull the puck towards their choice with the magnet. They can actively change their opinion and certainty as they observe the movement of the vote. | [The host](https://crowdbyte.co/host) can observe each individual in the swarm as well as the movement of the vote once they start the session. |


Implemented using Python, Django, Django Channels (for sockets) and Javascript.
