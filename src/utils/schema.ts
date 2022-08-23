import Ajv from 'ajv'
import { ServiceSchema } from 'types/form'
import validationSchema from 'schemas/validation-schema.json'

const ajv = new Ajv()
const ajvValidator = ajv.compile(validationSchema)

export function compileSchema(schemaString: string): ServiceSchema {
  const parsedData = JSON.parse(schemaString)
  if (ajvValidator(parsedData)) {
    return parsedData as ServiceSchema
  }
  throw new Error(ajvValidator.errors?.map((e) => e.message).join('\n'))
}
