const { BetterDotEnv } = require("../../dist/client")
const { executeCommand, readFile, deleteFile, objectToEnv } = require("../_helpers")

const ouputEnvObj = {
  PROD_HOST: "app.cool.com",
  PROD_PORT: 8080,
  PROD_DB_USERNAME: "admin",
  PROD_DB_PASSWORD: "136_@rongPas.",
  APP_HOST: "app.cool.com",
  APP_PORT: 8080,
  APP_DB_USERNAME: "admin",
  APP_DB_PASSWORD: "136_@rongPas.",
}

const outputEnv = objectToEnv(ouputEnvObj)

const benvFile = __dirname + "/syntax/assign-blocks.benv"

describe("Block Assignment", () => {
  describe("Client", () => {
    it("should assign contens of one block to assignee", () => {
      const env = new BetterDotEnv().load(benvFile).env
      expect(env).toEqual(ouputEnvObj)
    })
  })
  describe("File", () => {
    it("should assign contens of one block to assignee", async () => {
      const out = await executeCommand(`node ./dist/main.js ${benvFile}`)
      expect(out.trim()).toEqual("Generated: assign-blocks.env")

      const env = await readFile("./assign-blocks.env")
      expect(env).toEqual(outputEnv)

      await deleteFile("./assign-blocks.env")
    })
  })
})
