const fs = require('fs')
const uuid = require('uuid')
const moment = require('moment')

const { SEPARATE_KEY_VALUE, SPECIAL_CHARACTERS } = require('./utils/regex.js')

const runcathing = (callback, args) => {
	try { return callback() }
	catch (e) {
		console.error(`Error founds! \n The following list of arguments were used: \n ${args.map((value, index) => `\nindex: ${index} value: ${value}`)}. \n`, e)
		return "Errors found from a look at console logs"
	}
}

const getDisplayName = (args) => args[0]

const getArgsValue = (args) => args[typesMethod.findIndex(item => item.displayName == getDisplayName(args)) + 1]

const jsonToString = (args) => {
	const json = stringToJson(args)

	return JSON.stringify(json, undefined, 4)
}

const stringToJson = (args) => {
	const value = (typeof (args) == "string") ? args : getArgsValue(args)

	return JSON.parse(value)
}

const fileToString = (args) => {
	const path = getArgsValue(args)

	if (typeof (path) !== "string" || path.trim().length === 0) return "no file selected!"

	if (!fs.existsSync(path)) return "FILE NOT FOUND"

	return fs.readFileSync(path, 'utf8')
}

const toObject = (args) => {
	let obj = {}, values

	while (values = SEPARATE_KEY_VALUE.exec(args)) { obj[values[1]] = (values[3] || values[2]) }

	return obj
}

const containsKeys = (str, ...keys) => {
	const containedKeys = keys.filter(key => str.includes(`${key}:`))
	const missingKeys = keys.filter((item) => containedKeys.indexOf(item) < 0)

	return {
		ok: missingKeys.length == 0,
		missingKeys: missingKeys
	}
}

const random = (args) => {
	let returnValue = ""
	const displayName = getDisplayName(args)

	if (displayName.toLowerCase().includes("uuid")) returnValue = uuid.v4()

	else if (displayName.toLowerCase().includes("amount")) {
		let value = getArgsValue(args)
		const keys = ["min", "max"]

		let isValid = containsKeys(value, ...keys)

		if (!isValid.ok) {
			const errorMessage = `The input { ${value} } not contain all keys [${keys}] is missing ${isValid.missingKeys}, as in the example: min: 10.00 max: 1000.00`
			console.error(errorMessage)
			return errorMessage
		}

		value = value.replace(SPECIAL_CHARACTERS, '')
		const obj = toObject(value)

		returnValue = Math.abs(Number(obj.min) + Math.random() * (Number(obj.max) - Number(obj.min))).toFixed(2)
	}

	return returnValue
}

const dateTimeNow = (args) => {
	let pattern = getArgsValue(args)
	var now = new Date();
	
	const date = moment(now).format(pattern);

	return date

}

const getLiveDisplayName = (args) => {
	const displayName = getDisplayName(args).value
	const liveDisplay = typesMethod.filter(type => type.displayName == displayName)[0]?.liveDisplayName || displayName

	return liveDisplay
}

const typesMethod = [
	{
		type: "file",
		displayName: "File (Returns Json object)",
		liveDisplayName: "File Json",
		description: "Raw text input from a file. (input: Json file, output: Json)",
		method: (args) => stringToJson(fileToString(args))
	},
	{
		type: "file",
		displayName: "File (Returns Json string)",
		liveDisplayName: "File String",
		description: "Raw text input from a file. (input: Json file, output: String)",
		method: (args) => jsonToString(fileToString(args))
	},
	{
		type: "string",
		displayName: "String to Json",
		liveDisplayName: "String Json",
		description: "Raw json string. (input: String, output: Json)",
		defaultValue: "{}",
		method: (args) => stringToJson(args)
	},
	{
		type: "string",
		displayName: "Json to String",
		liveDisplayName: "Json String",
		description: "Raw json string. (input: Json, output: String)",
		defaultValue: "{}",
		method: (args) => jsonToString(args)
	},
	{
		type: "enum",
		displayName: "Random UUID",
		liveDisplayName: "UUID",
		description: "Generate just a random UUID",
		method: (args) => random(args),
		options: [
			{
				displayName: "v4",
				value: "v4"
			}
		]
	},
	{
		type: "string",
		displayName: "Random amount",
		liveDisplayName: "Amount",
		description: "Generate just a random amount",
		defaultValue: "min: 0.00 max: 1000.00",
		method: (args) => random(args)
	},
	{
		type: "string",
		displayName: "Date Time Now",
		liveDisplayName: "Date Time Now",
		description: "Informe Pattern to date format.",
		defaultValue: "YYYY-MM-DD",
		method: (args) => dateTimeNow(args)
	}
]

module.exports = {
	runcathing,
	getLiveDisplayName,
	typesMethod,
}
