const { BetterDotEnv } = require("../../dist/client")
const { executeCommand, readFile, deleteFile } = require("../_helpers")

const outputEnv = `
APP_HOST=http://localhost
APP_PORT=3000
APP_DB_USERNAME=admin
APP_DB_PASSWORD=136_@rongPas.`

const ouputEnvObj = {
  APP_HOST: "http://localhost",
  APP_PORT: 3000,
  APP_DB_USERNAME: "admin",
  APP_DB_PASSWORD: "136_@rongPas.",
}

const benvFile = "./syntax/private-vars.benv"

describe("Private Variables", () => {
  describe("Client", () => {
    it("should not add private variables in env object", () => {
      const env = new BetterDotEnv().load(benvFile).env
      expect(env).toEqual(ouputEnvObj)
    })
  })
  describe("File", () => {
    it("should not render private variables", async () => {
      const out = await executeCommand(`node ./dist/main.js ${benvFile}`)
      expect(out.trim()).toEqual("Generated: private-vars.env")

      const env = await readFile("./private-vars.env")
      expect(env).toEqual(outputEnv.trim())

      await deleteFile("./private-vars.env")
    })
  })
})
