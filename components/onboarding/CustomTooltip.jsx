'use client'

const dotStyle = (active, color) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: active ? (color || '#73BF44') : '#CBD5E1',
  border: 'none',
  padding: 0,
  cursor: 'default',
  transition: 'all 0.3s ease',
  transform: active ? 'scale(1.2)' : 'scale(1)',
})

export default function CustomTooltip({
  backProps,
  closeProps,
  continuous,
  controls,
  index,
  isLastStep,
  primaryProps,
  skipProps,
  step,
  tooltipProps,
  size,
}) {
  const color = step.primaryColor || '#73BF44'
  const icon = step.data?.icon || null
  const showBack = index > 0
  const showSkip = !isLastStep

  return (
    <div
      {...tooltipProps}
      key="JoyrideTooltip"
      className="react-joyride__tooltip"
      data-joyride-step={index}
      style={{
        ...step.styles.tooltip,
        borderRadius: 16,
        padding: 0,
        overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.08)',
        width: '100%',
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${color}, #0D4926)`,
        }}
      />

      {/* Content */}
      <div
        style={{
          ...step.styles.tooltipContainer,
          padding: '20px 24px 0',
          textAlign: 'center',
        }}
      >
        {icon && (
          <div
            aria-hidden="true"
            style={{
              fontSize: step.placement === 'center' ? 48 : 36,
              lineHeight: 1,
              marginBottom: 12,
            }}
          >
            {icon}
          </div>
        )}

        {step.title && (
          <h4
            id="joyride-tooltip-title"
            style={{
              ...step.styles.tooltipTitle,
              fontFamily: '"Outfit", sans-serif',
              fontSize: 18,
              fontWeight: 700,
              color: '#0D4926',
              marginBottom: 8,
              lineHeight: 1.3,
            }}
          >
            {step.title}
          </h4>
        )}

        <div
          id="joyride-tooltip-content"
          style={{
            ...step.styles.tooltipContent,
            fontFamily: '"Poppins", sans-serif',
            fontSize: 14,
            lineHeight: 1.6,
            color: '#475569',
            margin: 0,
          }}
        >
          {step.content}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          ...step.styles.tooltipFooter,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          gap: 8,
        }}
      >
        {/* Progress dots */}
        {size > 1 && (
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {Array.from({ length: size }, (_, i) => (
              <div key={i} style={dotStyle(i === index, color)} />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Back button */}
          {showBack && (
            <button
              {...backProps}
              type="button"
              data-testid="button-back"
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: 13,
                fontWeight: 500,
                color: '#64748b',
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
            >
              {backProps.children || 'Précédent'}
            </button>
          )}

          {/* Primary (Next / Finish) */}
          <button
            {...primaryProps}
            type="button"
            data-testid="button-primary"
            style={{
              fontFamily: '"Poppins", sans-serif',
              backgroundColor: color,
              color: '#ffffff',
              borderRadius: 12,
              padding: '9px 22px',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: `0 2px 8px ${color}40`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0D4926'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = `0 4px 12px ${color}50`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = color
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = `0 2px 8px ${color}40`
            }}
          >
            {primaryProps.children || (isLastStep ? 'Terminer' : 'Suivant')}
          </button>
        </div>
      </div>

      {/* Skip link */}
      {showSkip && (
        <div style={{ textAlign: 'center', padding: '0 24px 16px' }}>
          <button
            {...skipProps}
            type="button"
            data-testid="button-skip"
            aria-live="off"
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: 12,
              fontWeight: 500,
              color: '#94a3b8',
              padding: '4px 8px',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#64748b' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8' }}
          >
            {skipProps.children || 'Passer'}
          </button>
        </div>
      )}
    </div>
  )
}
