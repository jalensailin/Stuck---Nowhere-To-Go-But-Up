/* eslint-disable no-continue */

export default class Scene {
  constructor(mapData) {
    this.map = add([pos(0, 0)]); // Add a blank map
    this.tileheight = mapData.tileheight;
    this.tilewidth = mapData.tilewidth;
  }

  static async initialize(mapName, { r, g, b } = { r: 0, g: 0, b: 0 }) {
    // Fetch the map json
    const mapData = await (
      await fetch(`../../assets/maps/${mapName}.json`)
    ).json();
    setBackground(r, g, b); // Set the background color
    const scene = new Scene(mapData); // Initialize scene
    for (const layer of mapData.layers) {
      scene.drawTiles(layer);
    }
    camScale(1.5); // Scale the camera
  }

  drawTiles(layer) {
    if (!layer.data) return;
    let numOfDrawnTiles = 0;
    const tilePos = vec2(0, 0); // position needs to be a vec2
    for (const tile of layer.data) {
      // If we have drawn as many tiles as the width, make a new line
      // by resetting tilePos's x-coordinate and increasing its y-coordinate
      if (numOfDrawnTiles % layer.width === 0) {
        tilePos.x = 0;
        tilePos.y += this.tileheight;
      } else {
        tilePos.x += this.tilewidth;
      }
      // Increase number of drawn tiles
      numOfDrawnTiles += 1;

      // if there is no tile, we dont need to draw anything
      if (tile === 0) continue;

      this.map.add([
        sprite("comfy-interior", { frame: tile - 1 }),
        pos(tilePos), // Give the sprite the correct vector (vec2)
        offscreen(), // Lowers rendering time
      ]);
    }
  }
}
