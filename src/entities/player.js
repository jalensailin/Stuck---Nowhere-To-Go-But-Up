export default class Player {
  static initialize(position) {
    return [
      // Create a sprite
      sprite("test-character", { width: 16, height: 16 }),
      // Create a hitbox with a rectangular shape, offset by (3,4), with 10 width and 12 height
      area({ shape: new Rect(vec2(3, 4), 10, 12) }),
      // Body component tells kaboom to make object affected by physics
      body(),
      pos(position),
      opacity(),
      // An object of entity-specific data
      {
        speed: 100,
        direction: "down",
      },
      // Pass in strings which are interpreted as tags by which the entity can be identified later.
      "player",
    ];
  }
}
