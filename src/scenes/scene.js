/* eslint-disable no-continue */
import SubjectCamera from "../ui/cameras/subject-camera.js";
import ViewBox from "../ui/ui-elements/view-box.js";

export default class Scene {
  constructor(mapData) {
    this.mapData = mapData;
    this.map = add([pos(0, 0)]); // Add a blank map (but does not get added to the canvas if it isn't around)
    this.tileheight = mapData.tileheight;
    this.tilewidth = mapData.tilewidth;
    this.entities = {
      player: StuckGame.Player,
    };
    this.cameras = {
      player: new SubjectCamera(this.entities.player, { scale: 4 }),
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

    const { player } = this.entities;
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
    this.cameras.player.initialize(); // Initialize Player Camera
    StuckGame.Cellphone.setPhoneListeners(this.map);
    this.setCollisions();
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
      this.map.add([
        area({ shape: new Rect(vec2(0), boundary.width, boundary.height) }), // Hitbox
        pos(vec2(boundary.x, boundary.y + 16)),
        body({ isStatic: true }), // Player should not be able to push this or pass through it.
        offscreen(),
        boundary.type,
        {
          name: boundary.name,
        },
      ]);
    }
  }

  setCollisions() {
    const { player } = this.entities;
    player.gameObj.onCollide("viewable", (viewable) => {
      const viewBox = new ViewBox(viewable.name);
      viewBox.initialize(viewable);
    });

    player.gameObj.onCollideEnd("viewable", async (viewable) => {
      const viewBoxGameObjs = viewable.get("viewBox");
      const viewBoxes = viewBoxGameObjs.map((gameObj) => gameObj.viewBox);
      const toDestroy = [];
      for (const viewBox of viewBoxes) {
        toDestroy.push(viewBox.destroy());
      }
      await Promise.all(toDestroy);
    });
  }
}
