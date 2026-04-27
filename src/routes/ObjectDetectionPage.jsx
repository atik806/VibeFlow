import { ObjectDetection } from '../components/sections/ObjectDetection'
import { useSEO } from '../hooks/useSEO'

export default function ObjectDetectionPage() {
  useSEO({
    title: 'Object Detection',
    description: 'Real-time YOLOv8 object detection with your webcam.',
  })

  return (
    <div className="page">
      <div className="container page-hero">
        <h1>Object Detection</h1>
        <p>Experience real-time object detection powered by YOLOv8. Point your webcam at objects and watch AI identify them instantly.</p>
      </div>
      <div className="container">
        <ObjectDetection />
      </div>
    </div>
  )
}