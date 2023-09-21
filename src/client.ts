import { readFileSync, writeFile } from "fs"

import Tokenizer from "./frontend/lexer/_tokenizer"
import Parser from "./frontend/parser"

import Environment from "./runtime/environment"

import { specs } from "./frontend/lexer/specs"
import { Organizer } from "./frontend/lexer/tokenizer"

import { evaluate } from "./runtime/interpreter"
import { EnvEntity, Primitive } from "./runtime/transpiler"
import { ArrayVal, ScopeVal } from "./runtime/values"

import { validateFilename } from "./helpers"

export class BetterDotEnv {
  private _keyVals: { key: string; value: any }[] = []
  private _env: { [key: string]: any } = {}

  private _globalEnv: Environment
  private _localEnv: Environment

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
    const input = readFileSync(validateFilename(filename), { encoding: "utf-8" })
    const parser = new Parser()
    const tokenizer = new Tokenizer(specs, filename)

    let tokens = tokenizer.tokenize(input)
    tokens = new Organizer().organize(tokens).filter().filter().tokens

    const program = parser.produceAST(tokens)

    evaluate(program, this._localEnv)
    this._transpile()

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
    for (const { key, value } of this._keyVals) {
      anyObject[key] = value
    }
  }

  /**
   * Creates a .env file
   */
  emit(filePath: string, onError: (err: Error) => void) {
    const envText = this._keyVals
      .map(({ key, value }) => `${key}=${(value as Primitive).value}`)
      .join("\n")

    const _ = filePath.split("/")

    if (_.length) {
      const filename = _[_.length - 1].split(".")[0] + ".env"

      writeFile(filename, envText, { encoding: "utf-8" }, (err) => {
        if (err) {
          if (onError) onError(err)
          else console.error("Unable to generate .env")
        }
      })
    }
  }

  private _transpile() {
    this._keyVals = this._getKeyVals(this._localEnv)

    for (const { key, value } of this._keyVals) this._env[key] = value

    this._env = Object.freeze(this._env)
  }

  private _getKeyVals(scope: Environment, parentName = ""): EnvEntity[] {
    const generated: EnvEntity[] = []
    for (const [key, value] of scope.varMap) {
      const varName = parentName ? `${parentName}_${key}` : key

      if (value.type == "array") {
        const _val = value as ArrayVal
        _val.elements.forEach((el, i) => {
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
