export type NodeType =
  // Statements
  | "Program"
  | "VarDeclaration"
  | "IfElseStatement"
  | "NestedBlock"
  // Expressions
  | "AssignmentExpr"
  | "BinaryExpr"
  | "CallExpr"
  // Literals
  | "Property"
  | "StringLiteral"
  | "NumericLiteral"
  | "Identifier"
  | "ArrayLiteral"

export type Type = "string" | "number" | "bool" | "array" | "object" | "dynamic"
export type VarModifier = "constant" | "final" | "variable"

export interface Stmt {
  kind: NodeType
}

export interface Program extends Stmt {
  kind: "Program"
  body: Stmt[]
}

export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr"
  assigne: Expr
  value: Expr
}

export interface VarDeclaration extends Stmt {
  kind: "VarDeclaration"
  identifier: string
  value: Expr | NestedBlock
}

export interface IfElseStatement extends Stmt {
  kind: "IfElseStatement"
  check: Expr
  body: Expr | IfElseStatement
  childChecks?: IfElseStatement[] // "else if" checks
  else?: Expr
}

export interface NestedBlock extends Stmt {
  kind: "NestedBlock"
  variables: Stmt[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
  kind: "BinaryExpr"
  left: Expr
  right: Expr
  operator: string
}

export interface CallExpr extends Expr {
  kind: "CallExpr"
  args: Expr[]
  caller: Expr
}

export interface Identifier extends Expr {
  kind: "Identifier"
  symbol: string
}

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral"
  value: number
}

export interface StringLiteral extends Expr {
  kind: "StringLiteral"
  value: string
  identifiers: string[] // handle embeded variables
  expressions: { [key: string]: Expr }
}

export interface ArrayLiteral extends Expr {
  kind: "ArrayLiteral"
  elements: []
}
