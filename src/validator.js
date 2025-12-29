import * as yup from 'yup'

const schema = yup.object({
  url: yup.string().url('Ссылка должна быть валидным URL').required(''),
})

const urlValidator = (value) => {
  return schema.validate({ url: value.trim() }, { abortEarly: false })
}

export default urlValidator
