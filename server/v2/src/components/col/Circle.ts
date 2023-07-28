import Vector2 from "../../libs/vector";

export default class Circle extends Vector2 {
  public radius: number = 0;

  constructor(x: number = 0, y: number = 0, radius: number = 0) {
    super(0, 0);

    this.x = x;
    this.y = y;

    this.radius = radius;
  }

  public isCollidingWith(other: Circle): boolean {
    const distance: number = (this.x - this.x) ** 2 + (this.y - other.y) ** 2;
    const combined: number = this.radius + other.radius;

    return distance <= combined ** 2;
  }

  public update(x: number, y: number): void {
    this.x = x;
    this.y = y;

    // console.log('col update', this);
  }
}