import * as fs from "node:fs"
import path from "path"
import { EXT } from "./contants"
import { PackageInfo } from "./types"

export function validateFilename(filename: string): string {
  if (!filename || !filename.endsWith(EXT)) {
    throw new Error(`Invalid file path, filename must end with '${EXT}'. Recieved: ${filename}`)
  }
  return filename
}

export class Placholder {
  static expr(title: string | number) {
    return `#expr(${title})`
  }
}

export const emitTempFile = (filename: string, data: string) => {
  const tempPath = "_temp_"

  return new Promise((resolve, reject) => {
    fs.mkdir(tempPath, { recursive: true }, (err) => {
      if (err) reject(err)

      fs.writeFile(path.join(tempPath, filename), data, { encoding: "utf-8" }, (err) => {
        if (err) reject(err)
        resolve(filename)
      })
    })
  })
}

/**
 * Gives the package info like, package name, version and description
 */
export const readInfo = (): Promise<PackageInfo> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "..", "package.json"), { encoding: "utf8" }, (err, data) => {
      if (err) reject(err)
      try {
        const _data = JSON.parse(data)
        if (!_data.bin) throw new Error("'bin' is not specified in package.json")
        _data.cliName = Object.keys(_data.bin)[0]
        resolve(_data as PackageInfo)
      } catch (error) {
        let message = "Unable to parse package.json"
        if (error instanceof Error) message = error.message
        reject(message)
      }
    })
  })
}

export function insertAtIndex<T>(array: T[], index: number, element: T): T[] {
  if (index < 0 || index > array.length) {
    throw new Error("Index is out of range")
  }

  // Use splice to insert the element at the specified index
  array.splice(index, 0, element)

  return array
}
