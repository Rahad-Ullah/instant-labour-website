"use client"

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { FiUploadCloud, FiRefreshCw, FiTrash2, FiCheck } from 'react-icons/fi'

interface NidCardUploadProps {
  side: 'front' | 'back'
  imageUrl?: string
  inputId: string
  onFileSelect: (file: File) => void
  onRemove?: () => void
}

/**
 * Realistic vector graphic illustration of the FRONT side of an ID card.
 * Clearly communicates that the user should upload the front side of their ID.
 */
export const NidFrontVector = () => {
  return (
    <svg
      viewBox="0 0 360 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none pointer-events-none"
    >
      <defs>
        <linearGradient id="cardFrontBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#EEF2F6" />
        </linearGradient>
        <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="hologramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FCE7F3" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Card Base */}
      <rect width="360" height="220" rx="16" fill="url(#cardFrontBg)" />

      {/* Subtle security background lines (guilloche simulation) */}
      <path
        d="M-20 60 Q 90 20, 180 80 T 380 40"
        stroke="#E2E8F0"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M-20 90 Q 90 50, 180 110 T 380 70"
        stroke="#E2E8F0"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M-20 120 Q 90 80, 180 140 T 380 100"
        stroke="#E2E8F0"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M-20 150 Q 90 110, 180 170 T 380 130"
        stroke="#E2E8F0"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />

      {/* Top Header Label */}
      <text
        x="28"
        y="26"
        fill="#94A3B8"
        fontSize="9"
        fontWeight="700"
        letterSpacing="1.8"
      >
        NATIONAL IDENTITY CARD
      </text>

      {/* EMV Smart Chip */}
      <rect
        x="28"
        y="36"
        width="44"
        height="32"
        rx="6"
        fill="url(#chipGrad)"
        stroke="#D97706"
        strokeWidth="1"
      />
      {/* Chip circuit lines */}
      <path d="M 40 36 V 68" stroke="#B45309" strokeWidth="0.8" opacity="0.6" />
      <path d="M 60 36 V 68" stroke="#B45309" strokeWidth="0.8" opacity="0.6" />
      <path d="M 28 52 H 72" stroke="#B45309" strokeWidth="0.8" opacity="0.6" />
      <rect
        x="42"
        y="45"
        width="16"
        height="14"
        rx="2"
        fill="#FBBF24"
        stroke="#B45309"
        strokeWidth="0.8"
      />

      {/* Contactless waves */}
      <path
        d="M 82 46 A 8 8 0 0 1 82 58"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 87 42 A 14 14 0 0 1 87 62"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Photo Frame Placeholder */}
      <rect
        x="28"
        y="78"
        width="82"
        height="102"
        rx="8"
        fill="#F1F5F9"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      {/* Avatar Silhouette inside Photo Frame */}
      <circle cx="69" cy="115" r="16" fill="#94A3B8" />
      <path
        d="M 47 165 C 47 142 54 137 69 137 C 84 137 91 142 91 165 Z"
        fill="#94A3B8"
      />

      {/* Info placeholder lines (simulating name, DOB, ID number) */}
      <g transform="translate(126, 80)">
        {/* Name line */}
        <text x="0" y="8" fill="#94A3B8" fontSize="7" fontWeight="600" letterSpacing="0.8">
          FULL NAME
        </text>
        <rect x="0" y="13" width="115" height="7" rx="3.5" fill="#CBD5E1" />

        {/* Document Number line */}
        <text x="0" y="34" fill="#94A3B8" fontSize="7" fontWeight="600" letterSpacing="0.8">
          DOCUMENT NO.
        </text>
        <rect x="0" y="39" width="135" height="7" rx="3.5" fill="#CBD5E1" />

        {/* Date of Birth line */}
        <text x="0" y="60" fill="#94A3B8" fontSize="7" fontWeight="600" letterSpacing="0.8">
          DATE OF BIRTH
        </text>
        <rect x="0" y="65" width="85" height="7" rx="3.5" fill="#CBD5E1" />

        {/* Expiry Date line */}
        <text x="0" y="86" fill="#94A3B8" fontSize="7" fontWeight="600" letterSpacing="0.8">
          EXPIRY DATE
        </text>
        <rect x="0" y="91" width="70" height="7" rx="3.5" fill="#CBD5E1" />
      </g>

      {/* Hologram / Security seal on bottom right */}
      <circle
        cx="312"
        cy="158"
        r="20"
        fill="url(#hologramGrad)"
        stroke="#CBD5E1"
        strokeWidth="1"
      />
      <circle cx="312" cy="158" r="13" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="2 2" fill="none" />
      <path
        d="M 312 148 L 315 155 L 322 155 L 316 159 L 318 166 L 312 162 L 306 166 L 308 159 L 302 155 L 309 155 Z"
        fill="#F59E0B"
        opacity="0.7"
      />
    </svg>
  )
}

