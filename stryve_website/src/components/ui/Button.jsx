export default function Button({
  children,
  variant = 'primary',
  href = '#',
  className = '',
  onClick,
  ...rest
}) {
  const cls = variant === 'primary' ? 'btn-primary' : 'btn-ghost'
  return (
    <a href={href} onClick={onClick} className={`${cls} ${className}`} {...rest}>
      {children}
    </a>
  )
}
