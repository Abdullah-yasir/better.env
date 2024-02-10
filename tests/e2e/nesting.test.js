const { executeCommand, readFile, deleteFile, objectToEnv } = require("../_helpers")
const { BetterDotEnv } = require("../../dist/client")

const outputObj = {
  ROOT_VAR: "root_value",
  DEV_PORT: 5000,
  DEV_HOST: "https://localhost:5000",
  DEV_DB_USERNAME: "root_value.admin",
  DEV_DB_PASSWORD: "root_value.admin.5000.12345",
  DEV_SECURE: false,
  PROD_PORT: 8080,
  PROD_HOST: "app.cool.com",
  PROD_DB_USERNAME: "admin",
  PROD_DB_PASSWORD: "136_@rongPas.",
  PROD_SECURE: true,
  ENV: "dev",
  LANG: "fr/FR",
}

const outputEnv = objectToEnv(outputObj)

const benvFile = __dirname + "/syntax/nesting.benv"

describe("Indetation", () => {
  describe("Client", () => {
    it("should identify indented blocks", () => {
      const env = {}
      new BetterDotEnv().load(benvFile).append(env)
      expect(env).toEqual(outputObj)
    })
  })
  describe("CLI", () => {
    const envFile = __dirname + "/../../nesting.env"
    it("should identify indented blocks", async () => {
      const out = await executeCommand("node ./dist/main.js " + __dirname + "/syntax/nesting.benv")
      expect(out.trim()).toEqual("Generated: nesting.env")

      const env = await readFile(envFile)
      expect(env).toEqual(outputEnv)

      await deleteFile(envFile)
    })
  })
})
