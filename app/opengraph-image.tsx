import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SportsCircle+'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #2563EB 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '24px', fontWeight: '700', marginBottom: '16px', letterSpacing: '2px' }}>
          SPORTS CIRCLE +
        </div>
        <div style={{ color: 'white', fontSize: '56px', fontWeight: '900', lineHeight: 1.2, marginBottom: '24px' }}>
          スポーツ仲間を見つけよう
        </div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '26px', marginBottom: '48px' }}>
          全国のサークル・仲間募集が集まる場所
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['サッカー', 'テニス', 'バスケ', 'ランニング', 'ヨガ'].map(sport => (
            <div key={sport} style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '999px',
              padding: '8px 20px',
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
            }}>
              {sport}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
