# European Roulette - Multiplayer game

## Table of contents

-   [Overview](#overview)
-   [The game](#the-game)
-   [Links](#links)
-   [Built with](#built-with)

## Overview

This is a multiplayer European Roulette game with some 3D animations.
Response from server can get couple seconds.

### The game

Users should be able to:

-   log in with automatically generated id
-   drag and drop chips on board in 'PLACE BET' state of game
-   see an animation for spinning roulette wheel
-   see winning number and everyone's sum of win
-   play soundtrack on button click
-   start a new round right after resetting the board

### Links

-   Repository URL: https://github.com/wuaicot/Ruleta-Publica.git
-   Live Demo URL: 

### Built with

-   Typescript
-   React
-   Babylon.js
-   MobX
-   easytimer.js
-   react-dnd
-   WebSockets

### Continued development

-   changing 'ws' server for socket.io (more customizable and would prevent rerenders)
-   improve drop event with highlighting board cells
-   change the assets for more realistic, adjust animation on ball
-   mobile view

### Play locally on your machine:

type: `git clone https://github.com/wuaicot/Ruleta-Publica.git` and then:
`npm install` to install dependencies and `npm start` for running front-end and in server directory install nodemon and: `ts-node server.ts` for running backend
