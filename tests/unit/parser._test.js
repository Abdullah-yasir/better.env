/// <reference types="jest"/>

const path = require("path")

const Parser = require("../../dist/frontend/parser").default
const { Organizer, Tokenizer } = require("../../dist/frontend/lexer/tokenizer")
const { specs } = require("../../dist/frontend/lexer/specs")
const { readFile } = require("../_helpers")

async function tokenize(filepath) {
  const code = await readFile(filepath)
  let tokens = new Tokenizer(specs, "test.benv").tokenize(code)
  console.log({ code, tokens })
  tokens = new Organizer().organize(tokens).filter().filter().tokens
  return tokens
}

describe("Parser", () => {
  test("parse_stmt", async () => {
    const tokens = await tokenize(path.join(__dirname, "syntax", "parse_stmt.benv"))
    const ast = new Parser().produceAST(tokens)
    expect(ast).toEqual({})
  })

  test("parse_var_declaration", () => {})

  test("parse_code_block", () => {})

  test("parse_condition", () => {})

  test("parse_if_condition", () => {})

  test("parse_expr", () => {})

  test("parse_assignment_expr", () => {})

  test("parse_call_member_expr", () => {})

  test("parse_call_expr", () => {})

  test("parse_args", () => {})

  test("parse_args_list", () => {})

  test("parse_array_expr", () => {})

  test("parse_assigne", () => {})

  test("parse_comparitive_expr", () => {})

  test("parse_additive_expr", () => {})

  test("parse_multipicative_expr", () => {})

  test("parse_string_literal", () => {})

  test("parse_parent_expression", () => {})

  test("parse_primary_expr", () => {})
})