/**
 * Realistic vector graphic illustration of the BACK side of an ID card.
 * Clearly communicates that the user should upload the back side of their ID.
 */
export const NidBackVector = () => {
  return (
    <svg
      viewBox="0 0 360 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none pointer-events-none"
    >
      <defs>
        <linearGradient id="cardBackBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#EEF2F6" />
        </linearGradient>
      </defs>

      {/* Card Base */}
      <rect width="360" height="220" rx="16" fill="url(#cardBackBg)" />

      {/* Magnetic Stripe Band */}
      <rect x="0" y="20" width="360" height="38" fill="#334155" />
      {/* Glossy light reflection on magnetic stripe */}
      <rect x="0" y="22" width="360" height="4" fill="#475569" opacity="0.6" />

      {/* Signature Strip */}
      <rect
        x="24"
        y="72"
        width="180"
        height="30"
        rx="4"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1"
      />
      {/* Stylized signature line */}
      <path
        d="M 36 90 Q 50 78, 65 92 T 95 86 T 125 93 T 155 85 T 185 91"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <text x="24" y="66" fill="#94A3B8" fontSize="7" fontWeight="600" letterSpacing="0.8">
        AUTHORIZED SIGNATURE
      </text>

      {/* Chip contacts / Hologram box on right */}
      <rect
        x="218"
        y="72"
        width="118"
        height="30"
        rx="4"
        fill="#F1F5F9"
        stroke="#CBD5E1"
        strokeWidth="1"
      />
      {/* Barcode bars simulation */}
      <g transform="translate(228, 77)">
        <rect x="0" y="0" width="2" height="20" fill="#64748B" />
        <rect x="5" y="0" width="3" height="20" fill="#64748B" />
        <rect x="11" y="0" width="1.5" height="20" fill="#64748B" />
        <rect x="15" y="0" width="4" height="20" fill="#64748B" />
        <rect x="22" y="0" width="1.5" height="20" fill="#64748B" />
        <rect x="26" y="0" width="3" height="20" fill="#64748B" />
        <rect x="32" y="0" width="2" height="20" fill="#64748B" />
        <rect x="37" y="0" width="4" height="20" fill="#64748B" />
        <rect x="44" y="0" width="1.5" height="20" fill="#64748B" />
        <rect x="48" y="0" width="3" height="20" fill="#64748B" />
        <rect x="54" y="0" width="2" height="20" fill="#64748B" />
        <rect x="59" y="0" width="4" height="20" fill="#64748B" />
        <rect x="66" y="0" width="1.5" height="20" fill="#64748B" />
        <rect x="70" y="0" width="3" height="20" fill="#64748B" />
        <rect x="76" y="0" width="2" height="20" fill="#64748B" />
        <rect x="81" y="0" width="4" height="20" fill="#64748B" />
        <rect x="88" y="0" width="2" height="20" fill="#64748B" />
        <rect x="93" y="0" width="3" height="20" fill="#64748B" />
      </g>

      {/* Info placeholder lines */}
      <rect x="24" y="112" width="150" height="5" rx="2.5" fill="#E2E8F0" />
      <rect x="24" y="122" width="190" height="5" rx="2.5" fill="#E2E8F0" />

      {/* Machine Readable Zone (MRZ) */}
      <rect
        x="16"
        y="136"
        width="328"
        height="68"
        rx="8"
        fill="#F1F5F9"
        stroke="#E2E8F0"
        strokeWidth="1"
      />
      <text
        x="26"
        y="160"
        fill="#64748B"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        fontSize="11"
        fontWeight="600"
        letterSpacing="2.8"
      >
        I&lt;GBR1234567897&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
      </text>
      <text
        x="26"
        y="184"
        fill="#64748B"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        fontSize="11"
        fontWeight="600"
        letterSpacing="2.8"
      >
        9801014M2812315GBR&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;2
      </text>
    </svg>
  )
}

