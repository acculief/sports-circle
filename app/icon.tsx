import { ImageResponse } from 'next/og'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export default function Icon() {
  return new ImageResponse(
    <div style={{ background: '#2563EB', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
      <span style={{ color: 'white', fontSize: '12px', fontWeight: '900', letterSpacing: '-0.5px' }}>S+</span>
    </div>,
    { ...size }
  )
}
