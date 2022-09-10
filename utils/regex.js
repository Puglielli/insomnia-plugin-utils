const SEPARATE_KEY_VALUE = /(\w+):\s*(?:"([^"]*)"|(\S+))/g
const SPECIAL_CHARACTERS = /[`~!@#$%^&*()_|+\-=?;'",<>\{\}\[\]\\\/]/gi
const COMMENTS = /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g

module.exports = { SEPARATE_KEY_VALUE, SPECIAL_CHARACTERS, COMMENTS }
