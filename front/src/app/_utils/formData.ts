const appendFormData = (formData: FormData, data: any, rootKey: string = '') => {
  if (Array.isArray(data)) {
    data.forEach((value, index) => {
      appendFormData(value, `${rootKey}[${index}]`)
    })
  } else if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach((key) => {
      if (rootKey) {
        appendFormData(formData, data[key], `${rootKey}[${key}]`)
      } else {
        appendFormData(formData, data[key], key)
      }
    })
  } else {
    formData.append(rootKey, data)
  }
}

const jsonToFormData = (json: Object): FormData => {
  const formData: FormData = new FormData()
  appendFormData(formData, json)

  return formData
}

export default jsonToFormData
