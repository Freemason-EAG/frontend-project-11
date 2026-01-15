import * as yup from 'yup'

const urlValidator = (value, urls, i18nInstance) => {
  const schema = yup.object({
    url: yup.string().url().notOneOf(urls, i18nInstance.t('errors.duplicate')).required(),
  })

  return schema.validate({ url: value.trim() }, { abortEarly: false })
}

export default urlValidator
