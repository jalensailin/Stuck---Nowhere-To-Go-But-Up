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

    loadSprite(
      "test-character",
      "../../assets/character-sprites/test-character.png",
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
