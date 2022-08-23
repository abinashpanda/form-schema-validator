import { Form, Input, Modal } from 'antd'
import { cloneElement, useCallback, useState } from 'react'

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

  const handleFinish = useCallback(
    ({ name }: { name: string }) => {
      console.log({ name, content })
    },
    [content],
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
