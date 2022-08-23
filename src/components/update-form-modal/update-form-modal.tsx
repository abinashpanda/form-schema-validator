import { Form, Input, message, Modal } from 'antd'
import { FirestoreError } from 'firebase/firestore'
import { updateForm } from 'queries/form'
import { cloneElement, useCallback, useState } from 'react'
import { useMutation } from 'react-query'

type UpdateFormModalProps = {
  children: React.ReactElement<{ onClick: () => void }>
  id: string
  content: string
  name?: string
}

export default function UpdateFormModal({
  children,
  id,
  content,
  name,
}: UpdateFormModalProps) {
  const [modalVisible, setModalVisible] = useState(false)

  const [form] = Form.useForm()

  const { mutate: updateFormMutation, isLoading } = useMutation(updateForm, {
    onSuccess: () => {
      setModalVisible(false)
    },
    onError: (error: FirestoreError) => {
      message.error(error.message)
    },
  })

  const handleFinish = useCallback(
    ({ name }: { name: string }) => {
      updateFormMutation({ name, content, id })
    },
    [content, updateFormMutation, id],
  )

  return (
    <>
      {cloneElement(children, {
        onClick: () => {
          setModalVisible(true)
        },
      })}
      <Modal
        title="Update Form Schema"
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
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          initialValues={{ name }}
          key={name}
        >
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
