// eslint-disable-next-line import/no-unresolved
import kaboom from "https://unpkg.com/kaboom@3000.1.17/dist/kaboom.mjs";

kaboom({
  width: 1280,
  height: 720,
  letterbox: true,
});

// Load our assets and fonts
// Load.fonts();
// Load.sounds();
// Load.assets();

const scenes = {
  testLevel: () => {},
};

for (const [name, fn] of Object.entries(scenes)) {
  scene(name, fn);
}

go("testLevel");
