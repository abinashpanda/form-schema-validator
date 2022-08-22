import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import MonacoEditor, { useMonaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import EditorErrors from 'components/editor-errors'
import validationSchema from 'schemas/validation-schema.json'

type EditorProps = {
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
  className?: string
  style?: React.CSSProperties
}

function Editor(
  { content, setContent, className, style }: EditorProps,
  ref: React.Ref<{
    getEditorInstance?: () => editor.IEditor | null
    formatContent?: () => void
  }>,
) {
  const monaco = useMonaco()

  const editor = useRef<editor.IEditor | null>(null)
  useImperativeHandle(ref, () => ({
    getEditorInstance: () => {
      return editor.current
    },
    formatContent: () => {
      editor.current?.trigger(
        'format-button',
        'editor.action.formatDocument',
        {},
      )
    },
  }))

  useEffect(
    function setJSONValidation() {
      monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: '/',
            fileMatch: ['*'],
            schema: validationSchema,
          },
        ],
        schemaValidation: 'error',
      })
    },
    [monaco],
  )

  const [markers, setMarkers] = useState<editor.IMarker[]>([])

  useEffect(
    function listenToMarkerChanges() {
      const disposable = monaco?.editor.onDidChangeMarkers(([uri]) => {
        setMarkers(monaco.editor.getModelMarkers({ resource: uri }))
      })

      return () => {
        disposable?.dispose()
      }
    },
    [monaco],
  )

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

  return (
    <div
      className={clsx('flex flex-col overflow-hidden', className)}
      style={style}
    >
      <div className="flex-1 border-b">
        <MonacoEditor
          language="json"
          value={content}
          onChange={(value) => {
            setContent(value ?? '')
          }}
          onMount={(_editor) => {
            editor.current = _editor
          }}
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
  )
}

export default forwardRef(Editor)
