/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import NetworkClient from './networking/components/Client';

/**
 * Logger levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Register handler param for JSON handler
 */
export type RegisteredJSONHandler = {
  handlerType: "JSON";
  header: number;
  handler: Function;
}