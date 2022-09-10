const { runcathing, getLiveDisplayName, typesMethod } = require('./types-method.js')

buildOptions = (arrayTypes) => arrayTypes.map(type => ( { displayName: type, value: type } ))

buildSubOptions = () => typesMethod.map(
	item => {
		item.hide = (options) => item.displayName != options[0].value
		return item
	}
)

const templateTags = [
	{
		name: 'Utils',
		displayName: 'Utils',
		description: 'Utilities for someone who has lost access to another tool',
		liveDisplayName: (args) => getLiveDisplayName(args),
		args: [
			{
				type: 'enum',
				displayName: 'Options',
				description: "All utils plugin options",
				options: buildOptions(typesMethod.map(item => item.displayName))
			}
		]
			.concat(buildSubOptions()),

		async run(_context, ...args) { return runcathing(() => { return typesMethod.find(item => item.displayName == args[0])?.method(args) }, args) }
	}
]

module.exports = { templateTags }
