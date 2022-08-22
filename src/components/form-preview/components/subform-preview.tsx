import { PlusOutlined } from '@ant-design/icons'
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Upload,
} from 'antd'
import type { Rule } from 'antd/lib/form'
import clsx from 'clsx'
import AsyncSelect from 'components/async-select'
import { useLanguageContext } from 'hooks/use-language'
import { capitalize } from 'lodash'
import { FormSchema } from 'types/form'

type SubformPreviewProps = {
  form: FormSchema
  className?: string
  style?: React.CSSProperties
}

export default function SubformPreview({
  form,
  className,
  style,
}: SubformPreviewProps) {
  const { language } = useLanguageContext()

  return (
    <div className={clsx('border p-4', className)} style={style}>
      <div className="mb-4 text-base font-medium">
        {form[language === 'english' ? 'nameEnglish' : 'nameHindi']}
      </div>
      <Form layout="vertical">
        {form.fields.map((field) => {
          const formLabel =
            field[language === 'english' ? 'nameEnglish' : 'nameHindi']

          const rules: Rule[] = []
          if (field.required) {
            rules.push({
              required: true,
              message: `${formLabel} is required`,
            })
          }

          switch (field.type) {
            case 'text': {
              return (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={formLabel}
                  rules={rules}
                >
                  <Input placeholder={formLabel} />
                </Form.Item>
              )
            }

            case 'name': {
              const options =
                field.salutation === 'formal'
                  ? ['mr', 'miss', 'mrs']
                  : ['son', 'daughter', 'wife']
              return (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={formLabel}
                  rules={rules}
                >
                  <Input
                    placeholder={formLabel}
                    addonBefore={
                      <Select className="w-20">
                        {options.map((option) => (
                          <Select.Option key={option}>
                            {capitalize(option)}
                          </Select.Option>
                        ))}
                      </Select>
                    }
                  />
                </Form.Item>
              )
            }

            case 'image-uploader': {
              return (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={formLabel}
                  rules={rules}
                  valuePropName="fileList"
                >
                  <Upload listType="picture-card">
                    <div>
                      <PlusOutlined />
                      <div className="mt-2">Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              )
            }

            case 'number': {
              return (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={formLabel}
                  rules={rules}
                >
                  <InputNumber className="!w-full" />
                </Form.Item>
              )
            }

            case 'select': {
              return (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={formLabel}
                  rules={rules}
                >
                  <Select>
                    {field.options.map((option) => (
                      <Select.Option key={option._id} value={option._id}>
                        {
                          option[
                            language === 'english' ? 'nameEnglish' : 'nameHindi'
                          ]
                        }
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            }

            case 'radio': {
              return (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={formLabel}
                  rules={rules}
                >
                  <Radio.Group>
                    {field.options.map((option) => (
                      <Radio key={option._id} value={option._id}>
                        {
                          option[
                            language === 'english' ? 'nameEnglish' : 'nameHindi'
                          ]
                        }
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              )
            }

            case 'checkbox': {
              return (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={formLabel}
                  rules={rules}
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              )
            }

            case 'async-select': {
              if (typeof field.api === 'string') {
                return (
                  <Form.Item
                    key={field.id}
                    name={field.id}
                    label={formLabel}
                    rules={rules}
                    valuePropName="checked"
                  >
                    <AsyncSelect
                      nameField={field.id}
                      formData={{}}
                      api={field.api}
                    />
                  </Form.Item>
                )
              }

              const formDataKeys = Object.values(field.api.params)

              return (
                <Form.Item key={field.id} dependencies={formDataKeys}>
                  {({ getFieldsValue }) => {
                    const formData = getFieldsValue(formDataKeys)

                    return (
                      <Form.Item
                        name={field.id}
                        label={formLabel}
                        rules={rules}
                      >
                        <AsyncSelect
                          nameField={field.id}
                          formData={formData}
                          api={field.api}
                        />
                      </Form.Item>
                    )
                  }}
                </Form.Item>
              )
            }

            case 'mobile': {
              return (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={formLabel}
                  rules={rules}
                >
                  <InputNumber
                    className="!w-full"
                    minLength={10}
                    maxLength={10}
                  />
                </Form.Item>
              )
            }

            case 'date': {
              return (
                <Form.Item
                  key={field.id}
                  name={field.id}
                  label={formLabel}
                  rules={rules}
                >
                  <DatePicker className="!w-full" />
                </Form.Item>
              )
            }

            default: {
              return null
            }
          }
        })}
      </Form>
    </div>
  )
}
