import { Form, Input, message, Modal } from 'antd'
import { FirestoreError } from 'firebase/firestore'
import { useAuthContext } from 'hooks/use-auth'
import { createForm } from 'queries/form'
import { cloneElement, useCallback, useState } from 'react'
import { useMutation } from 'react-query'

type SaveNewFormModalProps = {
  children: React.ReactElement<{ onClick: () => void }>
  content: string
}

export default function SaveNewFormModal({
  children,
  content,
}: SaveNewFormModalProps) {
  const [modalVisible, setModalVisible] = useState(false)

  const [form] = Form.useForm()

  const { mutate: createFormMutation, isLoading } = useMutation(createForm, {
    onSuccess: () => {
      setModalVisible(false)
      form.resetFields()
      message.success('Form saved successfully')
    },
    onError: (error: FirestoreError) => {
      message.error(error.message)
    },
  })

  const { user } = useAuthContext()
  const handleFinish = useCallback(
    ({ name }: { name: string }) => {
      createFormMutation({ name, content, user: user!.uid })
    },
    [content, createFormMutation, user],
  )

  return (
    <>
      {cloneElement(children, {
        onClick: () => {
          setModalVisible(true)
        },
      })}
      <Modal
        title="Save New Form Schema"
        destroyOnClose
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false)
        }}
        onOk={() => {
          form.submit()
        }}
        okButtonProps={{
          loading: isLoading,
        }}
      >
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item
            label="Form Name"
            name="name"
            rules={[{ required: true, message: 'Form name is required' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
