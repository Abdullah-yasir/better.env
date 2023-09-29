import {
  Stmt,
  Expr,
  Program,
  Identifier,
  NumericLiteral,
  BinaryExpr,
  AssignmentExpr,
  IfElseStatement,
  StringLiteral,
  ArrayLiteral,
  NestedBlock,
  VarDeclaration,
  CallExpr,
} from "./ast"
import { Placholder } from "../helpers"
import { TokenType, specs } from "./lexer/specs"
import Tokenizer, { Token } from "./lexer/tokenizer"

export default class Parser {
  constructor(tokens?: Token[]) {
    if (this.tokens) this.tokens = tokens!
  }

  private tokens: Token[] = []

  private not_eof(): boolean {
    return this.tokens[0].type !== TokenType.EOF
  }

  private at(index = 0) {
    return this.tokens[index] as Token
  }

  private eat() {
    return this.tokens.shift() as Token
  }

  private expect(type: TokenType, err: any) {
    const prev = this.eat() as Token
    if (!prev || prev.type !== type) {
      console.log("Parser Error:\n", err, prev, "Expecting: ", type)
      process.exit(1)
    }
    return prev
  }

  // REQ
  private parse_stmt(): Stmt {
    switch (this.at().type) {
      case TokenType.Identifier:
        return this.parse_var_declaration()
      default:
        return this.parse_expr()
    }
  }

  private parse_var_declaration(): Stmt {
    const identifier = this.eat().value

    if (this.at().type == TokenType.Indent) {
      return {
        kind: "VarDeclaration",
        value: this.parse_code_block(),
        identifier,
      } as VarDeclaration
    }

    this.expect(TokenType.Equals, "Expected equals token following identifier in var declaration.")

    const declaration = {
      kind: "VarDeclaration",
      value: this.parse_expr(),
      identifier,
    } as VarDeclaration

    return declaration
  }

  // REQ
  private parse_code_block(): Stmt {
    this.expect(TokenType.Indent, "Expected open paren following if keyword")

    const block: Stmt[] = []

    while (this.at().type !== TokenType.Dedent) block.push(this.parse_stmt())

    this.expect(TokenType.Dedent, "Unexpected ending of indented code block")

    return { kind: "NestedBlock", variables: block } as NestedBlock
  }

  // REQ
  private parse_condition(): Stmt {
    this.expect(TokenType.OpenParen, "Expected open paren following if keyword")

    const check = this.parse_expr() // parse condition

    this.expect(TokenType.CloseParen, "Expected closing paren in if statement after condition")

    return check
  }

  // REQ in place of ternary
  private parse_if_expression(): Stmt {
    this.eat() // eat if token
    const check = this.parse_condition()
    const body = this.parse_expr() // parse if statement body
    const childChecks = []
    // parse 'else if' block, if there's any
    while (this.at().type == TokenType.Else && this.at(1).type == TokenType.If) {
      this.eat() // eat else token
      this.eat() // eat if token
      const childCheck = {
        kind: "IfElseStatement",
        check: this.parse_condition(),
        body: this.parse_expr(),
      } as IfElseStatement
      childChecks.push(childCheck)
    }

    const ifStmt = {
      kind: "IfElseStatement",
      check,
      body,
      childChecks,
    } as IfElseStatement

    // parse 'else' block if there's any
    if (this.at().type == TokenType.Else) {
      this.eat() // eat else token
      ifStmt.else = this.parse_expr()
    }

    return ifStmt
  }

  // REQ
  private parse_expr(): Expr {
    return this.parse_assignment_expr()
  }

  private parse_assignment_expr(): Expr {
    const assigne = this.parse_assigne()

    if (this.at().type == TokenType.Equals) {
      this.eat()
      const value = this.parse_assignment_expr()
      return { value, assigne, kind: "AssignmentExpr" } as AssignmentExpr
    }

    return assigne
  }

  private parse_call_member_expr(): Expr {
    const member = this.parse_primary_expr()

    if (this.at().type == TokenType.OpenParen) return this.parse_call_expr(member)

    return member
  }

  private parse_call_expr(caller: Expr): Expr {
    const call_expr: Expr = {
      kind: "CallExpr",
      caller,
      args: this.parse_args(),
    } as CallExpr

    // to handle foo.x()()
    // if (this.at().type == TokenType.OpenParen) call_expr = this.parse_call_expr(call_expr)

    return call_expr
  }

