import clsx from 'clsx'
import { useLanguageContext } from 'hooks/use-language'
import { ServiceSchema } from 'types/form'
import SubformPreview from './components/subform-preview'

type FormPreviewProps = {
  schema: ServiceSchema
  className?: string
  style?: React.CSSProperties
}

export default function FormPreview({
  schema,
  className,
  style,
}: FormPreviewProps) {
  const { language } = useLanguageContext()

  return (
    <div className={clsx('p-4', className)} style={style}>
      <div className="mb-4 text-2xl font-medium">
        {schema[language === 'english' ? 'nameEnglish' : 'nameHindi']}
      </div>
      <div className="space-y-4">
        {schema.forms.map((form) => {
          return <SubformPreview key={form.id} form={form} />
        })}
      </div>
    </div>
  )
}
