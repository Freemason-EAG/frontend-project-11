import * as yup from 'yup'

const schema = yup.object({
  url: yup.string().url('Enter a valid URL').required('This field is required'),
})

const urlValidator = (value) => {
  return schema.validate({ url: value.trim() })
}

export default urlValidator
