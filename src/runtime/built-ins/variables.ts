import { BuiltIn } from "../../types"
import { MK_BOOL, MK_NULL } from "../macros"

const variables: BuiltIn[] = [
  { name: "true", value: MK_BOOL(true), modifier: "constant", builtIn: true },
  { name: "false", value: MK_BOOL(false), modifier: "constant", builtIn: true },
  { name: "null", value: MK_NULL(), modifier: "constant", builtIn: true },
]

export default variables
