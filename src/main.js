// eslint-disable-next-line import/no-unresolved
import Scene from "./scenes/scene.js";
import Load from "./utils/loader.js";
import Canvas from "./canvas.js";

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

// Attach scenes to the canvas.
canvas.scenes = {
  testLevel: () => {
    Scene.initialize("test-map");
  },
};

// Iterate through scenes and define/register them in kaboom.
for (const [name, fn] of Object.entries(canvas.scenes)) {
  scene(name, fn);
}

go("testLevel");
