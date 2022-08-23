import { Switch } from 'antd'
import logo from 'assets/logo.svg'
import clsx from 'clsx'
import { useLanguageContext } from 'hooks/use-language'

type NavbarProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Navbar({ children, className, style }: NavbarProps) {
  const { language, setLanguage } = useLanguageContext()

  return (
    <div
      className={clsx(
        'fixed top-0 right-0 left-0 z-10 h-16 border-b bg-white',
        className,
      )}
      style={style}
    >
      <div className="mx-auto flex h-full max-w-screen-xl items-center">
        <img src={logo} className="mr-2 h-10 w-10" />
        <div className="text-2xl font-bold tracking-tighter">
          Form Schema Validator
        </div>
        <div className="flex-1" />
        <label htmlFor="language" className="mr-2 text-right capitalize">
          {language}
        </label>
        <Switch
          className="!mr-8"
          id="language"
          checked={language === 'hindi'}
          onChange={(value) => {
            if (value) {
              setLanguage('hindi')
            } else {
              setLanguage('english')
            }
          }}
        />
        {children}
      </div>
    </div>
  )
}
