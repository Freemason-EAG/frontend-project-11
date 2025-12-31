import * as yup from 'yup'

const urlValidator = (value) => {
  const schema = yup.object({
    url: yup.string().url().required(),
  })

  return schema.validate({ url: value.trim() }, { abortEarly: false })
}

export default urlValidator
