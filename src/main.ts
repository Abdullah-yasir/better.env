import { readFileSync } from "fs"

import Environment from "./runtime/environment"
import { evaluate } from "./runtime/interpreter"

import Parser from "./frontend/parser"
import Tokenizer, { Organizer } from "./frontend/lexer/tokenizer"
import { specs } from "./frontend/lexer/specs"

import { PackageInfo } from "./types"
import { validateFilename, emitTempFile, readInfo } from "./helpers"
import { transpile } from "./runtime/transpiler"

main()

async function main() {
  try {
    const info = await readInfo()

    const [, , $1] = process.argv

    switch ($1) {
      case "-h":
      case "--help":
        showHelp(info)
        break
      case "-v":
      case "--version":
        console.log(info.version)
        break

      default:
        run($1)
    }
  } catch (err) {
    if (err instanceof Error) return console.log(err.message)
    console.log(err)

    process.exit()
  }
}

async function run(filename: string) {
  const input = readFileSync(validateFilename(filename), { encoding: "utf-8" })

  const globalEnv = new Environment()
  const env = new Environment(globalEnv)
  const parser = new Parser()
  const tokenizer = new Tokenizer(specs, filename)

  let tokens = tokenizer.tokenize(input)

  tokens = new Organizer().organize(tokens).filter().filter().tokens

  emitTempFile("tokens.json", JSON.stringify(tokens))

  const program = parser.produceAST(tokens)

  emitTempFile("ast.json", JSON.stringify(program))

  evaluate(program, env)

  transpile(filename, env)
}

function showHelp(info: PackageInfo) {
  const h = `
  Command: ${info.cliName}
  To transpile a file, pass file path as a first argument.

  Flags           Description
  ---------------------------
  -h, --help      Show help
  -v, --version   Show current version
  `

  console.log(h)
}
