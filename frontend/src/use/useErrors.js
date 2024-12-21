import { ref } from 'vue'
export default function () {
  const errors = ref({})

  // GET ERROR
  const get = (field) => {
    if (!field) return false

    // Vérification pour le cas d'erreur d'array
    if (field.includes('.')) {
      const splitString = field.split('.')

      // FORM.IMAGE_GALLERY.0.IMAGES
      if (splitString.length === 4) {
        const errorOne = errors.value?.[splitString[0]]?.[splitString[1]]?.[`${splitString[2]}.${splitString[3]}`]
        if (errorOne) return errorOne

        return errors.value?.[splitString[0]]?.[splitString[1]]?.[splitString[2]]?.[splitString[3]]?.[0] || false
      }

      // FORM.IMAGE_GALLERY.IMAGES
      if (splitString.length === 3) {
        const errorOne = errors.value?.[splitString[0]]?.[`${splitString[1]}.${splitString[2]}`]
        if (errorOne) return errorOne

        return errors.value?.[splitString[0]]?.[splitString[1]]?.[splitString[2]]?.[0] || false
      }

      // FORM.TITLE
      return errors.value?.[splitString[0]]?.[splitString[1]]?.[0] || false
    }

    // Sans référence de formulaire, par exemple: TITLE
    return errors.value?.[field]?.[0] || false
  }

  const record = (errorData, list = null) => {
    clear()
    if (list) {
      errors.value = [list]
      errors.value[list] = errorData
      return
    }

    errors.value = errorData
  }

  const reset = () => {
    errors.value = {}
  }

  const any = () => {
    return Object.keys(errors.value).length > 0
  }

  const has = (field) => {
    if (!field) return false

    if (field.includes('.')) {
      const splitString = field.split('.')

      if (errors.value?.[splitString[0]]) {
        if (splitString.length === 4) {
          const errorOne = errors.value?.[splitString[0]]?.[splitString[1]]?.[`${splitString[2]}.${splitString[3]}`]
          if (errorOne) return true

          return Boolean(errors.value?.[splitString[0]]?.[splitString[1]]?.[splitString[2]]?.[splitString[3]])
        }

        if (splitString.length === 3) {
          const errorOne = errors.value?.[splitString[0]]?.[`${splitString[1]}.${splitString[2]}`]
          if (errorOne) return true

          return Boolean(errors.value?.[splitString[0]]?.[splitString[1]]?.[splitString[2]])
        }

        return Boolean(errors.value?.[splitString[0]]?.[splitString[1]])
      }

      return false
    }

    return Boolean(errors.value?.[field])
  }

  const clear = (field) => {
    if (field) {
      delete errors.value[field]
    } else {
      errors.value = {}
    }
  }

  const verifyErrorAndClear = (field) => {
    if (has(field)) {
      clearField(field)
    }
  }

  const clearField = (field) => {
    if (!field) return

    if (field.includes('.')) {
      const splitString = field.split('.')
      const listName = splitString[0]
      const fieldName = splitString[1]

      if (errors.value?.[listName]?.[fieldName]) {
        delete errors.value[listName][fieldName]
      }
      return
    }

    delete errors.value[field]
  }

  return {
    errors,
    get,
    record,
    reset,
    any,
    has,
    clear,
    verifyErrorAndClear,
    clearField
  }
}
