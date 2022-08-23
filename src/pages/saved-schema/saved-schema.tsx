import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Button, message, Modal, Spin } from 'antd'
import { CodeOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import FormPreview from 'components/form-preview'
import { ServiceSchema } from 'types/form'
import Editor from 'components/editor'
import { useMatch, useNavigate, useOutletContext } from 'react-router-dom'
import { compileSchema } from 'utils/schema'
import { useAuthContext } from 'hooks/use-auth'
import { useMutation, useQuery } from 'react-query'
import { deleteForm, getForm } from 'queries/form'
import { FirestoreError } from 'firebase/firestore'
import ReactRouterPrompt from 'react-router-prompt'
import UpdateFormModal from 'components/update-form-modal'

export default function SavedSchema() {
  const match = useMatch('schema/:id')
  const schemaId = match?.params.id!

  const [content, setContent] = useState('')

  const { data: savedSchema, isLoading } = useQuery(
    ['saved-schema', schemaId],
    () => getForm(schemaId),
    {
      onSettled: (fetchedData) => {
        if (fetchedData) {
          setContent(fetchedData.content)
        }
      },
      onError: (error: FirestoreError) => {
        message.error(error.message)
      },
    },
  )

  const editor = useRef<{ formatContent: () => void }>(null)

  const hasUnsavedChanges = useMemo(
    () => content !== savedSchema?.content,
    [content, savedSchema],
  )

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

  const navigate = useNavigate()
  const { isLoading: isDeleting, mutate: deleteFormMutation } = useMutation(
    deleteForm,
    {
      onSuccess: () => {
        message.success('Form deleted successfully')
        navigate('/', { replace: true })
      },
    },
  )

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
          <Button
            icon={<DeleteOutlined />}
            danger
            className="mr-4"
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure you want to delete this form?',
                content: 'Form once deleted cannot be recovered',
                onOk: () => {
                  deleteFormMutation(schemaId)
                },
              })
            }}
            loading={isDeleting}
          >
            Delete
          </Button>
          <Badge dot={hasUnsavedChanges}>
            <UpdateFormModal
              id={schemaId}
              content={content}
              name={savedSchema?.name}
            >
              <Button type="primary" icon={<SaveOutlined />} disabled={!user}>
                Save Form
              </Button>
            </UpdateFormModal>
          </Badge>
        </>,
      )
    },
    [
      handleCompileSchema,
      setNavbarContent,
      user,
      schemaId,
      content,
      savedSchema,
      hasUnsavedChanges,
      isDeleting,
      deleteFormMutation,
    ],
  )

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50">
          <Spin />
        </div>
      ) : null}
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
      <ReactRouterPrompt when={hasUnsavedChanges}>
        {({ isActive, onCancel, onConfirm }) => {
          return (
            <Modal
              visible={isActive}
              onOk={onConfirm}
              onCancel={onCancel}
              title="Do you want to leave?"
            >
              You have unsaved changes. Leaving the page without saving the
              changes would lose them.
            </Modal>
          )
        }}
      </ReactRouterPrompt>
    </>
  )
}
