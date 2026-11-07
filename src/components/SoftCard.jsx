import { Paper } from '@mantine/core'

export default function SoftCard({ children, className = '', p = 'lg', ...rest }) {
  return (
    <Paper className={`fp-card ${className}`.trim()} p={p} {...rest}>
      {children}
    </Paper>
  )
}
