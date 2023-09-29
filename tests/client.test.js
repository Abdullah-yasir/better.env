const { BetterDotEnv } = require("./../dist/client")
const { readFile, deleteFile } = require("./_helpers")

const outputObj = {
  ROOT_VAR: "root_value",
  DEV_PORT: 5000,
  DEV_HOST: "https://localhost:5000",
  DEV_DB_USERNAME: "root_value.admin",
  DEV_DB_PASSWORD: "root_value.admin.5000.12345",
  DEV_SECURE: false,
  PROD_HOST: "app.cool.com",
  PROD_PORT: 8080,
  PROD_DB_USERNAME: "admin",
  PROD_DB_PASSWORD: "136_@rongPas.",
  PROD_SECURE: true,
  ENV: "dev",
  LANG: "fr/FR",
}

describe("Client", () => {
  it("should load benv from file", () => {
    const env = new BetterDotEnv().load("./syntax/nesting.benv").env
    expect(env).toEqual(outputObj)
  })

  it("should append env to given object", () => {
    const env = {
      EXISITING_VAR1: "HELLO",
      EXISITING_VAR2: "HELLO 2",
    }
    new BetterDotEnv().load("./syntax/nesting.benv").append(env)
    expect(env).toEqual({ ...env, ...outputObj })
  })

  it("should emit .env file", async () => {
    const filePath = "./prod.env"
    new BetterDotEnv().load("./syntax/nesting.benv").emit(filePath)

    const env = await readFile(filePath)
    const envText = Object.entries(outputObj)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n")

    expect(env).toEqual(envText)

    await deleteFile(filePath)
  })

  it("should not allow to edit env object", () => {
    const env = new BetterDotEnv().load("./syntax/nesting.benv").env
    env.ADDED_VAR = "cool"
    env.DEV_DB_USERNAME = "new username"
    delete env.DEV_DB_PASSWORD
    expect(env).toEqual(outputObj)
  })
})
