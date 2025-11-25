import { ChangeEvent } from 'react'

interface DateFieldProps {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
}

function DateField({
  value,
  onChange,
  label = 'Date de la transaction',
  required = true
}: DateFieldProps): React.JSX.Element {
  const getTodayDate = (): string => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value)
  }

  return (
    <div>
      <label
        htmlFor="date"
        style={{
          display: 'block',
          marginBottom: 'var(--spacing-xs)',
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--color-text-primary)'
        }}
      >
        {label} {required && '*'}
      </label>
      <input
        type="date"
        id="date"
        value={value}
        onChange={handleChange}
        max={getTodayDate()}
        style={{
          width: '100%',
          padding: '12px',
          background: 'var(--color-input-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--border-radius)',
          color: 'var(--color-text-primary)',
          fontSize: '14px'
        }}
        required={required}
      />
      <small style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
        Par défaut : aujourd&apos;hui
      </small>
    </div>
  )
}

export default DateField
