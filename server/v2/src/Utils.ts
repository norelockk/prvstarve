/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import axios from 'axios';
import { Vector } from 'matter-js';
import Vector2 from './libs/vector';

declare global {
  interface Number {
    clamp: (min: number, max: number) => number;
  }
}

Number.prototype.clamp = function (min: number, max: number): number {
  return Math.min(Math.max(this as number, min), max);
};

/**
 * @function hrtimeMs
 * @memberOf Utils
 * @returns {number}
 */
export const hrtimeMs = (): number => {
  const time = process.hrtime();

  return time[0] * 1000 + time[1] / 1000000;
};

/**
 * @function getPublicIPAddress
 * @memberOf Utils
 * @returns {string}
 */
export const getPublicIPAddress = async (): Promise<string> => {
  const { data } = await axios.get('http://api.ipify.org/');
  if (!data)
    throw new Error('Could not get public IP address')

  return data;
};

/**
 * @function isStringEmpty
 * @memberOf Utils
 * @param {string} str
 * @returns {boolean}
 */
export const isStringEmpty = (str: string): boolean => {
  str = str.trim();

  return str === '' || str.length === 0;
};

// Packet decryption stuff
const secretKeys: string[] = [
  '9d0d52222fb0db0ea661c756f1c56e39',
  '9072b56081cfad5966a0d8052abfc42e',
  'fb2f5573344e036a02da636225b189af',
  '1fd8e8ca4709708e5473cf718b7fe8ff',
  '0304bb20667d850e368ac28bf5fcd8dc',
  '9c33965500bff6fee698fa1d3f862f4e',
  '1bb6ec76d1b1c1cb865e959f2ba35b80',
  'edbddcf7240a9aeacff9c331acc7a2a3',
  '73d9a41733d0edb816465d4b293919b0',
  '197aec4567749ee6e67a732b3b569c75',
  'e623ed33ee1c73fae8eb64a2d950d33c',
  '59240a02a84ddea8c0cc0ab5731cb874',
  'c449d52da354b9c428cf9359afcabc31',
  'd5183f8dfebb214bfd4853ae462c3650',
  'da40d2e694f51fa0ba09529a14ef5221',
  'f56dd11621fa1d94a9a2eede6339f012',
  'f22e4d42012a59fd3b89a895a0f884b1',
  '0ccdf5f07d55f8882199335e0a34c2eb',
  'ade4954cad0a75181dd92fc6c913efa5',
  'b5452b9774372cd2556c8e2fe5875ffa',
  '2fa700f47c52a843ca8ac03825f8eb58',
  'bdfc9fb6f14db87576c50cb26faed3ec',
  'f3ba071d70acdab8ff3b790d9e4e240a',
  '9bbe8a6f08e6103caa5960e8d6e8a2da',
  'e0f94e8fc4afd011ed113d136ff03e46',
  'f228d63570d72742a162b5cf530a63fc',
  'e348c3aeda8be9d43cb4287e0212e2d0',
  '5c5ebca171b7031a637ac5010f8d0b1f',
  '6e3c9009391c5f6f95cc4855c4cb7fb5',
  'fda81973f984d19729eb5eb70574163a'
];

// Decrypts an XOR-encrypted Uint8Array using the same set of secret keys and offsets
export function xorDecrypt(encrypted: Uint16Array): any {
  const offsets = getDefaultOffsets(encrypted.length, secretKeys.length);
  const decrypted: number[] = [];

  for (let i = 0; i < encrypted.length; i++) {
    const byte = encrypted[i];
    const keyIndex = (i + offsets[i % offsets.length]) % secretKeys.length;
    const keyChar = secretKeys[keyIndex].charAt(i % secretKeys[keyIndex].length);
    const key = keyChar.charCodeAt(0);
    decrypted.push(byte ^ key);
  }

  const decryptedString = String.fromCharCode(...decrypted);
  return JSON.parse(decryptedString);
}

// Generates default offsets starting from 0
function getDefaultOffsets(length: number, numOffsets: number): number[] {
  const offsets: number[] = [];
  for (let i = 0; i < length; i++) {
    offsets.push(i % numOffsets);
  }
  return offsets;
}

export const angleToRadians = (angle: number): number => angle * Math.PI / 128;
export const angleBetweenPoints = (v1: Vector | Vector2, v2: Vector | Vector2): number => Math.atan2(v1.x - v2.x, v1.y - v2.y) * 128 / Math.PI;

export const convertBoolToNumber = (bool: boolean) => !!bool ? 1 : 0;

export const translateVector = (vector: Vector | Vector2, radians: number, range: number = 120): Vector => {
  const x: number = vector.x + range * Math.cos(radians);
  const y: number = vector.y + range * Math.sin(radians);
  
  return { x, y };
};