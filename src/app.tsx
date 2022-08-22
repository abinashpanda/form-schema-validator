import { useCallback, useRef, useState } from 'react'
import { Button, message, Switch } from 'antd'
import { CodeOutlined, SaveOutlined } from '@ant-design/icons'
import validationSchema from 'schemas/validation-schema.json'
import usePersistedState from 'hooks/use-persisted-state'
import Ajv from 'ajv'
import FormPreview from 'components/form-preview'
import { ServiceSchema } from 'types/form'
import { useLanguageContext } from 'hooks/use-language'
import Editor from 'components/editor'
import Navbar from 'components/navbar'

const ajv = new Ajv()
const ajvValidator = ajv.compile(validationSchema)

const INITIAL_DATA = JSON.stringify(
  {
    id: 'service-id',
    nameEnglish: 'Service Name English',
    nameHindi: 'सेवा का नाम',
    forms: [
      {
        id: 'form-id',
        nameEnglish: 'Form Name English',
        nameHindi: 'फॉर्म का नाम',
        fields: [],
      },
    ],
  },
  null,
  4,
)

export default function App() {
  const { language, setLanguage } = useLanguageContext()

  const [content, setContent] = usePersistedState('form-schema', INITIAL_DATA)

  const [validatedSchema, setValidatedSchema] = useState<
    ServiceSchema | undefined
  >(undefined)
  const handleCompileSchema = useCallback(() => {
    try {
      const parsedData = JSON.parse(content)
      if (ajvValidator(parsedData)) {
        setValidatedSchema(parsedData as ServiceSchema)
      } else {
        message.error(
          ajvValidator.errors?.map((error) => error.message).join('\n'),
        )
      }
    } catch (error) {
      message.error((error as Error).message)
    }
  }, [content])

  const editor = useRef<{ formatContent: () => void }>(null)

  return (
    <>
      <Navbar>
        <label htmlFor="language" className="mr-2 text-right capitalize">
          {language}
        </label>
        <Switch
          className="!mr-8"
          checked={language === 'hindi'}
          onChange={(value) => {
            if (value) {
              setLanguage('hindi')
            } else {
              setLanguage('english')
            }
          }}
        />
        <Button
          className="mr-4"
          onClick={() => {
            editor.current?.formatContent()
          }}
        >
          Format Code
        </Button>
        <Button
          className="mr-4"
          icon={<CodeOutlined />}
          onClick={handleCompileSchema}
        >
          Compile
        </Button>
        <Button type="primary" icon={<SaveOutlined />}>
          Save Form
        </Button>
      </Navbar>
      <div className="flex h-screen flex-col overflow-hidden pt-16">
        <div className="grid h-full grid-cols-2 overflow-hidden">
          <Editor
            ref={editor}
            content={content}
            setContent={setContent}
            className="border-r"
          />
          {/** @TODO: Check for uniqueness among fields and forms */}
          <div className="overflow-auto">
            {validatedSchema ? <FormPreview schema={validatedSchema} /> : null}
          </div>
        </div>
      </div>
    </>
  )
}
