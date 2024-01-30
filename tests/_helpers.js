const { exec } = require("child_process")
const fs = require("fs")

module.exports.executeCommand = function (command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error)
      if (stderr) reject(stderr)
      resolve(stdout)
    })
  })
}

module.exports.createFile = function (filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (error, data) => {
      if (error) reject(error)
      resolve(data)
    })
  })
}

module.exports.readFile = function (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (error, data) => {
      if (error) reject(error)
      resolve(data)
    })
  })
}

module.exports.deleteFile = function (filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error) => {
      if (error) reject(error)
      resolve(filePath)
    })
  })
}

module.exports.envTextToObject = function (text) {
  const lines = text.split("\n")
  const result = {}

  for (const line of lines) {
    const [key, value] = line.split("=")
    if (key && value) {
      result[key.trim()] = value.trim()
    }
  }

  return result
}

module.exports.objectToEnv = function (obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")
}
