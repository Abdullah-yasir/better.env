const { BetterDotEnv } = require("../../dist/client")
const { executeCommand, readFile, deleteFile, objectToEnv } = require("../_helpers")

const ouputEnvObj = {
  BUCKET_SIZE: 50,
  DEPLOY: "azure",
  STATUS: "max-uploads",
}

const outputEnv = objectToEnv(ouputEnvObj)

const benvFile = __dirname + "/syntax/conditional.benv"

describe("Conditionals", () => {
  describe("Client", () => {
    it("should have correctly assigned values", () => {
      const env = new BetterDotEnv().load(benvFile).env
      expect(env).toEqual(ouputEnvObj)
    })
  })
  describe("File", () => {
    it("should have correctly assigned values", async () => {
      const out = await executeCommand(`node ./dist/main.js ${benvFile}`)
      expect(out.trim()).toEqual("Generated: conditional.env")

      const env = await readFile("./conditional.env")
      expect(env).toEqual(outputEnv.trim())

      await deleteFile("./conditional.env")
    })
  })
})
