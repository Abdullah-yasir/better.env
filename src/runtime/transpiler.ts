import { writeFile } from "fs"
import Environment from "./environment"
import { ArrayVal, BooleanVal, NumberVal, RuntimeVal, ScopeVal, StringVal } from "./values"

export type EnvEntity = {
  key: string
  value: RuntimeVal
}

export type Primitive = NumberVal | StringVal | BooleanVal

function getKeyVals(scope: Environment, parentName = ""): EnvEntity[] {
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
      const parsed = getKeyVals((value as ScopeVal).value, varName)
      generated.push(...parsed)
      continue
    }

    generated.push({ key: varName, value })
  }

  return generated
}

export function transpile(filename: string, env: Environment) {
  const keyVals = getKeyVals(env)

  const envText = keyVals.map(({ key, value }) => `${key}=${(value as Primitive).value}`).join("\n")

  const __ = filename.split("/")

  if (__.length) {
    const _fname = __[__.length - 1].split(".")[0] + ".env"

    writeFile(_fname, envText, { encoding: "utf-8" }, (err) => {
      if (err) console.log("Unable to generate .env")
      console.log("Generated:", _fname)
    })
  }
}
