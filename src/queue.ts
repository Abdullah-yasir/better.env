export class Queue<T> {
  private items: T[] = []
  private maxLength: number

  constructor(maxLength: number) {
    if (maxLength <= 0) {
      throw new Error("Maximum length should be greater than zero")
    }
    this.maxLength = maxLength
  }

  enqueue(item: T): void {
    this.items.push(item)

    if (this.items.length > this.maxLength) {
      this.dequeue()
    }
  }

  dequeue(): T | undefined {
    return this.items.shift()
  }

  peek(index = 0): T | undefined {
    return this.items[index]
  }

  toList() {
    return [...this.items]
  }

  get size(): number {
    return this.items.length
  }

  get empty(): boolean {
    return this.items.length === 0
  }

  get full(): boolean {
    return this.items.length === this.maxLength
  }
}