/**
 * Validates that an image URL is a real user-uploaded or preview image,
 * NOT a fallback or default platform logo.
 */
export const isValidNidImage = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  if (trimmed === '') return false
  if (trimmed.includes('defaultImage')) return false
  if (trimmed.includes('logo.png')) return false
  if (trimmed.includes('logoFooter.png')) return false
  return true
}

export const NidCardUpload: React.FC<NidCardUploadProps> = ({
  side,
  imageUrl,
  inputId,
  onFileSelect,
  onRemove,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isFront = side === 'front'
  const title = isFront ? 'Front Side' : 'Back Side'
  const hasValidImage = isValidNidImage(imageUrl)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onFileSelect(file)
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col gap-1.5 w-full sm:w-[340px] md:w-[350px]">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              hasValidImage ? 'bg-emerald-500' : 'bg-amber-400'
            }`}
          />
          {title}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            hasValidImage
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {hasValidImage ? 'Uploaded' : 'Required'}
        </span>
      </div>

      <div
        onClick={triggerUpload}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative w-full aspect-[1.58/1] rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden shadow-xs ${
          isDragging
            ? 'border-[#FFC823] bg-amber-50/50 ring-4 ring-[#FFC823]/25 scale-[1.01]'
            : hasValidImage
            ? 'border-gray-200 bg-gray-50 hover:border-[#FFC823]'
            : 'border-dashed border-gray-300 hover:border-[#FFC823] bg-white hover:bg-amber-50/20 hover:shadow-md'
        }`}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {hasValidImage && imageUrl ? (
          /* PREVIEW STATE: Image is uploaded */
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={`National ID ${title}`}
              fill
              className="object-cover"
              unoptimized={imageUrl.startsWith('blob:')}
            />

            {/* Hover overlay for changing picture */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1.5 p-3 backdrop-blur-[2px]">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-sm">
                <FiRefreshCw className="text-lg" />
              </div>
              <span className="text-xs font-semibold tracking-wide">
                Click to replace image
              </span>
            </div>

            {/* Floating Top Controls */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              <span className="bg-emerald-600/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-xs">
                <FiCheck className="text-xs" />
                {title} Uploaded
              </span>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    triggerUpload()
                  }}
                  title="Change image"
                  className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-md border border-gray-200 transition-transform active:scale-95 cursor-pointer"
                >
                  <FiRefreshCw className="text-xs" />
                </button>
                {onRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove()
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    title="Remove image"
                    className="w-7 h-7 rounded-full bg-white/90 hover:bg-red-50 text-gray-700 hover:text-red-600 flex items-center justify-center shadow-md border border-gray-200 transition-transform active:scale-95 cursor-pointer"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* PLACEHOLDER STATE: Authentic Vector ID graphic + Action callout (NO PLATFORM LOGO) */
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background ID card vector illustration */}
            <div className="absolute inset-0 opacity-45 group-hover:opacity-60 transition-opacity duration-200">
              {isFront ? <NidFrontVector /> : <NidBackVector />}
            </div>

            {/* Corner Badge distinguishing Front / Back */}
            <div className="absolute top-2.5 right-2.5 z-10">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase shadow-xs ${
                  isFront
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {isFront ? 'Front Side' : 'Back Side'}
              </span>
            </div>

            {/* Central Upload Callout with Glassmorphism */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-3 rounded-xl bg-white/85 group-hover:bg-white/95 backdrop-blur-sm border border-white/80 shadow-sm transition-all duration-200 max-w-[85%]">
              <div className="w-10 h-10 rounded-full bg-[#FFF9E6] group-hover:bg-[#FFC823] text-amber-600 group-hover:text-gray-900 border border-amber-200 flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-xs mb-1.5">
                <FiUploadCloud className="text-xl" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-800">
                Upload {title}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Click or drag & drop image
              </p>
              <span className="text-[10px] text-gray-400 mt-1 font-medium">
                JPG, PNG or WEBP (up to 10MB)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NidCardUpload
