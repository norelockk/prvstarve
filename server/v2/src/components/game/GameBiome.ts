import { WorldBiomes } from "../../enums";
import Vector2 from "../../libs/vector";
import Bounds from "../col/Bounds";

export default class GameBiome {
  public biomeType: WorldBiomes;
  public bounds: Bounds;

  constructor(biomeType: WorldBiomes, bounds: Bounds = new Bounds(new Vector2(0, 0), new Vector2(0, 0))) {
    this.biomeType = biomeType;
    this.bounds = bounds;
  }
}