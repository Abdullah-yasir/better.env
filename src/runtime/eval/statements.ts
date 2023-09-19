import { Expr, IfElseStatement, NestedBlock, Program, VarDeclaration } from "../../frontend/ast"
import Environment from "../environment"
import { evaluate } from "../interpreter"
import { MK_NULL } from "../macros"
import { BooleanVal, RuntimeVal, ScopeVal } from "../values"

export function eval_program(program: Program, env: Environment): RuntimeVal {
  let evaluated: RuntimeVal = MK_NULL()

  for (const stmt of program.body) evaluated = evaluate(stmt, env)

  return evaluated
}

export function eval_var_declaration(declaration: VarDeclaration, env: Environment): RuntimeVal {
  const value = evaluate(declaration.value, env)

  return env.declareVar(declaration.identifier, value)
}

export function eval_condition(check: Expr, env: Environment): BooleanVal {
  const eval_check = evaluate(check, env) as BooleanVal

  if (eval_check.type != "boolean")
    throw new Error("Restult of check in 'if' statment must be a boolean")

  return eval_check
}

export function eval_if_else_statement(ifstmt: IfElseStatement, env: Environment): RuntimeVal {
  const { check, body, childChecks } = ifstmt

  let result: RuntimeVal = MK_NULL()

  if (eval_condition(check, env).value) {
    result = evaluate(body, env)
  } else if (childChecks && childChecks.length > 0) {
    for (const acheck of childChecks) {
      if (eval_condition(acheck.check, env).value) {
        result = evaluate(acheck.body, env)
        break
      }
    }
  } else if (ifstmt.else) result = evaluate(ifstmt.else, env)

  return result
}

export function eval_nested_block(block: NestedBlock, parentEnv: Environment): RuntimeVal {
  const scope = new Environment(parentEnv)

  for (const stmt of block.variables) evaluate(stmt, scope)

  return { type: "scope", value: scope } as ScopeVal
}
