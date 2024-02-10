export enum TokenType {
  NumberLiteral = "NUMBER_LITERAL",
  StringLiteral = "STRING_LITERAL",
  Identifier = "IDENTIFIER",
  SingleLineComment = "SINLE_LINE_COMMENT",

  WhiteSpace = "WHITE_SPACE",
  Tab = "TAB",
  Indent = "INDENT",
  Dedent = "DEDENT",

  EOF = "END_OF_FILE",
  EOL = "END_OF_LINE",

  Equals = "ASSIGNMENT_OPERATOR", // =
  Comma = "COMMA", // ,
  Dot = "DOT", // .
  Exclamation = "EXLAMATION", // "!"
  Colon = "COLON", //":"

  OpenParen = "OPEN_PAREN", //  (
  CloseParen = "CLOSE_PAREN", // )
  OpenBracket = "OPEN_BRACKET", // [
  CloseBracket = "CLOSE_BRACKET", // ]

  LogicGate = "LOGIC_GATE", // && || and or
  AdditiveOperator = "ADDITIVE_OPERATOR", //  + -
  MulitipicativeOperator = "MULTIPICATIVE_OPERATOR", // / * %
  EqualityOperator = "EQUALITY_OPERATOR", // == !=
  RelationalOperator = "RELATIONAL_OPERATOR", // > < >= <=

  // Reserved
  If = "IF",
  Else = "ELSE",
}

export type Spec = {
  regex: RegExp
  tokenType: TokenType
}

export const specs: Spec[] = [
  // { regex: /^[+-]?([\d]*[.])?[\d]+/, tokenType: TokenType.NumberLiteral },
  { regex: /^([\d]*[.])?[\d]+/, tokenType: TokenType.NumberLiteral },
  { regex: /^"[^"]*"/, tokenType: TokenType.StringLiteral },
  { regex: /^'[^']*'/, tokenType: TokenType.StringLiteral },

  { regex: /^\bif\b/, tokenType: TokenType.If },
  { regex: /^\belse\b/, tokenType: TokenType.Else },

  { regex: /^[a-zA-Z_][a-zA-Z0-9_]*/, tokenType: TokenType.Identifier },

  { regex: /^\/\/.*/, tokenType: TokenType.SingleLineComment },
  { regex: /^#.*/, tokenType: TokenType.SingleLineComment },

  // operators
  { regex: /^[+-]/, tokenType: TokenType.AdditiveOperator },
  { regex: /^[*/%]/, tokenType: TokenType.MulitipicativeOperator },
  { regex: /^[><]=?/, tokenType: TokenType.RelationalOperator },
  { regex: /^[=!]=/, tokenType: TokenType.EqualityOperator },

  { regex: /^&&/, tokenType: TokenType.LogicGate },
  { regex: /^\|\|/, tokenType: TokenType.LogicGate },
  { regex: /^\band\b/, tokenType: TokenType.LogicGate },
  { regex: /^\bor\b/, tokenType: TokenType.LogicGate },

  { regex: /^:/, tokenType: TokenType.Colon },
  { regex: /^,/, tokenType: TokenType.Comma },
  { regex: /^\./, tokenType: TokenType.Dot },
  { regex: /^=/, tokenType: TokenType.Equals },
  { regex: /^!/, tokenType: TokenType.Exclamation },
  { regex: /^\(/, tokenType: TokenType.OpenParen },
  { regex: /^\)/, tokenType: TokenType.CloseParen },
  { regex: /^\[/, tokenType: TokenType.OpenBracket },
  { regex: /^\]/, tokenType: TokenType.CloseBracket },

  { regex: /^\r\n/, tokenType: TokenType.EOL },
  { regex: /^\n/, tokenType: TokenType.EOL },

  { regex: /^[^\S\r\n]+/, tokenType: TokenType.WhiteSpace }, // match one or more spaces and tabs
]
