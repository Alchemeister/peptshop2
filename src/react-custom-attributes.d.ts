import 'react'

declare module 'react' {
  interface FormHTMLAttributes<T> {
    tooldescription?: string
    toolname?: string
  }

  interface InputHTMLAttributes<T> {
    toolparamdescription?: string
  }
}
