const fs = require('fs')
const uuid = require('uuid')

const CONTENT_TYPE_JSON = "application/json"
const regexComments = /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g
const regexSeparateKeyAndValue = /(\w+):\s*(?:"([^"]*)"|(\S+))/g
const regexSpecialCharacters = /[`~!@#$%^&*()_|+\-=?;'",<>\{\}\[\]\\\/]/gi

getDisplayName = (args) => args[0]
getValueFromArgs = (args) => args[typesMethod.findIndex(item => item.displayName == getDisplayName(args)) + 1]

getJsonFromString = (args) => {
	const value = (typeof (args) == "string") ? args : getValueFromArgs(args)
	const jsonParse = JSON.parse(value)

	return JSON.stringify(jsonParse, undefined, 4)
}

getJsonFromFile = (args) => {
	const path = getValueFromArgs(args)

	if (typeof (path) !== "string" || path.trim().length === 0) return "no file selected!"

	if (!fs.existsSync(path)) return "FILE NOT FOUND"

	const str = fs.readFileSync(path, 'utf8')
	
	return getJsonFromString(str)
}

getObjectFromString = (args) => {
	let obj = {}, values

	while(values = regexSeparateKeyAndValue.exec(args)) { obj[values[1]]=(values[3] || values[2]) }

	return obj
}

random = (args) => {
	let returnValue = ""
	const displayName = getDisplayName(args)
	
	if (displayName.toLowerCase().includes("uuid")) returnValue = uuid.v4()
	
	else if (displayName.toLowerCase().includes("amount")) {
		
		let value = getValueFromArgs(args)
		
		if (!value.includes("min") && !value.includes("max")) {
			console.error(`The input { ${value} } not contain min and max, as in the example: min: 10.00 max: 1000.00`)
			return 0.0
		}
		
		value = value.replace(regexSpecialCharacters, '')
		const obj = getObjectFromString(value)
		
		returnValue = Math.abs( Number(obj.min) + Math.random() * ( Number(obj.max) - Number(obj.min) ) ).toFixed(2)
	}

	else {}

	return returnValue
}

const typesMethod = [
	{
		type: "file",
		displayName: "Schema File - JSON",
		discription: "Raw text input from a file - Json",
		method: (args) => getJsonFromFile(args)
	},
	{
		type: "string",
		displayName: "Schema Inline - JSON",
		discription: "Raw text input from a string - Json",
		defaultValue: "{}",
		method: (args) => getJsonFromString(args)
	},
	{
		type: "file",
		displayName: "Schema File - String",
		discription: "Raw text input from a file",
		method: (args) => JSON.stringify(getJsonFromFile(args))
	},
	{
		type: "string",
		displayName: "Schema Inline - String",
		discription: "Raw text input from a string",
		defaultValue: "{}",
		method: (args) => JSON.stringify(getJsonFromString(args))
	},
	{
		type: "enum",
		displayName: "Random UUID",
		discription: "Generate just a random UUID",
		method: (args) => random(args),
		options: [
			{
				displayName: "v4",
				value: "v4"
			},
			{
				displayName: "v5",
				value: "v5"
			}
		]
	},
	{
		type: "string",
		displayName: "Random amount",
		discription: "Generate just a random amount",
		defaultValue: "min: 0.00 max: 1000.00",
		method: (args) => random(args)
	}
]

populateOptions = (arrayTypes) => arrayTypes.map(key => ( { displayName: key, value: key } ))

populateSubOptions = () =>  typesMethod.map(item => {
	item.hide = (options) => item.displayName != options[0].value
	return item
})

runcathing = (callback, args) => { 
	try { return callback() }
	catch (e) {	
		console.log("error found", e)
		return `error found with arguments: ${args.map( (value, index) => `\nindex: ${index} value: ${value}`)}`
	} 
}

const templateTags = [
	{
		name: 'Utils',
		displayName: 'Utils',
		description: 'Utilities for someone who has lost access to another tool',
		args: [
			{
				displayName: 'Type',
				type: 'enum',
				options: populateOptions(typesMethod.map(item => item.displayName))
			}
		]
		.concat(populateSubOptions()),
	
		async run(_context, ...args) { return runcathing(() => { return typesMethod.find( item => item.displayName == args[0])?.method(args) }, args) }
	}
]

const requestHooks = [
	(context) => {
		const body = context.request.getBody()
		
		if (body.mimeType === CONTENT_TYPE_JSON) {
			context.request.setBody(
				{
					...body,
					text: body.text.replace(regexComments, (m, g) => g ? "" : m)
				}
			)
		}
	}
]

module.exports = { templateTags, requestHooks }