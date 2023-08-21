import { readFileSync, writeFile } from "fs"

import Environment from "./runtime/environment"
import { evaluate } from "./runtime/interpreter"

import Parser from "./frontend/parser"
import Tokenizer from "./frontend/lexer/tokenizer"
import { specs } from "./frontend/lexer/specs"

import { PackageInfo } from "./types"
import { validateFilename, emitTempFile, readInfo } from "./helpers"

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

  const tokens = tokenizer.tokenize(input)

  emitTempFile("tokens.json", JSON.stringify(tokens))

  const program = parser.produceAST(tokens)

  evaluate(program, env)

  transpile(filename, env)

  emitTempFile("ast.json", JSON.stringify(program))
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

function transpile(filename: string, env: Environment) {
  const generated = []

  for (const [key, value] of env.varMap) {
    if (value.type == "array") {
      // @ts-ignore
      value.elements.forEach((el, i) => {
        generated.push({ key: `${key}_${i + 1}`, value: el })
      })
      continue
    }
    generated.push({ key, value: value })
  }

  const envText = generated
    // @ts-ignore
    .map(({ key, value }) => `${key}=${value.value}`)
    .join("\n")

  const __ = filename.split("/")

  if (__.length) {
    const _fname = __[__.length - 1].split(".")[0] + ".env"
    writeFile(_fname, envText, { encoding: "utf-8" }, (err) => {
      if (err) console.log("Unable to generate .env")
      console.log("Generated:", _fname)
    })
  }
}
