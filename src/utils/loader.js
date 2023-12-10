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
      "test-character",
      "../../assets/character-sprites/test-character.png",
    );

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
