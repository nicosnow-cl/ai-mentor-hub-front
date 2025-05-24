import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export type ContenProps = {
  children?: string | null
}

export function Content({ children }: Readonly<ContenProps>) {
  return (
    <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
      {children}
    </ReactMarkdown>
  )
}
