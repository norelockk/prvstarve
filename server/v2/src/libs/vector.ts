/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

export default class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  reset(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  toString(decPlaces: number = 3): string {
    const scalar = Math.pow(10, decPlaces);
    return `[${Math.round(this.x * scalar) / scalar}, ${Math.round(this.y * scalar) / scalar}]`;
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  copyTo(v: Vector2): void {
    v.x = this.x;
    v.y = this.y;
  }

  copyFrom(v: Vector2): void {
    this.x = v.x;
    this.y = v.y;
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  normalise(): this {
    const m = this.magnitude();
    this.x /= m;
    this.y /= m;
    return this;
  }

  reverse(): this {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  plusEq(v: Vector2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  plusNew(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  minusEq(v: Vector2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  minusNew(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  multiplyEq(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  multiplyNew(scalar: number): Vector2 {
    const returnvec = this.clone();
    return returnvec.multiplyEq(scalar);
  }

  divideEq(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  divideNew(scalar: number): Vector2 {
    const returnvec = this.clone();
    return returnvec.divideEq(scalar);
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  angle(useRadians: boolean): number {
    return Math.atan2(this.y, this.x) * (useRadians ? 1 : Vector2Const.TO_DEGREES);
  }

  rotate(angle: number, useRadians: boolean): this {
    const cosRY = Math.cos(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
    const sinRY = Math.sin(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
    Vector2Const.temp.copyFrom(this);
    this.x = Vector2Const.temp.x * cosRY - Vector2Const.temp.y * sinRY;
    this.y = Vector2Const.temp.x * sinRY + Vector2Const.temp.y * cosRY;
    return this;
  }

  equals(v: Vector2): boolean {
    return this.x === v.x && this.y === v.y;
  }

  isCloseTo(v: Vector2, tolerance: number): boolean {
    if (this.equals(v)) return true;
    Vector2Const.temp.copyFrom(this);
    Vector2Const.temp.minusEq(v);
    return Vector2Const.temp.magnitudeSquared() < tolerance * tolerance;
  }

  rotateAroundPoint(point: Vector2, angle: number, useRadians: boolean): void {
    Vector2Const.temp.copyFrom(this);
    Vector2Const.temp.minusEq(point);
    Vector2Const.temp.rotate(angle, useRadians);
    Vector2Const.temp.plusEq(point);
    this.copyFrom(Vector2Const.temp);
  }

  isMagLessThan(distance: number): boolean {
    return this.magnitudeSquared() < distance * distance;
  }

  isMagGreaterThan(distance: number): boolean {
    return this.magnitudeSquared() > distance * distance;
  }
}

class Vector2Const {
  static readonly TO_DEGREES: number = 180 / Math.PI;
  static readonly TO_RADIANS: number = Math.PI / 180;
  static temp: Vector2 = new Vector2();
}