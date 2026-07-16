'use client'
import { forwardRef } from 'react'

const keyframes = `
@keyframes joyride-custom-beacon {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 0.4; }
  100% { transform: scale(1); opacity: 0.8; }
}
`

export default forwardRef(function CustomBeacon(props, ref) {
  const { step } = props

  return (
    <>
      <style>{keyframes}</style>
      <span
        ref={ref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: step.primaryColor || '#73BF44',
          boxShadow: `0 0 0 6px ${step.primaryColor || '#73BF44'}33, 0 0 0 12px ${step.primaryColor || '#73BF44'}1A`,
          animation: 'joyride-custom-beacon 1.8s ease-in-out infinite',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            opacity: 0.9,
          }}
        />
      </span>
    </>
  )
})
