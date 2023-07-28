import Vector2 from "../libs/vector";
import Circle from "./col/Circle";

interface GObject { object: string, radius: number, fixture: number }

export default class GameObject {
  private static readonly SUPPORTED_OBJECTS: GObject[] = [
    {
      object: 't',
      radius: 75,
      fixture: 20
    },
    {
      object: 'g',
      radius: 50,
      fixture: 10,
    },
    {
      object: 's',
      radius: 20,
      fixture: -25,
    },
    {
      object: 'b',
      radius: 90,
      fixture: 5,
    },
    {
      object: 'd',
      radius: 30,
      fixture: 5,
    }
  ];

  private object: GObject | undefined = undefined;

  public position: Vector2 = new Vector2(0, 0);
  public collider: Circle = new Circle(0, 0, 0);

  public static create(object: string, x: number = 0, y: number = 0): GameObject | boolean {
    const ob = GameObject.SUPPORTED_OBJECTS.find(obj => obj.object === object);
    if (!ob)
      return false;

    return new GameObject(object, x, y);
  }

  constructor(object: string, x: number = 0, y: number = 0) {
    this.object = GameObject.SUPPORTED_OBJECTS.find(obj => obj.object === object);

    if (this.object) {
      this.position.x = x * 100 + this.object.radius - this.object.fixture;
      this.position.y = y * 100 + this.object.radius - this.object.fixture;

      this.collider.radius = this.object.radius ?? 5;
      this.collider.update(this.position.x, this.position.y);
    }
  }
}