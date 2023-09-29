import { BuiltIn } from "../../types"
import Environment from "../environment"
import { MK_NATIVE_FN } from "../macros"
import { Primitive } from "../transpiler"
import { ArrayVal, NumberVal, RuntimeVal, StringVal } from "../values"

const __ = (val: RuntimeVal) => (val as Primitive).value

const functions: BuiltIn[] = [
  {
    name: "len",
    value: MK_NATIVE_FN((args: any[], _: Environment) => {
      const val = args[0]
      if (val.type === "array")
        return { type: "number", value: (val as ArrayVal).elements.length, returned: false }

      if (val.type === "string")
        return { type: "number", value: (val as StringVal).value.length, returned: false }

      throw new Error(`Cannot get length of type '${val.type}'`)
    }),
    modifier: "final",
  },

  {
    name: "has",
    value: MK_NATIVE_FN((args: any[], _: Environment) => {
      const val = args[0]
      const needle = args[1]
      if (val.type === "array")
        return {
          type: "boolean",
          value: (val as ArrayVal).elements.findIndex((val) => __(val) === __(needle)) !== -1,
          returned: false,
        }

      if (val.type === "string")
        return {
          type: "boolean",
          value: (val as StringVal).value.includes(__(needle) as string),
          returned: false,
        }

      throw new Error(`Cannot call 'has' on type '${val.type}'`)
    }),
    modifier: "final",
  },

  {
    name: "starts",
    value: MK_NATIVE_FN((args: any[], _: Environment) => {
      const val = args[0]
      const needle = __(args[1]) as string

      if (val.type === "string")
        return {
          type: "boolean",
          value: (val as StringVal).value.startsWith(needle),
          returned: false,
        }

      throw new Error(`Cannot call 'startsWith' on type '${val.type}'`)
    }),
    modifier: "final",
  },

  {
    name: "ends",
    value: MK_NATIVE_FN((args: any[], _: Environment) => {
      const val = args[0]
      const needle = __(args[1]) as string

      if (val.type === "string")
        return {
          type: "boolean",
          value: (val as StringVal).value.endsWith(needle),
          returned: false,
        }

      throw new Error(`Cannot call 'endsWith' on type '${val.type}'`)
    }),
    modifier: "final",
  },

  {
    name: "str",
    value: MK_NATIVE_FN((args: any[], _: Environment) => {
      const val = args[0]

      if (val.type === "number")
        return {
          type: "string",
          value: (val as NumberVal).value.toString(),
          returned: false,
        }

      throw new Error(`Cannot call 'toString' on type '${val.type}'`)
    }),
    modifier: "final",
  },

  {
    name: "slice",
    value: MK_NATIVE_FN((args: any[], _: Environment) => {
      const val = args[0]
      const start = __(args[1]) as number
      const end = __(args[2]) as number

      if (val.type === "array")
        return {
          type: "boolean",
          value: (val as ArrayVal).elements.slice(start, end).map((v) => __(v)),
          returned: false,
        }

      if (val.type === "string")
        return {
          type: "boolean",
          value: (val as StringVal).value.slice(start, end),
          returned: false,
        }

      throw new Error(`Cannot call 'slice' on type '${val.type}'`)
    }),
    modifier: "final",
  },
]

export default functions
