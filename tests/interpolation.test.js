const { BetterDotEnv } = require("../dist/client")
const { executeCommand, readFile, deleteFile } = require("./_helpers")

const outputEnv = `
HOST=localhost
PORT=3000
BASE_URL=localhost:3000
API_URL=localhost:3000/api/v1
SECURE_MSG=This url is not secure`

const ouputEnvObj = {
  HOST: "localhost",
  PORT: 3000,
  BASE_URL: "localhost:3000",
  API_URL: "localhost:3000/api/v1",
  SECURE_MSG: "This url is not secure",
}

const benvFile = "./syntax/interpolation.benv"

describe("Interpolation", () => {
  describe("Client", () => {
    it("should evaluate the expressions and variables inside string", () => {
      const env = new BetterDotEnv().load(benvFile).env
      expect(env).toEqual(ouputEnvObj)
    })
  })
  describe("File", () => {
    it("should evaluate the expressions and variables inside string", async () => {
      const out = await executeCommand(`node ./dist/main.js ${benvFile}`)
      expect(out.trim()).toEqual("Generated: interpolation.env")

      const env = await readFile("./interpolation.env")
      expect(env).toEqual(outputEnv.trim())

      await deleteFile("./interpolation.env")
    })
  })
})
