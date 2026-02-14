import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import useUiStore from '../stores/uiStore'

export default function useRecordAnimation() {
  const timelineRef = useRef(null)

  const animatePullOut = useCallback((meshRef, cameraRef, onComplete) => {
    if (!meshRef.current) return
    useUiStore.getState().setAnimating(true)

    const tl = gsap.timeline({
      onComplete: () => {
        useUiStore.getState().setAnimating(false)
        onComplete?.()
      },
    })
    timelineRef.current = tl

    const startPos = { ...meshRef.current.position }

    // Step 1: Slide forward out of shelf
    tl.to(meshRef.current.position, {
      z: startPos.z + 1.5,
      duration: 0.4,
      ease: 'power2.out',
    })

    // Step 2: Move to center, rotate to face camera, scale up
    tl.to(
      meshRef.current.position,
      {
        x: 0,
        y: 0,
        z: 3,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '-=0.1'
    )
    tl.to(
      meshRef.current.rotation,
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '<'
    )
    tl.to(
      meshRef.current.scale,
      {
        x: 5,
        y: 5,
        z: 5,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      '<'
    )

    return tl
  }, [])

  const animateReturn = useCallback((meshRef, originalPosition, onComplete) => {
    if (!meshRef.current) return
    useUiStore.getState().setAnimating(true)

    const tl = gsap.timeline({
      onComplete: () => {
        useUiStore.getState().setAnimating(false)
        onComplete?.()
      },
    })

    // Reverse: scale down, return to shelf
    tl.to(meshRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.4,
      ease: 'power2.inOut',
    })
    tl.to(
      meshRef.current.position,
      {
        x: originalPosition.x,
        y: originalPosition.y,
        z: originalPosition.z,
        duration: 0.4,
        ease: 'power2.inOut',
      },
      '<'
    )

    timelineRef.current = tl
    return tl
  }, [])

  const animateHoverUp = useCallback((meshRef) => {
    if (!meshRef.current) return
    gsap.to(meshRef.current.position, {
      y: meshRef.current.position.y + 0.15,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [])

  const animateHoverDown = useCallback((meshRef, originalY) => {
    if (!meshRef.current) return
    gsap.to(meshRef.current.position, {
      y: originalY,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [])

  const kill = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
      timelineRef.current = null
    }
  }, [])

  return { animatePullOut, animateReturn, animateHoverUp, animateHoverDown, kill }
}
