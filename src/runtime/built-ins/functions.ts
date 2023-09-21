import { BuiltIn } from "../../types"
import Environment from "../environment"
import { MK_NATIVE_FN } from "../macros"
import { ArrayVal, StringVal } from "../values"

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
          value: (val as ArrayVal).elements.includes(needle),
          returned: false,
        }

      if (val.type === "string")
        return {
          type: "boolean",
          value: (val as StringVal).value.includes(needle),
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
      const needle = args[1]

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
      const needle = args[1]

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
          value: (val as StringVal).value.toString(),
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
      const start = args[1]
      const end = args[2]

      if (val.type === "array")
        return {
          type: "boolean",
          value: (val as ArrayVal).elements.slice(start, end),
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
