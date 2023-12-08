/* eslint-disable no-continue */
import Player from "../entities/player.js";

export default class Scene {
  constructor(mapData) {
    this.map = add([pos(0, 0)]); // Add a blank map
    this.tileheight = mapData.tileheight;
    this.tilewidth = mapData.tilewidth;
    this.entities = {
      player: null,
    };
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
      scene.drawBoundaries(layer);
      if (layer.name === "SpawnPoints") {
        for (const spawnPoint of layer.objects) {
          scene.entities.player = scene.map.add(
            // Add the player game Object at the spawn point's coordinates.
            Player.initialize(vec2(spawnPoint.x, spawnPoint.y)),
          );
          continue;
        }
      }
    }
    camScale(2); // Scale the camera
    camPos(scene.entities.player.worldPos());
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

  drawBoundaries(layer) {
    if (!layer.objects) return;
    for (const boundary of layer.objects) {
      const tags = [boundary.name, boundary.class];
      this.map.add([
        area({ shape: new Rect(vec2(0), boundary.width, boundary.height) }), // Hitbox
        pos(vec2(boundary.x, boundary.y + 16)),
        body({ isStatic: true }), // Player should not be able to push this or pass through it.
        offscreen(),
        ...tags,
      ]);
    }
  }

  spawnEntity(entity) {
    return this.map.add(entity.components);
  }
}
