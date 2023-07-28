import { ObjectType, WorldBiomes } from "./enums";

// export const MAP_OBJECTS: MapObject[] = [
//   {
//     radius: 75,
//     object: ObjectType.TREE,
//     objectName: "t"
//   },
//   {
//     radius: 50,
//     object: ObjectType.GOLD,
//     objectName: "g"
//   },
//   {
//     radius: 20,
//     object: ObjectType.STONE,
//     objectName: "s"
//   },
//   {
//     radius: 90,
//     object: ObjectType.TREE,
//     objectName: "b"
//   },
//   {
//     radius: 30,
//     object: ObjectType.DIAMOND,
//     objectName: "d"
//   }
// ];

export const SpeedMultipliers = {
  [WorldBiomes.SEA]: -70,
  [WorldBiomes.LAVA]: -20,
  [WorldBiomes.FOREST]: 0,
  [WorldBiomes.WINTER]: -20,
  [WorldBiomes.DESERT]: 20
};