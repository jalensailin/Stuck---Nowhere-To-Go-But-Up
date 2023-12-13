import Scene from "./scenes/scene.js";
import Load from "./utils/loader.js";
import Canvas from "./canvas.js";
import Player from "./entities/player.js";
import Cellphone from "./ui/cellphone/cellphone.js";

// Create StuckGame on globalThis.
Object.defineProperty(globalThis, "StuckGame", {
  value: {},
  enumerable: false,
  configurable: true,
  writable: true,
});

// Create Canvas Singleton
StuckGame.Canvas = new Canvas(1280, 720);
// Initialize Kaboom and draw the canvas.
StuckGame.Canvas.initialize(416, 416);

// Load our assets
Load.sprites();

// Create our Player singleton.
StuckGame.Player = new Player("test-character-positions");

// Create our Cellphone singleton.
StuckGame.Cellphone = new Cellphone();

// Load the map data.
const testMapData = await Load.mapData("test-map");

// Attach scenes to the canvas
StuckGame.scenes = {
  testLevel: new Scene(testMapData),
};

// Iterate through scenes and define/register them in kaboom.
for (const [name, _scene] of Object.entries(StuckGame.scenes)) {
  scene(name, () => _scene.initialize());
}

go("testLevel");
