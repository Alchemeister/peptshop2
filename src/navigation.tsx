import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

type FrontendLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  children: ReactNode
  href: string
  navigate: (href: string) => void
}

export function FrontendLink({ children, href, navigate, onClick, ...props }: FrontendLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey) {
      return
    }
    event.preventDefault()
    navigate(href)
  }

  return (
    <a {...props} href={href} onClick={handleClick}>
      {children}
    </a>
  )
}

export function routeIsActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  if (href === '/products') {
    return (
      pathname === '/products' ||
      pathname.startsWith('/products/') ||
      pathname.startsWith('/catalog/') ||
      pathname.startsWith('/product/')
    )
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}
