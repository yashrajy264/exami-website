import React, { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './HeroAbout.css';

const HeroAbout: React.FC = () => {
  const [isMerged, setIsMerged] = useState(false);
  const [piecesMoving, setPiecesMoving] = useState(false);
  const [piecesFading, setPiecesFading] = useState(false);
  const [showSimpleMessage, setShowSimpleMessage] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const examiBlockRef = useRef<HTMLDivElement>(null);
  const leftBlockRef = useRef<HTMLDivElement>(null);
  const rightBlockRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const dragConstraints = { left: -150, right: 150, top: -150, bottom: 150 };

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
      // Fade out all pieces
      setTimeout(() => {
        setPiecesFading(true);
      }, prefersReducedMotion ? 0 : 1000);
      // Show "It's that simple." message
      setTimeout(() => {
        setShowSimpleMessage(true);
      }, prefersReducedMotion ? 0 : 1500);
      // Show description paragraph
      setTimeout(() => {
        setShowDescription(true);
      }, prefersReducedMotion ? 0 : 2200);
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
        padding: '0 2rem',
        position: 'relative',
        fontFamily: 'Inter, sans-serif'
      }}
      animate={isMerged ? {
        scale: prefersReducedMotion ? [1, 1] : [1.02, 1]
      } : {}}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: 'easeInOut'
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', width: '100%' }}>
        {/* Headline */}
        <motion.h1
          className="hero-headline"
          style={{
            fontSize: 'clamp(1.875rem, 5vw, 3rem)',
            fontWeight: 600,
            textAlign: 'center',
            color: '#111111',
            marginBottom: piecesFading ? '2rem' : '4rem'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: 'easeOut'
          }}
        >
          Exami is bringing simplicity back to education.
        </motion.h1>

        {/* Puzzle Zone */}
        <motion.div
          className="puzzle-zone"
          style={{
            display: piecesFading ? 'none' : 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
            position: 'relative'
          }}
        >
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
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: 'easeInOut'
            }}
            whileHover={!piecesMoving && !piecesFading ? { scale: prefersReducedMotion ? 1 : 1.05 } : {}}
          >
            <img
              src="/assets/puzzle-svg/left-puzzle-block-svg.svg"
              alt="Student puzzle block"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
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
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: 'easeInOut'
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
                  objectFit: 'contain'
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
              duration: prefersReducedMotion ? 0 : 0.6,
              ease: 'easeInOut'
            }}
            whileHover={!piecesMoving && !piecesFading ? { scale: prefersReducedMotion ? 1 : 1.05 } : {}}
          >
            <img
              src="/assets/puzzle-svg/right-puzzle-block-svg.svg"
              alt="Institution puzzle block"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </motion.div>
        </motion.div>

        {/* Draggable Exami Block */}
        {!isMerged && (
          <motion.div
            ref={examiBlockRef}
            className="exami-draggable"
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '96px',
              height: '96px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
              zIndex: 10
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
                pointerEvents: 'none'
              }}
            />
          </motion.div>
        )}


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
                  color: '#111111',
                  textAlign: 'center',
                  marginBottom: showDescription ? '2rem' : '0',
                  marginTop: '0',
                  width: '100%'
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
                  color: '#9ca3af',
                  textAlign: 'center',
                  maxWidth: '800px',
                  margin: '0 auto',
                  lineHeight: '1.6',
                  padding: '0',
                  width: '100%'
                }}
              >
                Exami brings every part of the exam and education process into one simple place. From applying for exams, scholarships, and certifications to managing results and updates — everything happens in one clean, connected platform. No confusion, no endless forms — just a single, unified experience for students, institutions, and educators alike.
              </motion.p>
            )}
          </motion.div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .puzzle-block,
          .drop-zone {
            width: 64px !important;
            height: 64px !important;
          }
          
          .puzzle-block img,
          .drop-zone img {
            width: 100% !important;
            height: 100% !important;
          }

          .exami-draggable {
            width: 64px !important;
            height: 64px !important;
          }

          .exami-draggable > div {
            width: 48px !important;
            height: 48px !important;
            font-size: 18px !important;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default HeroAbout;

