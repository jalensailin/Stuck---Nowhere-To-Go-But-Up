export default class Camera {
  constructor({ scale = 1, position = vec2(0, 0), rotation = 0 } = {}) {
    this.scale = scale;
    this.rotation = rotation;
    this.position = position;
  }

  initialize() {
    camScale(this.scale); // Scale the camera.
    camRot(this.rotation); // Rotate the camera.
    camPos(this.position); // Position the camera on our subject.
  }
}
