const CONTENT_TYPE_JSON = "application/json"
const { COMMENTS } = require('./utils/regex.js')

module.exports.requestHooks = [
	(context) => {
		const body = context.request.getBody()
		
		if (body.mimeType === CONTENT_TYPE_JSON) {
			context.request.setBody(
				{
					...body,
					text: body.text.replace(COMMENTS, (m, g) => g ? "" : m)
				}
			)
		}
	}
]
