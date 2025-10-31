import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './HeroAbout.css';

const HeroAbout: React.FC = () => {
  const [isMerged, setIsMerged] = useState(false);
  const [piecesMoving, setPiecesMoving] = useState(false);
  const [piecesFading, setPiecesFading] = useState(false);
  const [showSimpleMessage, setShowSimpleMessage] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const examiBlockRef = useRef<HTMLDivElement>(null);
  const leftBlockRef = useRef<HTMLDivElement>(null);
  const rightBlockRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const dragConstraints = { left: -150, right: 150, top: -150, bottom: 150 };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    if (!dropZoneRef.current || !examiBlockRef.current) return;

    const dropZoneRect = dropZoneRef.current.getBoundingClientRect();
    const examiBlockRect = examiBlockRef.current.getBoundingClientRect();

    // Calculate centers
    const dropZoneCenterX = dropZoneRect.left + dropZoneRect.width / 2;
    const dropZoneCenterY = dropZoneRect.top + dropZoneRect.height / 2;
    const examiBlockCenterX = examiBlockRect.left + examiBlockRect.width / 2;
    const examiBlockCenterY = examiBlockRect.top + examiBlockRect.height / 2;

    // Calculate distance between centers
    const distanceX = Math.abs(dropZoneCenterX - examiBlockCenterX);
    const distanceY = Math.abs(dropZoneCenterY - examiBlockCenterY);

    // Check if blocks overlap (threshold: if centers are within 60px of each other)
    const threshold = 60;
    if (distanceX < threshold && distanceY < threshold) {
      setIsMerged(true);
      // Start pieces moving to center
      setTimeout(() => {
        setPiecesMoving(true);
      }, prefersReducedMotion ? 0 : 200);
      // Fade out all pieces faster (after they move close)
      setTimeout(() => {
        setPiecesFading(true);
      }, prefersReducedMotion ? 0 : 800);
      // Show background expansion and stars after pieces fade out (smooth transition)
      setTimeout(() => {
        setShowBackground(true);
        setShowStars(true);
      }, prefersReducedMotion ? 0 : 1300);
      // Show "It's that simple." message
      setTimeout(() => {
        setShowSimpleMessage(true);
      }, prefersReducedMotion ? 0 : 1900);
      // Show description paragraph
      setTimeout(() => {
        setShowDescription(true);
      }, prefersReducedMotion ? 0 : 2600);
    }
  };

  return (
    <motion.section
      className="about-hero-react"
      style={{
        background: 'white',
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem 2rem 2rem',
        position: 'relative',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden'
      }}
      animate={isMerged ? {
        scale: prefersReducedMotion ? [1, 1] : [1.02, 1]
      } : {}}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: 'easeInOut'
      }}
    >
      {/* Expanding Background Rectangle - Expanding from center */}
      {showBackground && (
        <motion.div
          className="expanding-blue-background"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '0%',
            height: '0%',
            backgroundColor: '#1f75ff',
            borderRadius: '24px',
            zIndex: 0,
            overflow: 'hidden' // Clip stars to blue box boundaries
          }}
          animate={{
            width: '90%',
            height: isMobile ? 'calc(100% - 14rem)' : 'calc(100% - 16rem)'
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1.5,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {/* Blinking Stars - Random positions, avoiding text area and edges */}
          {showStars && (
            <>
              {(isMobile 
                ? [
                    // Mobile: 6 smaller stars, well inside edges (10% minimum from edges to account for size)
                    { top: 18, left: 15, size: 16, small: true },
                    { top: 22, left: 80, size: 14, small: true },
                    { top: 72, left: 18, size: 18, small: true },
                    { top: 78, left: 82, size: 15, small: true },
                    { top: 48, left: 12, size: 17, small: true },
                    { top: 52, left: 85, size: 14, small: true }
                  ]
                : [
                    // Desktop: 12 stars, well inside edges (8% minimum from edges to account for size)
                    { top: 12, left: 10, size: 22, small: true },
                    { top: 18, left: 20, size: 40, small: false },
                    { top: 15, left: 85, size: 20, small: true },
                    { top: 22, left: 82, size: 42, small: false },
                    { top: 78, left: 12, size: 38, small: false },
                    { top: 85, left: 10, size: 24, small: true },
                    { top: 82, left: 88, size: 20, small: true },
                    { top: 88, left: 85, size: 40, small: false },
                    { top: 48, left: 8, size: 22, small: true },
                    { top: 52, left: 89, size: 42, small: false },
                    { top: 32, left: 14, size: 20, small: true },
                    { top: 68, left: 86, size: 36, small: false }
                  ]
              ).map((star, i) => {
                const { top, left, size } = star;
                
                return (
                  <motion.img
                    key={i}
                    src="/exami-about-hero-puzzle-svg/star-hero-section.svg"
                    alt="Star"
                    style={{
                      position: 'absolute',
                      top: `${top}%`,
                      left: `${left}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      zIndex: 1,
                      pointerEvents: 'none',
                      transform: 'translate(-50%, -50%)' // Center the star on its position
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0.7, 1, 0.8, 1],
                      scale: [0, 1, 0.9, 1.1, 0.95, 1]
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 2.5,
                      delay: prefersReducedMotion ? 0 : i * 0.12,
                      ease: [0.4, 0, 0.6, 1],
                      repeat: Infinity,
                      repeatType: 'loop',
                      times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                    }}
                  />
                );
              })}
            </>
          )}
        </motion.div>
      )}
      <div className="container" style={{ maxWidth: '1200px', width: '100%', position: 'relative', zIndex: 2 }}>
        {/* Exami Logo - Fades in during blue box expansion */}
        {showBackground && (
          <motion.img
            src="/Exami - logo -white.webp"
            alt="Exami Logo"
            style={{
              display: 'block',
              margin: '0 auto',
              marginBottom: '2rem',
              maxWidth: '120px',
              height: 'auto',
              zIndex: 3
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              delay: prefersReducedMotion ? 0 : 0.3,
              ease: 'easeOut'
            }}
          />
        )}
        
        {/* Headline */}
        {!piecesFading && (
          <motion.h1
            className="hero-headline"
            style={{
              fontSize: 'clamp(1.875rem, 5vw, 3rem)',
              fontWeight: 600,
              textAlign: 'center',
              color: '#111111',
              marginBottom: '4rem',
              transition: 'opacity 0.3s ease'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: 'easeOut'
            }}
          >
            Exami is bringing simplicity back to education.
          </motion.h1>
        )}

        {/* Complete the Puzzle Text */}
        {!piecesFading && (
          <motion.p
            style={{
              fontSize: '0.875rem',
              fontWeight: 400,
              color: '#666666',
              textAlign: 'center',
              marginBottom: '1rem',
              opacity: isMerged ? 0 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            Complete the puzzle
          </motion.p>
        )}

        {/* Puzzle Zone */}
        <motion.div
          className="puzzle-zone"
          style={{
            display: piecesFading ? 'none' : 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            position: 'relative'
          }}
        >
          {/* Top Row: Left, Drop Zone, Right */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* Student Block (Left Puzzle Piece) */}
            <motion.div
              ref={leftBlockRef}
              className="puzzle-block"
              style={{
                width: '96px',
                height: '96px',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: piecesFading ? 'default' : 'pointer',
                position: 'relative'
              }}
            animate={piecesFading ? {
              opacity: 0,
              scale: prefersReducedMotion ? 1 : 0.8
            } : piecesMoving ? {
              x: prefersReducedMotion ? 0 : 20,
              scale: prefersReducedMotion ? 1 : 0.95
            } : {}}
            transition={{
              duration: prefersReducedMotion ? 0 : (piecesFading ? 0.4 : 0.5),
              ease: piecesFading ? 'easeIn' : 'easeInOut'
            }}
              whileHover={!piecesMoving && !piecesFading ? { scale: prefersReducedMotion ? 1 : 1.05 } : {}}
            >
              <img
                src="/assets/puzzle-svg/left-puzzle-block-svg.svg"
                alt="Student puzzle block"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </motion.div>

            {/* Centre Puzzle Block - Shows in center after merge */}
            <motion.div
              ref={dropZoneRef}
              id="drop-zone"
              className="drop-zone"
              style={{
                width: '96px',
                height: '96px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                position: 'relative'
              }}
            animate={isMerged ? {
              opacity: piecesFading ? 0 : 1,
              scale: piecesFading ? (prefersReducedMotion ? 1 : 0.8) : 1
            } : {
              border: '2px dashed #d4d4d4',
              borderRadius: '12px'
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : (piecesFading ? 0.4 : 0.6),
              ease: piecesFading ? 'easeIn' : 'easeInOut'
            }}
              whileHover={!isMerged ? { scale: prefersReducedMotion ? 1 : 1.03 } : {}}
            >
              {isMerged && !piecesFading && (
                <img
                  src="/assets/puzzle-svg/centre-puzzle-block-svg.svg"
                  alt="Centre puzzle block"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              )}
            </motion.div>

            {/* Institution Block (Right Puzzle Piece) */}
            <motion.div
              ref={rightBlockRef}
              className="puzzle-block"
              style={{
                width: '96px',
                height: '96px',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: piecesFading ? 'default' : 'pointer',
                position: 'relative'
              }}
            animate={piecesFading ? {
              opacity: 0,
              scale: prefersReducedMotion ? 1 : 0.8
            } : piecesMoving ? {
              x: prefersReducedMotion ? 0 : -20,
              scale: prefersReducedMotion ? 1 : 0.95
            } : {}}
            transition={{
              duration: prefersReducedMotion ? 0 : (piecesFading ? 0.4 : 0.5),
              ease: piecesFading ? 'easeIn' : 'easeInOut'
            }}
              whileHover={!piecesMoving && !piecesFading ? { scale: prefersReducedMotion ? 1 : 1.05 } : {}}
            >
              <img
                src="/assets/puzzle-svg/right-puzzle-block-svg.svg"
                alt="Institution puzzle block"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </motion.div>
          </div>

          {/* Bottom Row: Centre Puzzle Block - Draggable */}
          {!isMerged && (
            <motion.div
              ref={examiBlockRef}
              className="exami-draggable"
              style={{
                width: '96px',
                height: '96px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                position: 'relative'
              }}
              drag
              dragConstraints={dragConstraints}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: prefersReducedMotion ? 1 : 1.08 }}
              transition={{ duration: 0.2 }}
            >
              {/* Centre Puzzle Block - Draggable */}
              <img
                src="/assets/puzzle-svg/centre-puzzle-block-svg.svg"
                alt="Centre puzzle block"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  display: 'block'
                }}
              />
            </motion.div>
          )}
        </motion.div>


        {/* Merge Animation */}
        {piecesFading && (
          <motion.div
            className="merge-animation"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              marginTop: '0',
              width: '100%'
            }}
          >
            {showSimpleMessage && (
              <motion.h2
                className="completion-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.6,
                  ease: 'easeOut'
                }}
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 600,
                  color: showBackground ? '#ffffff' : '#111111',
                  textAlign: 'center',
                  marginBottom: showDescription ? '2rem' : '0',
                  marginTop: '0',
                  width: '100%',
                  transition: 'color 0.3s ease'
                }}
              >
                It's that simple.
              </motion.h2>
            )}
            {showDescription && (
              <motion.p
                className="description-paragraph"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.8,
                  ease: 'easeOut',
                  delay: prefersReducedMotion ? 0 : 0.2
                }}
                style={{
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: showBackground ? '#ffffff' : '#9ca3af',
                  textAlign: 'center',
                  maxWidth: '800px',
                  margin: '0 auto',
                  lineHeight: '1.6',
                  padding: '0',
                  width: '100%',
                  transition: 'color 0.3s ease'
                }}
              >
                Exami brings every part of the exam and education process into one simple place. From applying for exams, scholarships, and certifications to managing results and updates — everything happens in one clean, connected platform. No confusion, no endless forms — just a single, unified experience for students, institutions, and educators alike.
              </motion.p>
            )}
          </motion.div>
        )}
      </div>

      <style>{`
        .about-hero-react {
          padding-top: 6rem !important;
        }
        
        .expanding-blue-background {
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
        }
        
        @media (max-width: 768px) {
          .about-hero-react {
            padding-top: 5rem !important;
          }
          
          .puzzle-block,
          .drop-zone {
            width: 64px !important;
            height: 64px !important;
          }
          
          .puzzle-block img,
          .drop-zone img {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
          }

          .exami-draggable {
            width: 64px !important;
            height: 64px !important;
          }

          .exami-draggable img {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default HeroAbout;

