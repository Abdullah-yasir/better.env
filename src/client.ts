import fs from "fs"

import Tokenizer, { Organizer } from "./frontend/lexer/tokenizer"
import Parser from "./frontend/parser"

import Environment from "./runtime/environment"

import { specs } from "./frontend/lexer/specs"

import { evaluate } from "./runtime/interpreter"
import { EnvEntity, Primitive } from "./runtime/transpiler"
import { ArrayVal, ScopeVal, StringVal } from "./runtime/values"

import { emitTempFile, validateFilename } from "./helpers"

type JSPrimitive = string | number | boolean | any[]
type EmitOptions = { onError: (err: Error) => void }
export class BetterDotEnv {
  private _keyVals: { key: string; value: JSPrimitive }[] = []
  private _env: { [key: string]: JSPrimitive } = {}

  private _globalEnv: Environment
  private _localEnv: Environment

  private _loadedFileName = ""

  private _outExt = ".env"

  constructor() {
    this._globalEnv = new Environment()
    this._localEnv = new Environment(this._globalEnv)
  }

  get env() {
    return this._env
  }

  /**
   * Loads the env from `.benv` file
   * @param filename Name of the `.benv` file
   */
  load(filename: string): BetterDotEnv {
    this._loadedFileName = filename
    const input = fs.readFileSync(validateFilename(filename), { encoding: "utf-8" })
    const parser = new Parser()
    const tokenizer = new Tokenizer(specs, filename)

    let tokens = tokenizer.tokenize(input)
    tokens = new Organizer().organize(tokens).filter().filter().tokens

    const program = parser.produceAST(tokens)
    emitTempFile("ast.json", JSON.stringify(program))
    evaluate(program, this._localEnv)

    this._transpile()
    this.append(this._env)
    Object.freeze(this._env)

    return this
  }

  /**
   * Takes an object and appends `.env` key value pairs to it
   * @param anyObject The object to append env key value pairs to
   * @example
   * ```javascript
   * // Load the `benv` and append to `process.env`
   * new Client().load("./benv/main.benv").append(process.env)
   * ```
   */
  append(anyObject: { [key: string]: any }) {
    for (const { key, value } of this._keyVals) anyObject[key] = value
  }

  /**
   * Creates a .env file
   */
  emit(filePath?: string, options?: EmitOptions): string {
    const envText = this._keyVals.map(({ key, value }) => `${key}=${value}`).join("\n")

    let filename = ""

    if (filePath) {
      filename = filePath
    } else {
      const _ = this._loadedFileName
      const pathArr = _.split("/")
      if (pathArr.length) {
        filename = pathArr[pathArr.length - 1].split(".")[0] + this._outExt
      } else {
        filename = _.split(".")[0] + this._outExt
      }
    }

    fs.writeFile(filename, envText, { encoding: "utf-8" }, (err) => {
      if (err) {
        if (options?.onError) options.onError(err)
        else console.error("Unable to generate env file")
      }
    })

    return filename
  }

  private _transpile() {
    this._keyVals = this._getKeyVals(this._localEnv).map(({ key, value }) => {
      return { key, value: (value as Primitive).value }
    })
  }

  private _getKeyVals(scope: Environment, parentName = ""): EnvEntity[] {
    const generated: EnvEntity[] = []
    for (const [key, value] of scope.varMap) {
      const varName = parentName ? `${parentName}_${key}` : key

      if (key.startsWith("_")) continue // skip private variables

      if (value.type == "array") {
        const _val = value as ArrayVal
        _val.elements.forEach((el, i) => {
          if (el.type == "scope") {
            el = { type: "string", value: "<BLOCK>" } as StringVal
          }
          generated.push({ key: `${varName}_${i + 1}`, value: el })
        })
        continue
      }

      if (value.type == "scope") {
        const parsed = this._getKeyVals((value as ScopeVal).value, varName)
        generated.push(...parsed)
        continue
      }

      generated.push({ key: varName, value })
    }

    return generated
  }
}
