import { Select } from 'antd'
import { useLanguageContext } from 'hooks/use-language'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { AsyncApi, Option } from 'types/form'
import { apiClient } from 'utils/client'

type AsyncSelectProps = React.ComponentProps<typeof Select> & {
  api: AsyncApi
  nameField: string
  formData: Record<string, any>
}

export default function AsyncSelect({
  api,
  nameField,
  formData,
  ...restProps
}: AsyncSelectProps) {
  const { language } = useLanguageContext()

  const apiEndpoint = typeof api === 'string' ? api : api.url

  const params = useMemo(() => {
    const result: Record<string, any> = {}
    if (typeof api === 'object') {
      Object.keys(api.params).forEach((key) => {
        result[key] = formData[api.params[key]]
      })
    }
    return result
  }, [formData, api])

  const { isLoading, data } = useQuery([nameField, params], async () => {
    const { data } = await apiClient.get<Option[]>(apiEndpoint, {
      params,
    })
    return data
  })

  return (
    <Select loading={isLoading} {...restProps}>
      {(data ?? []).map((option) => (
        <Select.Option key={option._id} value={option._id}>
          {option[language === 'english' ? 'nameEnglish' : 'nameHindi']}
        </Select.Option>
      ))}
    </Select>
  )
}
