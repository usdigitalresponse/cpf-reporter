function requiredArgument(value, message = 'required argument missing!') {
  if (value === undefined) {
    throw new Error(message)
  }
}

export { requiredArgument }
