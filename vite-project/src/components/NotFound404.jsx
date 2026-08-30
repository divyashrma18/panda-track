import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './NotFound404.css'

const FRAME_DURATION = 1 / 24

function NotFound404() {
  const videoRef = useRef(null)
  const targetTime = useRef(0)
  const seeking = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.pause()

    const handleSeeked = () => {
      seeking.current = false
    }
    video.addEventListener('seeked', handleSeeked)

    const handleMouseMove = (e) => {
      if (!video.duration) return
      const pct = 1 - e.clientX / window.innerWidth
      const clamped = Math.min(Math.max(pct, 0), 1)
      targetTime.current = clamped * video.duration
    }

    window.addEventListener('mousemove', handleMouseMove)

    const ticker = () => {
      if (!video.duration || seeking.current) return

      const current = video.currentTime
      const target = targetTime.current
      const diff = target - current

      if (Math.abs(diff) < FRAME_DURATION / 2) return

      const next = current + Math.sign(diff) * FRAME_DURATION

      seeking.current = true
      video.currentTime = next
    }
    gsap.ticker.add(ticker)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      video.removeEventListener('seeked', handleSeeked)
      gsap.ticker.remove(ticker)
    }
  }, [])

  return (
    <section className="notfound-hero">
      <video
        ref={videoRef}
        className="notfound-video"
        src="/video/one.mp4"
        muted
        playsInline
        preload="auto"
      />
      <div className="notfound-text notfound-text-left">404</div>
      <div className="notfound-text notfound-text-right">BTW</div>
      <div className="notfound-message">
        <h1>Page Not Found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <button type="button" onClick={() => { window.location.href = '/' }}>
          Go Home
        </button>
      </div>
    </section>
  )
}

export default NotFound404
