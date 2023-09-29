const fs = require("fs")
const { BetterDotEnv } = require("../dist/client")

jest.mock("fs")

describe("Built Ins", () => {
  describe("len", () => {
    it("should return the length of a string", () => {
      const raw = `COUNT=len("Hello World")`
      fs.readFileSync.mockReturnValue(raw)

      const env = new BetterDotEnv().load("mock.benv").env
      expect(env).toEqual({ COUNT: 11 })
    })
    it("should return the length of an array", () => {
      const raw = `COUNT=len(["Hello", "World"])`
      fs.readFileSync.mockReturnValue(raw)

      const env = new BetterDotEnv().load("mock.benv").env
      expect(env).toEqual({ COUNT: 2 })
    })
  })

  describe("str", () => {
    it("should convert a number to string", () => {
      const raw = `STR=str(99)`
      fs.readFileSync.mockReturnValue(raw)

      const env = new BetterDotEnv().load("mock.benv").env
      expect(typeof env.STR).toEqual("string")
    })
  })

  describe("has", () => {
    it("should return true if a string contains a value", () => {
      const raw = `HAS=has("Hello World", "Wo")`
      fs.readFileSync.mockReturnValue(raw)

      const env = new BetterDotEnv().load("mock.benv").env
      expect(env).toEqual({ HAS: true })
    })
    it("should return true if an array contains a value", () => {
      const raw = `HAS=has(["Hello","World", "Here"], "World")`
      fs.readFileSync.mockReturnValue(raw)

      const env = new BetterDotEnv().load("mock.benv").env
      expect(env).toEqual({ HAS: true })
    })
  })

  describe("ends", () => {
    it("should return true if a string starts with a value", () => {
      const raw = `ENDS=ends("Hello World", "ld")`
      fs.readFileSync.mockReturnValue(raw)

      const env = new BetterDotEnv().load("mock.benv").env
      expect(env).toEqual({ ENDS: true })
    })
  })

  describe("starts", () => {
    it("should return true if a string starts with a value", () => {
      const raw = `STARTS=starts("Hello World", "He")`
      fs.readFileSync.mockReturnValue(raw)

      const env = new BetterDotEnv().load("mock.benv").env
      expect(env).toEqual({ STARTS: true })
    })
  })

  describe("slice", () => {
    it("should return the portion a string", () => {
      const raw = `SUBSTRING=slice("Hello World", 0, 2)`
      fs.readFileSync.mockReturnValue(raw)

      const env = new BetterDotEnv().load("mock.benv").env
      expect(env).toEqual({ SUBSTRING: "He" })
    })
    it("should return the subset of an array", () => {
      const raw = `SUBSET=slice(["A", "B", "C", "D"], 1, 2)`
      fs.readFileSync.mockReturnValue(raw)

      const env = new BetterDotEnv().load("mock.benv").env
      expect(env).toEqual({ SUBSET: ["B"] })
    })
  })
})
