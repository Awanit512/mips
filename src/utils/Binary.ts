/**
 * Binary (Big Endian)
 */
export default class Binary {
  public readonly size: number
  private buf: Uint8Array

  constructor(size: number) {
    size = Math.floor(size)
    this.size = size % 8 === 0 ? size : size + (8 - (size % 8))
    this.buf = new Uint8Array(this.size / 8)
  }

  private getIndexForPos(pos: number): number {
    return this.buf.length - 1 - Math.floor(Math.abs(pos | 0) / 8)
  }

  private getBitPosForPos(pos: number): number {
    return Math.abs(pos | 0) % 8
  }

  public setBit(pos: number, value: number) {
    // only concerned with first bit of value
    const bitValue = value & 1
    const index = this.getIndexForPos(pos)
    const bitPos = this.getBitPosForPos(pos)
    const mask = 1 << bitPos

    if (bitValue) {
      // set bit at pos to 1
      this.buf[index] |= mask
    } else {
      // set bit at pos to 0
      this.buf[index] &= ~mask
    }
  }

  public getBit(pos: number): number {
    const index = this.getIndexForPos(pos)
    const bitPos = this.getBitPosForPos(pos)
    const value = (this.buf[index] & (1 << bitPos)) >>> bitPos

    return value
  }

  public setByte(index: number, value: number) {
    this.buf[index] = value
  }

  public getByte(index: number): number {
    return this.buf[index]
  }

  public getRange(start: number, end: number): number {
    start = Math.abs(start | 0)
    end = Math.abs(end | 0)
    let ret = 0

    for (let i = start; i <= end; i++) {
      ret += this.getBit(i) * Math.pow(2, i - start)
    }

    return ret
  }

  public getValue(): number {
    return this.getRange(0, this.size - 1)
  }

  public valueOf(): number {
    return this.getValue()
  }

  public toUint8Array() {
    const clone = new Uint8Array(this.size / 8)

    for (let i = 0; i < this.buf.length; i++) {
      clone[i] = this.buf[i]
    }

    return clone
  }

  public toUint32Array() {
    const size32 = this.size / 32
    const clone = new Uint32Array(size32)

    for (let i = 0; i < size32; i++) {
      clone[i] =
        this.buf[i + 0] |
        this.buf[i + 1] |
        this.buf[i + 2] |
        this.buf[i + 3]
    }

    return clone
  }

  static fromUint8Array(arr: Uint8Array): Binary {
    const binary = new Binary(arr.length * 8)

    for (let i = 0; i < arr.length; i++) {
      binary.setByte(i, arr[i])
    }

    return binary
  }

  static fromUint32Array(arr: Uint32Array): Binary {
    const binary = new Binary(arr.length * 32)

    for (let i = 0; i < arr.length; i++) {
      binary.setByte(i + 0, (arr[i] & 0xff000000) >>> 24)
      binary.setByte(i + 1, (arr[i] & 0x00ff0000) >>> 16)
      binary.setByte(i + 2, (arr[i] & 0x0000ff00) >>> 8)
      binary.setByte(i + 3, (arr[i] & 0x000000ff))
    }

    return binary
  }

  static fromArray(arr: number[]): Binary {
    const binary = new Binary(arr.length)

    for (let i = arr.length - 1, j = 0; i >= 0; i--, j++) {
      binary.setBit(j, arr[i])
    }

    return binary
  }
}