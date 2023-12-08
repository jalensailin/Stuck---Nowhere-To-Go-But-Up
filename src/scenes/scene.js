/* eslint-disable no-continue */
export default class Scene {
  constructor(mapData) {
    this.mapData = mapData;
    this.map = add([pos(0, 0)]); // Add a blank map (but does not get added to the canvas if it isn't around)
    this.tileheight = mapData.tileheight;
    this.tilewidth = mapData.tilewidth;
    this.entities = {
      player: null,
    };
  }

  /**
   * Main logic for initializing/drawing the scene.
   *
   * @param {Number} [color.r = 0]
   * @param {Number} [color.b = 0]
   * @param {Number} [color.g = 0]
   */
  initialize({ r, g, b } = { r: 0, g: 0, b: 0 }) {
    // We have to actually add this to the map once the scene is created, otherwise it is just an orphaned Game Object.
    // It might be more clear to declare `this.map = null` in the constructor, and to do `this.map = add([pos(0,0)])` here.
    add(this.map);
    setBackground(r, g, b); // Set the background color

    const { player } = GameCanvas;
    for (const layer of this.mapData.layers) {
      this.drawTiles(layer);
      this.drawBoundaries(layer);

      // Spawn entities
      if (layer.name === "SpawnPoints") {
        for (const spawnPoint of layer.objects) {
          // Add the player game object at the spawn point's coordinates.
          player.initialize(this.map, vec2(spawnPoint.x, spawnPoint.y));
          continue;
        }
      }
    }
    camScale(4); // Scale the camera
    camPos(player.gameObj.worldPos()); // Position the camera on our player

    // Update loop that is run every frame.
    onUpdate(() => {
      // TODO: figure out what this conditional is doing
      if (player.gameObj.pos.dist(camPos())) {
        // If we want the tween to finish before moving on with logic, use `await`
        tween(
          camPos(), // initial position
          player.gameObj.worldPos(), // target position
          0.05, // how fast do we want the values to change
          // Callback function called eversy frame.
          // Argument is a position between initial and target - what to do when updating.
          (newPos) => {
            camPos(newPos);
          },
          easings.linear, // easing function to use
        );
      }
    });
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
