import logo from 'assets/logo.svg'
import clsx from 'clsx'

type NavbarProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Navbar({ children, className, style }: NavbarProps) {
  return (
    <div
      className={clsx(
        'fixed top-0 right-0 left-0 z-10 h-16 bg-white shadow',
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
        {children}
      </div>
    </div>
  )
}
