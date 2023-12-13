export default class Load {
  static sprites() {
    loadSprite(
      "comfy-interior",
      "../../assets/comfy-interior-global-limited.png",
      {
        sliceX: 128,
        sliceY: 128,
      },
    );

    loadSprite("cellphone", "../../assets/cellphone/test-cellphone.png");

    loadSpriteAtlas("../../assets/comfy-interior-global-limited.png", {
      "the-shining": {
        x: 1952,
        y: 1024,
        width: 16,
        height: 20,
      },
      "american-gothic": {
        x: 1717,
        y: 1217,
        width: 21,
        height: 27,
      },
    });

    loadSprite(
      "test-character-positions",
      "../../assets/character-sprites/test-character-positions.png",
      {
        sliceX: 4,
        sliceY: 3,
        anims: {
          "green-idle-down": 0,
          "green-idle-right": 1,
          "green-idle-up": 2,
          "green-idle-left": 3,
          "red-idle-down": 4,
          "red-idle-right": 5,
          "red-idle-up": 6,
          "red-idle-left": 7,
          "blue-idle-down": 8,
          "blue-idle-right": 9,
          "blue-idle-up": 10,
          "blue-idle-left": 11,
        },
      },
    );

    loadSprite(
      "test-character-walking",
      "../../assets/character-sprites/test-character-walking-anims.png",
      {
        sliceX: 4,
        sliceY: 4,
        anims: {
          "green-up-idle": 0,
          "green-up": { from: 0, to: 3, loop: true },
          "green-down-idle": 4,
          "green-down": { from: 4, to: 7, loop: true },
          "green-left-idle": 8,
          "green-left": { from: 8, to: 11, loop: true },
          "green-right-idle": 12,
          "green-right": { from: 12, to: 15, loop: true },
        },
      },
    );
  }

  /**
   * Fetch map data from json files.
   *
   * @param {String} mapName - Must be the same name (no extension) as in the maps directory
   * @returns
   */
  static async mapData(mapName) {
    return (await fetch(`../../assets/maps/${mapName}.json`)).json();
  }
}
