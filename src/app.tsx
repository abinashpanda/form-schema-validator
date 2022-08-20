import { useCallback, useMemo, useRef, useState } from 'react'
import { Button, Empty } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import Editor, { Monaco } from '@monaco-editor/react'
import { HiExclamation } from 'react-icons/hi'
import type { editor } from 'monaco-editor'
import validationSchema from 'schemas/validation-schema.json'
import logo from 'assets/logo.svg'

export default function App() {
  // @TODO: use usePersistedState to persist the state in local storage
  const [content, setContent] = useState(
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

  const editor = useRef<editor.IEditor | null>(null)
  const [markers, setMarkers] = useState<editor.IMarker[]>([])
  const handleEditorMount = useCallback(
    (_editor: editor.IEditor, monaco: Monaco) => {
      editor.current = _editor
      // @TODO: Dispose markers when unmounting the editor
      monaco.editor.onDidChangeMarkers(([uri]) => {
        setMarkers(monaco.editor.getModelMarkers({ resource: uri }))
      })
    },
    [],
  )

  const markersContent = useMemo(() => {
    if (markers.length === 0) {
      return (
        <div className="flex h-full items-center justify-center">
          <Empty description="No errors found" />
        </div>
      )
    }

    return (
      <div className="p-2">
        {markers.map(({ message, startColumn, startLineNumber }) => {
          return (
            <button
              key={`${message}-${startColumn}-${startLineNumber}`}
              className="flex items-center space-x-2 p-1 text-sm"
              onClick={() => {
                editor.current?.setPosition({
                  lineNumber: startLineNumber,
                  column: startColumn,
                })
                editor.current?.focus()
              }}
            >
              <HiExclamation className="h-4 w-4 text-yellow-500" />
              <div>
                {message} [Ln {startLineNumber}, Col {startColumn}]
              </div>
            </button>
          )
        })}
      </div>
    )
  }, [markers])

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-10 h-16 bg-white shadow">
        <div className="mx-auto flex h-full max-w-screen-lg items-center">
          <img src={logo} className="mr-2 h-10 w-10" />
          <div className="text-2xl font-bold tracking-tighter">
            Form Schema Validator
          </div>
          <div className="flex-1" />
          <Button className="ml-4" type="primary" icon={<SaveOutlined />}>
            Save Form
          </Button>
        </div>
      </div>
      <div className="flex h-screen flex-col pt-16">
        <div className="grid h-full grid-cols-2 overflow-hidden">
          <div className="flex flex-col border-r">
            <div className="flex-1 border-b">
              <Editor
                language="json"
                theme="vs-dark"
                value={content}
                onChange={(value) => {
                  setContent(value ?? '')
                }}
                beforeMount={handleBeforeMount}
                onMount={handleEditorMount}
              />
            </div>
            <div className="h-40 overflow-auto">{markersContent}</div>
          </div>
          {/** @TODO: Check for uniqueness among fields and forms */}
          <div />
        </div>
      </div>
    </>
  )
}
