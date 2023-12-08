// eslint-disable-next-line import/no-unresolved
import Scene from "./scenes/scene.js";
import Load from "./utils/loader.js";
import Canvas from "./canvas.js";
import Player from "./entities/player.js";

// Create Canvas Singleton
const canvas = new Canvas(416, 416);

// Assign canvas to globalThis.
Object.defineProperty(globalThis, "GameCanvas", {
  value: canvas,
  enumerable: false,
  configurable: true,
  writable: true,
});

// Initialize Kaboom and draw the canvas.
canvas.initialize(416, 416);

// Load our assets
Load.sprites();

// Load the map data.
const testMapData = await Load.mapData("test-map");

// Attach scenes to the canvas.
canvas.scenes = {
  testLevel: new Scene(testMapData),
};

canvas.player = new Player("test-character");

// Iterate through scenes and define/register them in kaboom.
for (const [name, _scene] of Object.entries(canvas.scenes)) {
  scene(name, () => _scene.initialize());
}

go("testLevel");
