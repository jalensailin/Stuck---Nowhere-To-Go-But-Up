// eslint-disable-next-line import/no-unresolved
import kaboom from "https://unpkg.com/kaboom@3000.1.17/dist/kaboom.mjs";
import Scene from "./scenes/scene.js";
import Load from "./utils/loader.js";

kaboom({
  width: 416,
  height: 416,
  letterbox: true,
});

// Load our assets
Load.sprites();

const scenes = {
  testLevel: () => {
    Scene.initialize("test-map");
  },
};

for (const [name, fn] of Object.entries(scenes)) {
  scene(name, fn);
}

go("testLevel");
