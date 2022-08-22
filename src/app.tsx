import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Switch } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import Editor, { Monaco } from '@monaco-editor/react'
import type { editor, IDisposable } from 'monaco-editor'
import validationSchema from 'schemas/validation-schema.json'
import logo from 'assets/logo.svg'
import usePersistedState from 'hooks/use-persisted-state'
import Ajv from 'ajv'
import EditorErrors from 'components/editor-errors'
import FormPreview from 'components/form-preview'
import { ServiceSchema } from 'types/form'
import { useLanguageContext } from 'hooks/use-language'

const ajv = new Ajv()
const ajvValidator = ajv.compile(validationSchema)

export default function App() {
  // @TODO: use usePersistedState to persist the state in local storage
  const [content, setContent] = usePersistedState(
    'form-schema',
    JSON.stringify(
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
    ),
  )

  const editor = useRef<editor.IEditor | null>(null)
  const [markers, setMarkers] = useState<editor.IMarker[]>([])

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: '/',
          fileMatch: ['*'],
          schema: validationSchema,
        },
      ],
    })
  }, [])

  const markerChangeDisposable = useRef<IDisposable | null>(null)

  const handleEditorMount = useCallback(
    (_editor: editor.IEditor, monaco: Monaco) => {
      editor.current = _editor
      markerChangeDisposable.current = monaco.editor.onDidChangeMarkers(
        ([uri]) => {
          setMarkers(monaco.editor.getModelMarkers({ resource: uri }))
        },
      )
    },
    [],
  )

  useEffect(function disposeMarkerChangeListener() {
    return () => {
      markerChangeDisposable.current?.dispose()
    }
  }, [])

  const handleErrorClick = useCallback(
    ({ lineNumber, column }: { lineNumber: number; column: number }) => {
      editor.current?.setPosition({
        lineNumber,
        column,
      })
      editor.current?.focus()
      editor.current?.revealPosition({
        lineNumber,
        column,
      })
    },
    [],
  )

  const validatedFormSchema = useMemo(() => {
    try {
      const parsedData = JSON.parse(content)
      if (ajvValidator(parsedData)) {
        return parsedData as ServiceSchema
      }
      return undefined
    } catch (error) {
      return undefined
    }
  }, [content])

  const { language, setLanguage } = useLanguageContext()

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-10 h-16 bg-white shadow">
        <div className="mx-auto flex h-full max-w-screen-lg items-center">
          <img src={logo} className="mr-2 h-10 w-10" />
          <div className="text-2xl font-bold tracking-tighter">
            Form Schema Validator
          </div>
          <div className="flex-1" />
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
          <Button type="primary" icon={<SaveOutlined />}>
            Save Form
          </Button>
        </div>
      </div>
      <div className="flex h-screen flex-col overflow-hidden pt-16">
        <div className="grid h-full grid-cols-2 overflow-hidden">
          <div className="flex flex-col overflow-hidden border-r">
            <div className="flex-1 border-b">
              <Editor
                language="json"
                value={content}
                onChange={(value) => {
                  setContent(value ?? '')
                }}
                beforeMount={handleBeforeMount}
                onMount={handleEditorMount}
                options={{
                  formatOnPaste: true,
                  formatOnType: true,
                  fontSize: 13,
                }}
              />
            </div>
            <EditorErrors
              className="h-40"
              errors={markers}
              onErrorClick={handleErrorClick}
            />
          </div>
          {/** @TODO: Check for uniqueness among fields and forms */}
          <div className="overflow-auto">
            {validatedFormSchema ? (
              <FormPreview schema={validatedFormSchema} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
