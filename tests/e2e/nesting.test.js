const { executeCommand, readFile, deleteFile, objectToEnv } = require("../_helpers")
const { BetterDotEnv } = require("../../dist/client")

const outputObj = {
  DEV_DB_PASSWORD: "root_value.admin.5000.12345",
  DEV_DB_USERNAME: "root_value.admin",
  DEV_HOST: "https://localhost:5000",
  DEV_PORT: 5000,
  DEV_SECURE: false,
  ENV: "dev",
  LANG: "fr/FR",
  PROD_DB_PASSWORD: "136_@rongPas.",
  PROD_DB_USERNAME: "admin",
  PROD_HOST: "app.cool.com",
  PROD_PORT: 8080,
  PROD_SECURE: true,
  ROOT_VAR: "root_value",
}

const outputEnv = objectToEnv(outputObj)

describe("Indetation", () => {
  describe("Client", () => {
    it("should identify indented blocks", () => {
      const env = {}
      new BetterDotEnv().load("./syntax/nesting.benv").append(env)
      expect(env).toEqual(outputObj)
    })
  })
  describe("CLI", () => {
    it("should identify indented blocks", async () => {
      const out = await executeCommand("node ./dist/main.js ./syntax/nesting.benv")
      expect(out.trim()).toEqual("Generated: nesting.env")

      const env = await readFile("./nesting.env")
      expect(env).toEqual(outputEnv)

      await deleteFile("./nesting.env")
    })
  })
})
