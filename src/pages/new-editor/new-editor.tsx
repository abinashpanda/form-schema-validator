import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, message } from 'antd'
import { CodeOutlined, SaveOutlined } from '@ant-design/icons'
import usePersistedState from 'hooks/use-persisted-state'
import FormPreview from 'components/form-preview'
import { ServiceSchema } from 'types/form'
import Editor from 'components/editor'
import { useOutletContext } from 'react-router-dom'
import { compileSchema } from 'utils/schema'
import { useAuthContext } from 'hooks/use-auth'
import SaveNewFormModal from 'components/save-new-form-modal'

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

export default function NewEditor() {
  const editor = useRef<{ formatContent: () => void }>(null)

  const [content, setContent] = usePersistedState('form-schema', INITIAL_DATA)

  const [validatedSchema, setValidatedSchema] = useState<
    ServiceSchema | undefined
  >(undefined)
  const handleCompileSchema = useCallback(() => {
    try {
      setValidatedSchema(compileSchema(content))
    } catch (error) {
      message.error((error as Error).message ?? 'Something went wrong')
    }
  }, [content])

  const { user } = useAuthContext()

  const { setNavbarContent } = useOutletContext<{
    setNavbarContent: React.Dispatch<React.SetStateAction<React.ReactNode>>
  }>()
  useEffect(
    function setEditorButtonsInNavbar() {
      setNavbarContent(
        <>
          <Button
            onClick={() => {
              editor.current?.formatContent()
            }}
            className="mr-4"
          >
            Format Code
          </Button>
          <Button
            icon={<CodeOutlined />}
            onClick={handleCompileSchema}
            className="mr-4"
          >
            Compile
          </Button>
          <SaveNewFormModal content={content}>
            <Button type="primary" icon={<SaveOutlined />} disabled={!user}>
              Save Form
            </Button>
          </SaveNewFormModal>
        </>,
      )
    },
    [handleCompileSchema, setNavbarContent, user, content],
  )

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="grid h-full grid-cols-2 overflow-hidden">
        <Editor
          ref={editor}
          content={content}
          setContent={setContent}
          className="border-r"
        />
        {/** @TODO: Check for uniqueness among fields and forms */}
        <div className="overflow-auto">
          {validatedSchema ? (
            <FormPreview schema={validatedSchema} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                Form not yet compiled. <br /> Click on{' '}
                <span className="inline-flex space-x-1 rounded border px-2 py-1 font-mono text-xs font-bold">
                  <CodeOutlined />
                  <span>Compile</span>
                </span>{' '}
                button
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
