import Vector2 from "../../libs/vector";

export default class Bounds {
  public min: Vector2;
  public max: Vector2;

  public contains(vector: Vector2): boolean {
    return this.min.x <= vector.x && this.max.x >= vector.x && vector.x <= this.min.x + this.max.x && this.min.y <= vector.y && this.max.y >= vector.y && vector.y <= this.min.y + this.max.y;
  }

  constructor(min: Vector2, max: Vector2) {
    this.min = min;
    this.max = max;
  }
}