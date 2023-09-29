import Environment from "./environment"
import { NumberVal, RuntimeVal, StringVal } from "./values"
import {
  ArrayLiteral,
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Identifier,
  IfElseStatement,
  NestedBlock,
  // IfElseStatement,
  NumericLiteral,
  Program,
  Stmt,
  StringLiteral,
  VarDeclaration,
} from "../frontend/ast"

import {
  eval_if_else_statement,
  eval_nested_block,
  eval_program,
  eval_var_declaration,
} from "./eval/statements"
import {
  eval_array_expr,
  eval_assignment,
  eval_binary_expr,
  eval_call_expr,
  eval_identifier,
  eval_string_literal,
} from "./eval/expression"

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "Program":
      return eval_program(astNode as Program, env)
    case "NumericLiteral":
      return {
        value: (astNode as NumericLiteral).value,
        type: "number",
      } as NumberVal
    case "StringLiteral":
      return eval_string_literal(astNode as StringLiteral, env) as StringVal
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, env)
    case "AssignmentExpr":
      return eval_assignment(astNode as AssignmentExpr, env)
    case "Identifier":
      return eval_identifier(astNode as Identifier, env)
    case "ArrayLiteral":
      return eval_array_expr(astNode as ArrayLiteral, env)
    case "VarDeclaration":
      return eval_var_declaration(astNode as VarDeclaration, env)
    case "NestedBlock":
      return eval_nested_block(astNode as NestedBlock, env)
    case "IfElseStatement":
      return eval_if_else_statement(astNode as IfElseStatement, env)
    case "CallExpr":
      return eval_call_expr(astNode as CallExpr, env)

    default:
      console.error("This AST can't be interpreted! For now atleast!", astNode)
      process.exit(0)
  }
}
