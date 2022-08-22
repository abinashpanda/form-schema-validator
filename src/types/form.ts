export type ServiceSchema = {
  id: string
  nameEnglish: string
  nameHindi: string
  forms: FormSchema[]
}

export type FormSchema = {
  id: string
  nameEnglish: string
  nameHindi: string
  fields: FieldSchema[]
}

export type BaseFieldSchema = {
  id: string
  nameEnglish: string
  nameHindi: string
  required?: boolean
}

export type TextField = {
  type: 'text'
}

export type NameField = {
  type: 'name'
  salutation: 'formal' | 'relation'
}

export type ImageUploadField = {
  type: 'image-uploader'
}

export type NumberField = {
  type: 'number'
}

export type CheckboxField = {
  type: 'checkbox'
}

export type Option = { _id: string; nameEnglish: string; nameHindi: string }

export type SelectField = {
  type: 'select'
  options: Option[]
}

export type RadioField = {
  type: 'radio'
  options: Option[]
}

export type AsyncApi =
  | string
  | {
      url: string
      params: Record<string, string>
    }

export type AsyncSelectField = {
  type: 'async-select'
  api: AsyncApi
}

export type AsyncRadioField = {
  type: 'async-radio'
  api: AsyncApi
}

export type MobileField = {
  type: 'mobile'
}

export type FieldSchema = BaseFieldSchema &
  (
    | TextField
    | NameField
    | ImageUploadField
    | NumberField
    | SelectField
    | RadioField
    | CheckboxField
    | AsyncSelectField
    | AsyncRadioField
    | MobileField
  )
