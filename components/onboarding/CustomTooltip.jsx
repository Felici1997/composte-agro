'use client'

import { IllustrationFarming, IllustrationSearch, IllustrationCreate, IllustrationDashboard, IllustrationService, IllustrationProduct } from './Illustrations'

const dotStyle = (active) => ({
  width: active ? 24 : 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: active ? '#73BF44' : '#E2E8F0',
  border: 'none',
  padding: 0,
  cursor: 'default',
  transition: 'all 0.3s ease',
})

const illustrationMap = {
  '🌱': IllustrationFarming,
  '🔍': IllustrationSearch,
  '📝': IllustrationCreate,
  '📦': IllustrationProduct,
  '🔧': IllustrationService,
  '📋': IllustrationDashboard,
  '📊': IllustrationDashboard,
}

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
  const isWelcome = step.placement === 'center'
  const icon = step.data?.icon || null
  const Illus = illustrationMap[icon] || null

  return (
    <div
      key="JoyrideTooltip"
      {...tooltipProps}
      className="react-joyride__tooltip"
      data-joyride-step={index}
      style={{
        borderRadius: 20,
        padding: 0,
        overflow: 'hidden',
        boxShadow: isWelcome
          ? '0 20px 60px rgba(13,73,38,0.25), 0 4px 16px rgba(0,0,0,0.1)'
          : '0 12px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.06)',
        width: '100%',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Illustration area */}
      {Illus && isWelcome && (
        <div
          style={{
            background: 'linear-gradient(135deg, #0D4926 0%, #1B6B3A 50%, #73BF44 100%)',
            padding: '32px 24px 24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Illus large />
        </div>
      )}

      {Illus && !isWelcome && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '20px 24px 0',
          }}
        >
          <Illus />
        </div>
      )}

      {/* Content */}
      <div
        style={{
          padding: isWelcome ? '24px 28px 0' : '16px 24px 0',
          textAlign: isWelcome ? 'center' : 'left',
        }}
      >
        {step.title && (
          <h4
            id="joyride-tooltip-title"
            style={{
              fontFamily: '"Outfit", system-ui, sans-serif',
              fontSize: isWelcome ? 22 : 16,
              fontWeight: 700,
              color: isWelcome ? '#0D4926' : '#1e293b',
              marginBottom: 8,
              lineHeight: 1.3,
              letterSpacing: isWelcome ? '-0.01em' : '0',
            }}
          >
            {step.title}
          </h4>
        )}

        <div
          id="joyride-tooltip-content"
          style={{
            fontFamily: '"Poppins", system-ui, sans-serif',
            fontSize: isWelcome ? 15 : 13,
            lineHeight: 1.7,
            color: isWelcome ? '#475569' : '#64748b',
            margin: 0,
          }}
        >
          {step.content}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          gap: 8,
        }}
      >
        {/* Progress dots */}
        {size > 1 && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {Array.from({ length: size }, (_, i) => (
              <div key={i} style={dotStyle(i === index)} />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Back button */}
          {index > 0 && (
            <button
              {...backProps}
              type="button"
              data-testid="button-back"
              style={{
                fontFamily: '"Poppins", system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 500,
                color: '#94a3b8',
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s',
                lineHeight: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1'
                e.currentTarget.style.color = '#64748b'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.color = '#94a3b8'
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
              fontFamily: '"Poppins", system-ui, sans-serif',
              backgroundColor: '#73BF44',
              color: '#ffffff',
              borderRadius: 12,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(115,191,68,0.35)',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5DA832'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(115,191,68,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#73BF44'
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(115,191,68,0.35)'
            }}
          >
            {primaryProps.children || (isLastStep ? 'Terminer' : 'Suivant')}
          </button>
        </div>
      </div>

      {/* Skip link */}
      {!isLastStep && (
        <div style={{ textAlign: 'center', padding: '0 24px 16px' }}>
          <button
            {...skipProps}
            type="button"
            data-testid="button-skip"
            aria-live="off"
            style={{
              fontFamily: '"Poppins", system-ui, sans-serif',
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