  private parse_args(): Expr[] {
    this.expect(TokenType.OpenParen, "Expected open paren")
    const args = this.at().type == TokenType.CloseParen ? [] : this.parse_args_list()

    this.expect(TokenType.CloseParen, "Missing closing paren")

    return args
  }

  private parse_args_list(): Expr[] {
    // parsing assignment expr, so that we can first assign, then pass
    // i.e foo(x=5, bar="heavy")
    const args = [this.parse_assignment_expr()]

    while (this.at().type == TokenType.Comma && this.eat()) args.push(this.parse_assignment_expr())

    return args
  }

  private parse_array_expr(): Expr {
    this.eat() // eat [ token

    const elements = []

    while (this.not_eof() && this.at().type != TokenType.CloseBracket) {
      const el = this.parse_expr()
      if (this.at().type == TokenType.Comma) this.eat() // eat comma
      elements.push(el)
    }

    this.expect(TokenType.CloseBracket, "Expected ] in array declaration")

    return { kind: "ArrayLiteral", elements } as ArrayLiteral
  }

  // REQ
  private parse_assigne(): Expr {
    if (this.at().type == TokenType.OpenBracket) {
      return this.parse_array_expr()
    }

    return this.parse_comparitive_expr()
  }

  // REQ
  private parse_comparitive_expr(): Expr {
    let left = this.parse_additive_expr()

    while (
      this.at().type == TokenType.RelationalOperator ||
      this.at().type == TokenType.EqualityOperator ||
      this.at().type == TokenType.LogicGate
    ) {
      const operator = this.eat().value
      const right = this.parse_additive_expr()
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr
    }

    return left
  }

  // REQ
  private parse_additive_expr(): Expr {
    let left = this.parse_multipicative_expr()

    while (this.at().type == TokenType.AdditiveOperator) {
      const operator = this.eat().value
      const right = this.parse_multipicative_expr()
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr
    }

    return left
  }

  // REQ
  private parse_multipicative_expr(): Expr {
    let left = this.parse_call_member_expr()

    while (this.at().type == TokenType.MulitipicativeOperator) {
      const operator = this.eat().value
      const right = this.parse_call_member_expr()
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr
    }

    return left
  }

  // REQ
  private parse_string_literal() {
    const inputString = this.eat().value
    const expressions: { [key: string]: Expr } = {}

    let outputString = inputString

    // handle expressions
    if (inputString.includes("${")) {
      const regex = /\${(.+?)}/g
      const matches = inputString.match(regex) || []

      if (matches.length) {
        let i = 0
        outputString = inputString.replace(regex, () => Placholder.expr(i++)) // replace all expressions with placeholders

        // parse the expressions
        const results = matches.map((match: string) => match.replace(regex, "$1")) // remove ${ } from expressions
        results.forEach((exprStr: string, i: number) => {
          const tokens = new Tokenizer(specs, "").tokenize(exprStr)
          expressions[Placholder.expr(i)] = new Parser(tokens).parse_expr()
        })
      }
    }

    // handle identifiers
    const identRegex = /\$([a-zA-Z_]\w*)/g
    const identifiers = outputString.match(identRegex) || []

    return {
      kind: "StringLiteral",
      value: outputString,
      identifiers,
      expressions,
    } as StringLiteral
  }

  // REQ
  private parse_paren_expression() {
    this.eat() // eat opening paren
    const value = this.parse_expr()
    this.expect(
      TokenType.CloseParen,
      "Unexpected token found in parenthesized expression. Expected closing paren"
    ) // eat closing paren
    return value
  }

  // REQ
  private parse_primary_expr(): Expr {
    const tk = this.at().type

    switch (tk) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier
      case TokenType.NumberLiteral:
        return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral
      case TokenType.StringLiteral:
        return this.parse_string_literal() as StringLiteral
      case TokenType.OpenParen:
        return this.parse_paren_expression()
      case TokenType.If:
        return this.parse_if_expression()
      default:
        console.error("Unexpected token found in parser:", this.at())
        process.exit(1)
    }
  }

  // REQ
  public produceAST(tokens?: Token[]): Program {
    if (tokens) this.tokens = tokens
    const program: Program = {
      kind: "Program",
      body: [],
    }

    if (!this.tokens) throw new Error("Initialization Error: Parser is not initialized with tokens")

    while (this.not_eof()) program.body.push(this.parse_stmt())

    return program
  }
}
