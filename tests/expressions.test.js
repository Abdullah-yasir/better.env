const { BetterDotEnv } = require("../dist/client")
const { executeCommand, readFile, deleteFile } = require("./_helpers")

const outputEnv = `
ADD=68
SUB=1
SUB_1=-10
MUL=45
DIV=4
MIX_EXPR=-1
PAREN_EXPR_1=16
PAREN_EXPR_2=10
GREATER=true
GREATER_EQ=true
LESS=true
LESS_EQ=true
EQUALS=true
NOT_EQUALS=true
AND=true
OR=true`

const ouputEnvObj = {
  ADD: 68,
  SUB: 1,
  SUB_1: -10,
  MUL: 45,
  DIV: 4,
  MIX_EXPR: -1,
  PAREN_EXPR_1: 16,
  PAREN_EXPR_2: 10,
  GREATER: true,
  GREATER_EQ: true,
  LESS: true,
  LESS_EQ: true,
  EQUALS: true,
  NOT_EQUALS: true,
  AND: true,
  OR: true,
}

const benvFile = "./syntax/expressions.benv"

describe("Expressions", () => {
  describe("Client", () => {
    it("should evaluate the expressions and variables", () => {
      const env = new BetterDotEnv().load(benvFile).env
      expect(env).toEqual(ouputEnvObj)
    })
  })
  describe("File", () => {
    it("should evaluate the expressions and variables", async () => {
      const out = await executeCommand(`node ./dist/main.js ${benvFile}`)
      expect(out.trim()).toEqual("Generated: expressions.env")

      const env = await readFile("./expressions.env")
      expect(env).toEqual(outputEnv.trim())

      await deleteFile("./expressions.env")
    })
  })
})
