# insomnia-plugin-utils

Create complex or simple functions for your data directly in the Insomnia REST Client!

This plugin is published in [npm](https://www.npmjs.com/package/insomnia-plugin-utils).


## Installation

1. Open Insomnia.
2. Go to **Insomnia > Preferences**.
3. Go to "Plugins" tab.
4. Type "insomnia-plugin-utils" in the "Install Plugin" field.
5. Click "Install Plugin".

_Any questions about installing the plugin, go to [Insomnia "Managing plugins" documentation](https://support.insomnia.rest/article/26-plugins#managing-plugins)._


## Usage

Use [Template Tags](https://docs.insomnia.rest/insomnia/template-tags) (i.e. CTRL + SPACE, then find "Utils - *") to add plugin types.

![Screenshot](https://raw.githubusercontent.com/Puglielli/insomnia-plugin-utils/main/docs/images/template-tags-utils.png)

### Examples

- Random UUID
  - ![Screenshot](https://raw.githubusercontent.com/Puglielli/insomnia-plugin-utils/main/docs/images/example-uuid.png)

- Random Amount (to use the `Random amount` type, you need to enter two fields `min` and `max`)
  - ![Screenshot](https://raw.githubusercontent.com/Puglielli/insomnia-plugin-utils/main/docs/images/example-amount.png)


## Creativity and Imagination

- The `Random amount` type is an example of what can be created with this plugin, you can pass as many `key:value` as you need and assemble the return you want without having to do much.

- Structure of the types object.

  ```
  {
    type: string,
    displayName: string,
    liveDisplayName: string,
    description: string,
    method: (context) => (args) => expression,

    // Only type === 'enum'
    options: Array<{
      {
        displayName: string,
        value: string
      }
    ]
  }
  ```

### Example to add new basic type

- Open the file `types-method.js`.
- Look up for the variable `typesMethod`.
- You can follow the pattern of [insomnia](https://docs.insomnia.rest/insomnia/template-tags) doc itself or duplicate existing types except `Random amount`.

### Example to add new complex type

- Open the file `types-method.js`.
- Look up for the variable `typesMethod`.
- Now to create one more complex type like `Random amount`.

- Structure type
  ```
  {
    type: "string",
    displayName: "Random names",
    liveDisplayName: "Name",
    description: "Generate random names",
    defaultValue: "names: Philip,Luciana",
    method: (args) => random_names(args)
  }
  ```

- Structure function
  ```
  const random_names = (args) => {
    const value = getArgsValue(args)
    const keys = ["names"]

    let isValid = containsKeys(value, ...keys)

    if (!isValid.ok) {
      const errorMessage = `The input { ${value} } not contain all keys [${keys}] is missing ${isValid.missingKeys}`
      console.error(errorMessage)
      return errorMessage
    }

    const obj = toObject(value)

    names = obj.names.split(',')

    const random = Math.floor(Math.random() * names.length);

    return names[random]
  }
  ```
