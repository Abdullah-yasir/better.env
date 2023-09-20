# better.env

### Quick Links
- [Introduction](#introduction) 
- [Features](#features) 
- [Getting Started](#getting-started) 
	- [Using CLI](#using-command-line)
	- [Using Client](#using-client)
- [Syntax](#syntax)
	- [Variables](#key-value-pairs)
	- [Arrays](#arrays)
	- [Interpolation](#interpolation)
	- [Expressions](#expressions)
	- [Indented Blocks](#indented-blocks)
	- [Variable Scope](#variable-scope)
	- [Operators](#operators)
- [Configurations](#configuration) 

### Introduction
`better.env` is created for handling `.env` in better and powerful way

### Features
- Create nested blocks instead of repetative prefixes
- Use conditionals in variable assignment
- Easily interpolate value of one variable into another
- Emit regular `.env` if needed
- No need to install any other package for reading `.env`

### Getting Started
> There are two ways to use **better.env** in your project:
> 1. [Using Command Line](#using-command-line)
> 2. [Using Client](#using-client) 
>
> We will guide you through both

1. For installation run following command
	```bash
	npm install @better/dotenv
	```
2. Create a file named `environment.benv`, you can choose any name of your liking, the restriction is it should have `.benv` extension
	```bash
	touch environment.benv
	```
	> If you are on Windows OS, make sure to run above command in `bash` terminal. `touch` command is not available in `Commad Prompt` or `Power Shell`
3. Add your variables
	```bash
	echo << EOF
	ENV="prod" 
	ROOT_VAR="root_value" 

	DEV: 
		PORT=5000
		HOST="http://localhost"
		API_URL="$HOST:$PORT/api/v1"
		DB:
			USERNAME="$ROOT_VAR.admin"
			PASSWORD="$USERNAME-12345"
			PORT=5432
		SECURE=false

	PROD:
		PORT=8080
		HOST="https://app.cool.com"
		API_URL="$HOST/api/v1"
		DB:
			USERNAME="admin"
			PASSWORD="136_@rongPas."
			PORT=5432
		SECURE=true

	UPLOAD_CLOUD=ENV == "prod"

	EOF >> environment.benv

 	```
	#### Using Command Line
	> Make sure you've followed the initial steps in [Getting Started](#getting-started)
	4. Now add a new script in your `package.json`
		```json
		"scripts": {
			...
			"benv": "benv environment.benv"
		}
		```
	5. Now run newly created `benv` script
		```bash
		npm run benv
		```
	6. By following above steps, you'll see a new file named `environment.env` is created in your project, take a look and see what you can do with **better.env**

	#### Using Client
	> Make sure you've followed the initial steps in [Getting Started](#getting-started)
	4. Create new file named: `config.js` in your project, again you can choose any filename
		```bash
		touch config.js
		```
	5. Add following code in the file
		```js
		const BetterDotEnv = require("@better/env")

		const client = new BetterDotEnv()
			.load("path/to/environment.benv")

		// Append variables to `process.env`
		client.append(process.env)

		// [OR] You can export config object directly without using `process.env`
		module.exports = client.env
		```
	6. Consuming variables
		```js
		const env = require("path/to/config.js")

		console.log(env.ENV)
		console.log(env.DEV_API_URL)
		console.log(env.DEV_DB_PORT)

		// [OR] If you've appended variables to `process.env`
		console.log(process.env.ENV)
		console.log(process.env.DEV_API_URL)
		console.log(process.env.DEV_DB_PORT)
		```


### Syntax
#### Key Value Pairs
Creating a variable, it starts with variable name, then equal sign followed by the value of the variable
```bash
# String
HOST="http://localhost"

# Number
MAX_UPLOADS=50

# Boolean
UPLOAD_AWS=false

# Array
ALLOWED_METHODS=["get", "post", "patch"]
```
#### Arrays
You can create any array just like you do in `javascript`
```bash
ALLOWED_ORIGINS=["https://some.app.com", "https://another.com"]

ALLOWED_METHODS=["get", "post", "patch"]
```
> **better.env** allows to define arrays,but to utilize them fully as `javascript` array, you have to use [Client Method](#using-client)

When you transpile above to `.env` [Using CLI Method](#using-client), the array will get transpiled as:
```bash
ALLOWED_METHODS_1=get
ALLOWED_METHODS_2=post
ALLOWED_METHODS_3=patch
```
ℹ️ You can disable this behaviour by setting `arrays.transpile:false`

See [Configurations](#configuration) section for details.

#### Interpolation
A value of one variable can be used in another variable, so you've to change it at one place if needed
```bash
PORT=5000
HOST="http://localhost"
BASE_URL="$HOST:$PORT"
```
#### Expressions
You can calculate the value of the variable by doing arithemtic operations
```bash
VAR_ONE=5
VAR_TWO=10

VAR_THREE=50 + 49 - 3
VAR_FOUR=VAR_ONE + VAR_TWO / VAR_THREE

FILE_SIZE=50

UPLOAD_AWS=FILE_SIZE > 50
UPLOAD_AZURE=FILE_SIZE <= 50
```
To interpolate expressions inside the string, wrap expression inside ${ and }
```bash
BASE=50
BUILD_NUMBER="build: ${BASE + 45}"
```

#### Conditionals
**better.env** supports its own version of `if-else` statements, so you can conditionally assign values
```bash
ENV="dev"
UPLOAD_ON=if(ENV == "prod") "aws" else "server"
```
#### Indented Blocks
Isolated scopes can be created by nested the key values pairs under a key
```bash
DEV: 
	PORT=5000
	HOST="http://localhost"
	API_URL="$HOST:$PORT/api/v1"
	DB:
		USERNAME="admin"
		PASSWORD="$USERNAME-12345-$PORT"
		PORT=5432
	SECURE=false
```

#### Variable Scope
- Child scope can read any variable in any of the parent scopes but not other way round. 
- And sibling scopes can also not read a value of one and another.

#### Operators
| Operator | Description            |
| -------- | ---------------------- |
| >        | Greater Than           |
| >=       | Greater Than Or Equals |
| <        | Less Than              |
| <=       | Less Than Or Equals    |
| ==       | Equals                 |
| !=       | Not Equals             |
| =        | Assignment             |
| &&       | And                    |
| \|\|     | Or                     |
| and      | And                    |
| or       | Or                     |
### Configurations
The behaviour of **better.env** can be modified by specifying below configurations in `.benvrc` file or `BetterDotEnv()` constructor.
```javascript
{
	arrays: {
		transpile: true // Wether to convert arrays to numbered variables when emitted to `.env`
		allow: true // Set it to false if you want to restrict arrays in .benv file
	},
	strings: {
		quotes: false // Wether to surround strins with quotes when emitted to .env
	},
	numbers:{
		toString: false // Convert numbers to string
	},
	booleans: {
		toString: false, // Convert booleans to string
		// Convert booleans to numbers, i.e 1 for true and 0 for false
		toNumber: false
	},
	benvPath: "", // Where `better.env` should look for .benv files
	scopeFiles: true, // Whether better.env should append variables from all files to single object, or create a key for each file and then append the variables
	emitPath: "" // Where to emit .env files
	emit: false // Whether to create .env files or not
}
```
> When copy pasting above configurations in `.benvrc` file, make sure you enclose all the keys in double quotes, just like in JSON

For Example
```json
{
	"arrays": {
		"transpile": false
	},
}
```
You can use them as is inside the Constructor.
```javascript
// ...
new BetterDotEnv({
	arrays: {
		transpile: false
	}
})
// ...
```
> If you've configurations both in `.benvrc` and the Constructor, the one in Contructor will have higher precedence, and will override same configurations from `.benvrc`
### Feature Requests
- Assign a complete block to a variable, so that the variables of that block are assigned to assignee
- Ability to create private variables that do not get transpiled
- Add string helper methods
	- length(str)
	- contains(str, needle)
	- startsWith(str, needle)
	- endsWidth(str, needle)
	- substring(str, start, end)