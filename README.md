# Game of Life

An interactive Game of Life where dying cells fade out slowly instead of disappearing instantly, turning Conway's classic cellular automaton into a living, breathing piece of generative art

## Test the website

You can test it directly in your browser: [Game of Life](https://capyblaze.github.io/Game-of-Life)

## What is the project?

It is a web-based Game of Life simulation rendered on an HTML5 canvas. You can draw living cells directly on the grid, switch between Moore and Neumann neighborhoods, tweak the simulation speed and customize the look with different colors, gradients and grid overlays. I built this using React, TypeScript and Zustand for state management, with the simulation logic and rendering handled through the native Canvas API and Vite as the build tool

## Why did you build it?

I wanted to take Conway's Game of Life, a project every programmer eventually builds and turn it into something more than a black-and-white grid of on/off cells. By adding a fade effect to dying cells, the simulation stops feeling like a technical demo and starts feeling like a generative art piece

## Inspiration

The idea came from thinking about what "life" and "art" have in common. Life itself is a form of art so a simulation of life can be one too. Instead of cells simply switching off, I made them fade away gradually leaving a trail of light behind them. That small change turns the simulation into something closer to an electronic art piece than a pure algorithm demo

## Theme

Theme selected: **Electroart**

This project fits the Electroart theme because it turns a purely algorithmic simulation, Conway's Game of Life into a visual art piece rendered entirely through code. The fading trails left by dying cells create glowing, organic patterns reminiscent of electronic visualizers and the customizable colors and gradients let anyone turn the simulation into their own generative artwork

## How do I test it?

The fastest way to test it is to use the live link above
If you want to run it locally on your machine just follow these steps

1. Clone this repository
   `git clone https://github.com/CapyBlaze/Game-Of-Live.git`

2. Go into the project folder
   `cd Game-Of-Live`

3. Install the dependencies
   `npm install`

4. Start the development server
   `npm run dev`

## Screenshots

| ![Screenshot 1](./docs/screenshot1.png) | ![Screenshot 2](./docs/screenshot2.png) |
| --------------------------------------- | --------------------------------------- |
| ![Screenshot 3](./docs/screenshot3.png) | ![Screenshot 4](./docs/screenshot4.png) |

## Demo Video

[Link to YouTube video demo](https://youtu.be/9fG16yrlBOg)
