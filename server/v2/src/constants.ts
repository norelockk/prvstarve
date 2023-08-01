import { WorldBiomes } from "./enums";

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

export const TodoList = {
  'First steps': {
    'Join with custom nickname/skin/etc': true,
    'Multiplayer (Sync)': true,
    'World Map & Resources': false,
    'Token System': false
  },
  'Ingame Mechanics': {
    'Dying': false,
    'Hitting': {
      'Gathering': false,
      'PvP (Hitting players)': false
    },
    'Movement': {
      'Collision': false,
      'Speed changing': false,
      'Vehicles': false
    },
    'Resources': {
      'Tools Dependent': false,
      'Resources multiplier': false,
      'Resources limit per resource': false
    },
    'Farming': {
      'Planting': false,
      'Grow speed & Plots': false,
      'Pitchfork': false
    },
    'Teams': {
      'Creating teams': false,
      'Kick from team': false,
      'Lock Totem': false
    },
    'Console': false,
    'Biomes': true,
    'Shop': false,
    'Kits': false,
    'Quests': false,
    'Cooldowns': false,
    'Building': false,
    'Crafting': false,
    'Leaderboard': true,
    'Equipment': false,
    'Chatting': true,
    'Gauges': false,
  }
};

export function renderTodoList(obj: any, indent: string = '#ffffff ') {
  let result = '';

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'object') {
        result += (indent + '🟦 ' + key) + '\n';
        result += renderTodoList(value, indent + '      ');
      } else {
        const test = value == false ? '❌' : (value ? '✅' : '⬛');
        result += (indent + test + key) + '\n';
      }
    }
  }

  return result;
}

export const TICK_RATE: number = 10;
export const DAY_TIME: number = 8 * 60 * 1000;

export const SPEED_MULTIPILERS = {
  [WorldBiomes.SEA]: -70,
  [WorldBiomes.LAVA]: -20,
  [WorldBiomes.FOREST]: 0,
  [WorldBiomes.WINTER]: -20,
  [WorldBiomes.DESERT]: 20
};