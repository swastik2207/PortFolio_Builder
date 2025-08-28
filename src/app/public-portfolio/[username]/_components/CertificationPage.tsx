'use client'
import React from 'react'
import { Portfolio } from '@/types/portfolio'
import { Award } from 'lucide-react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Image from 'next/image'

interface CertificationPageProps {
  portfolio: Portfolio
}

const CertificationPage: React.FC<CertificationPageProps> = ({ portfolio }) => {
  const certificates = portfolio.certificates || []

  // Group certificates for responsive display
  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 768) return 2  // md and up (desktop)
      return 1 // sm and below (mobile)
    }
    return 2 // Default for SSR
  }

  const groupCertificates = (certs: any[], itemsPerSlide: number) => {
    const groups = []
    for (let i = 0; i < certs.length; i += itemsPerSlide) {
      groups.push(certs.slice(i, i + itemsPerSlide))
    }
    return groups
  }

  const [itemsPerSlide, setItemsPerSlide] = React.useState(getItemsPerSlide)

  React.useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const certificateGroups = groupCertificates(certificates, itemsPerSlide)

  return (
    <section className="pt-8 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className={`font-geisSans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-500`}>
            Certifications
          </h2>
          <p className="text-gray-400 text-lg">
            Professional certifications and credentials that validate my expertise
          </p>
        </div>

        {certificates.length > 0 ? (
          <div className="relative max-w-7xl mx-auto">
            <Carousel
              selectedItem={0}
              showArrows={true}
              showStatus={false}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={5000}
              stopOnHover={true}
              swipeable={false}
              emulateTouch={true}
              className="certification-carousel"
              renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    title={label}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700/90 border border-gray-600/50 hover:border-yellow-500/50 rounded-full p-3 transition-all duration-300 hover:scale-110 group"
                  >
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )
              }
              renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && (
                  <button
                    type="button"
                    onClick={onClickHandler}
                    title={label}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700/90 border border-gray-600/50 hover:border-yellow-500/50 rounded-full p-3 transition-all duration-300 hover:scale-110 group"
                  >
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )
              }
              renderIndicator={(onClickHandler, isSelected, index, label) => (
                <button
                  key={index}
                  onClick={onClickHandler}
                  title={label}
                  className={`inline-block w-3 h-3 mx-1 rounded-full transition-all duration-300 ${isSelected
                      ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50 scale-110'
                      : 'bg-gray-600 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              )}
            >
              {certificateGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="px-4 pb-8 my-24">
                  <div className={`grid gap-6 ${itemsPerSlide === 1 ? 'grid-cols-1' : 'grid-cols-2'
                    }`}>
                    {group.map((cert, certIndex) => (
                      <div
                        key={certIndex}
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-yellow-500/50 hover:scale-105 group flex flex-col"
                      >
                        {/* Certificate Image */}
                        {cert.pic && (
                          <div className="mb-4 overflow-hidden rounded-lg">
                            <Image
                              src={cert.pic}
                              alt={cert.name || 'Certificate'}
                              width={1920}
                              height={1080}
                              className="object-contain rounded-lg border border-gray-600 bg-white p-2 group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Certificate Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start">
                            <div className="bg-yellow-500/20 p-2 rounded-lg mr-3 flex-shrink-0">
                              <Award className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors leading-tight">
                                {cert.name}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Certificate Description */}
                        {cert.description && (
                          <div className="mb-4 flex-grow">
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {cert.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400 text-lg">No certifications added yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                Your professional certifications will appear here once you add them.
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .certification-carousel .carousel-root {
          outline: none;
        }
        
        .certification-carousel .carousel .slider-wrapper {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .certification-carousel .carousel .slider {
          border-radius: 12px;
        }
        
        .certification-carousel .carousel .slide {
          background: transparent;
          border-radius: 12px;
        }
        
        .certification-carousel .control-dots {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          bottom: -50px !important;
          margin: 0 !important;
          padding: 10px 0 !important;
          text-align: center !important;
          position: relative !important;
          z-index: 10 !important;
        }
        
        .certification-carousel .control-dots .dot {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          margin: 0 !important;
          padding: 0 !important;
          cursor: pointer !important;
          display: inline-block !important;
        }
        
        .certification-carousel .control-arrow {
          display: none !important;
        }
        
        @media (max-width: 768px) {
          .certification-carousel .control-dots {
            bottom: -40px !important;
          }
        }
        
        .certification-carousel .carousel .slider-wrapper.axis-horizontal .slider {
          transition: all 0.5s ease-in-out;
        }
        
        .certification-carousel .carousel .slider-wrapper:focus {
          outline: 2px solid #f59e0b;
          outline-offset: 2px;
        }
        
        .certification-carousel .carousel {
          padding-bottom: 60px !important;
        }
      `}</style>
    </section>
  )
}

export default CertificationPage