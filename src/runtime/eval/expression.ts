import { ArrayVal, BooleanVal, NativeFnVal, StringVal } from "./../values"
import {
  ArrayLiteral,
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Identifier,
  StringLiteral,
} from "../../frontend/ast"
import Environment from "../environment"
import { evaluate } from "../interpreter"
import { NumberVal, RuntimeVal } from "../values"

function eval_numeric_binary_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string
): NumberVal | BooleanVal {
  if ([">", "<", "==", "!=", "==", ">=", "<="].includes(operator)) {
    let result = false
    if (operator == ">") result = lhs.value > rhs.value
    else if (operator == "<") result = lhs.value < rhs.value
    else if (operator == "==") result = lhs.value == rhs.value
    else if (operator == "!=") result = lhs.value != rhs.value
    else if (operator == ">=") result = lhs.value >= rhs.value
    else if (operator == "<=") result = lhs.value <= rhs.value

    return { type: "boolean", value: result, returned: false }
  }

  let result = 0

  if (operator == "+") result = lhs.value + rhs.value
  else if (operator == "-") result = lhs.value - rhs.value
  else if (operator == "*") result = lhs.value * rhs.value
  else if (operator == "/") result = lhs.value / rhs.value
  else result = lhs.value % rhs.value

  return { type: "number", value: result, returned: false }
}

export function eval_string_binary_expr(
  lhs: StringVal,
  rhs: StringVal,
  operator: string
): BooleanVal {
  let result = false

  if (operator == "==") result = lhs.value == rhs.value
  else if (operator == "!=") result = lhs.value != rhs.value

  return { type: "boolean", value: result, returned: false }
}

export function eval_boolean_binary_expr(
  lhs: BooleanVal,
  rhs: BooleanVal,
  operator: string
): BooleanVal {
  let result = false

  if (operator == "==") result = lhs.value == rhs.value
  else if (operator == "!=") result = lhs.value != rhs.value
  else if (operator == "&&" || operator == "and") result = lhs.value && rhs.value
  else if (operator == "||" || operator == "or") result = lhs.value || rhs.value

  return { type: "boolean", value: result, returned: false }
}

export function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
  const lhs = evaluate(binop.left, env) as StringVal | NumberVal | BooleanVal
  const rhs = evaluate(binop.right, env) as StringVal | NumberVal | BooleanVal

  if (lhs.type == "number" && rhs.type == "number") {
    return eval_numeric_binary_expr(lhs, rhs, binop.operator)
  }

  if (lhs.type == "boolean" && rhs.type == "boolean") {
    return eval_boolean_binary_expr(lhs, rhs, binop.operator)
  }

  if (lhs.type == "string" && rhs.type == "string") {
    return eval_string_binary_expr(lhs, rhs, binop.operator)
  }

  if (lhs.type == "string" && binop.operator == "+") {
    return {
      type: "string",
      value: lhs.value + rhs.value,
      returned: false,
    } as StringVal
  }

  // One or both are NULL
  throw new Error(
    `TYPE_MISMATCH: Unable to perform '${binop.operator}' operation on '${lhs.value}' and '${rhs.value}'`
  )
}

export function eval_identifier(ident: Identifier, env: Environment) {
  const val = env.lookupVar(ident.symbol)
  return val
}

export function eval_array_expr(arr: ArrayLiteral, env: Environment): RuntimeVal {
  const elements = arr.elements.map((el) => evaluate(el, env))

  return { type: "array", elements } as ArrayVal
}

export function eval_assignment(node: AssignmentExpr, env: Environment): RuntimeVal {
  if (node.assigne.kind !== "Identifier") throw new Error("Invalid LHS inside assignment expr")
  const varname = (node.assigne as Identifier).symbol
  const value = evaluate(node.value, env)

  return env.assignVar(varname, value)
}

export function eval_string_literal(node: StringLiteral, env: Environment): RuntimeVal {
  let str = node.value
  for (const ident of node.identifiers) {
    const result = env.lookupVar(ident.replace("$", "")) as StringVal | NumberVal | BooleanVal
    str = str.replace(ident, result.value.toString())
  }

  for (const [placeholder, expr] of Object.entries(node.expressions)) {
    const result = evaluate(expr, env) as StringVal | NumberVal | BooleanVal
    str = str.replace(placeholder, result.value.toString())
  }

  return { type: "string", value: str } as StringVal
}

export function eval_call_expr(expr: CallExpr, env: Environment): RuntimeVal {
  const args = expr.args.map((arg) => evaluate(arg, env))
  const fn = evaluate(expr.caller, env)

  const result = (fn as NativeFnVal).call(args, env)
  return result
}
