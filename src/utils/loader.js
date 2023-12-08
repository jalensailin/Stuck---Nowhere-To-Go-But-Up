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
}
