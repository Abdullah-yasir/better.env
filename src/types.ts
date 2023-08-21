import { VarModifier } from "./frontend/ast"
import { RuntimeVal } from "./runtime/values"

export type BuiltIn = {
  name: string
  value: RuntimeVal
  modifier: VarModifier
  builtIn?: boolean
}

export type PackageInfo = {
  name: string
  version: string
  description: string
  author: string
  cliName: string
}
