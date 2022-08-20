import { Empty } from 'antd'
import clsx from 'clsx'
import type { editor } from 'monaco-editor'
import { useMemo } from 'react'
import { HiExclamation, HiXCircle } from 'react-icons/hi'

type EditorErrorProps = {
  errors: editor.IMarker[]
  onErrorClick?: (position: { lineNumber: number; column: number }) => void
  className?: string
  style?: React.CSSProperties
}

export default function EditorErrors({
  errors,
  onErrorClick,
  className,
  style,
}: EditorErrorProps) {
  const content = useMemo(() => {
    if (errors.length === 0) {
      return (
        <div className="flex h-full items-center justify-center">
          <Empty description="No errors found" />
        </div>
      )
    }

    return (
      <div className="p-2">
        {errors.map(({ message, startColumn, startLineNumber, code }) => {
          return (
            <button
              key={`${message}-${startColumn}-${startLineNumber}`}
              className="flex items-center space-x-2 p-1 text-sm"
              onClick={() => {
                onErrorClick?.({
                  lineNumber: startLineNumber,
                  column: startColumn,
                })
              }}
            >
              {code ? (
                <HiXCircle className="h-4 w-4 text-red-500" />
              ) : (
                <HiExclamation className="h-4 w-4 text-yellow-500" />
              )}
              <div>
                {message} [Ln {startLineNumber}, Col {startColumn}]
              </div>
            </button>
          )
        })}
      </div>
    )
  }, [errors, onErrorClick])

  return (
    <div className={clsx('overflow-auto', className)} style={style}>
      {content}
    </div>
  )
}
