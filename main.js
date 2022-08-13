const fs = require('fs')
const uuid = require('uuid')

getJsonFromString = (args) => {
	const str = (typeof (args) == "string") ? args : getObjectFromArgs(args)
	const jsonParse = JSON.parse(str)

	return JSON.stringify(jsonParse, undefined, 4)
}

getJsonFromFile = (args) => {
	const path = getObjectFromArgs(args)

	if (typeof (path) !== "string" || path.trim().length === 0) return "no file selected!"

	if (!fs.existsSync(path)) return "FILE NOT FOUND"

	const str = fs.readFileSync(path, 'utf8')
	
	return getJsonFromString(str)
}

random = (args) => {
	let returnValue = ""
	const type = args[0]
	
	if (type.toLowerCase().includes("uuid")) returnValue = uuid.v4()
	else if (type.toLowerCase().includes("amount")) {
		const obj = getObjectFromArgs(args)
		
		if (!obj.includes("min") && !obj.includes("max")) {
			console.error("The input must contain min and max, as in the example: min: 10.00, max: 1000.00")
			return 0.0
		}

		const str = `{ ${obj.replace('min', '"min"').replace('max', '"max"')} }`
		const amounts = JSON.parse(str)
		console.log(obj)
		console.log(str)
		console.log(amounts)
		
		returnValue = Math.abs(amounts.min + Math.random() * (amounts.max - amounts.min)).toFixed(2)
	}
	else {}

	return returnValue
}


const testTypeMethods = [
	{
		type: "file",
		displayName: "Schema File",
		discription: "Raw text input from a file",
		method: (args) => getJsonFromFile(args)
	},
	{
		type: "string",
		displayName: "Schema Inline",
		discription: "Raw text input from a file",
		defaultValue: "{}",
		method: (args) => getJsonFromString(args)
	},
	{
		type: "enum",
		displayName: "Random UUID",
		discription: "Only generate random UUID",
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
		discription: "Only generate values",
		defaultValue: "min: 0.00, max: 1000.00",
		method: (args) => random(args)
	}
]

populateOptions = (arrayTypes) => arrayTypes.map(key => ( { displayName: key, value: key } ))

populateSubOptions = () =>  testTypeMethods.map(item => {
	item.hide = (args) => item.displayName != args[0].value
	return item
})

runcathing = (callback, args) => { 
	try { return callback() }
	catch (e) {	
		console.log("error found", e)
		return `error found with arguments: ${args.map( (value, index) => `\nindex: ${index} value: ${value}`)}`
	} 
}
getObjectFromArgs = (args) => args[testTypeMethods.findIndex(item => item.displayName == args[0]) + 1]

module.exports.templateTags = [{
	name: 'Utils',
	displayName: 'Utils',
	description: 'Cat because they took the postman :(',
	args: [
		{
			displayName: 'Type',
			type: 'enum',
			options: populateOptions(testTypeMethods.map(item => item.displayName))
		}
	]
	.concat(populateSubOptions()),

	async run(_context, ...args) { return runcathing(() => { return testTypeMethods.find( item => item.displayName == args[0])?.method(args) }, args) }
}]
