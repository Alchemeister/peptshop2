'use client'

import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Users,
  X,
  XCircle,
} from 'lucide-react'
import { type FormEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './vendor-evidence-dialog.module.css'

export type VendorEvidenceTab = 'reviews' | 'coas'
export type VendorEvidenceTheme = 'light' | 'dark'

export type VendorEvidenceImage = {
  id: number | string
  alt: string
  thumbnailUrl: string
  url: string
}

export type VendorEvidenceReview = {
  id: number | string
  rating: number
  isRecommending: boolean
  comment: string | null
  createdAt: string | null
  productLabels?: string[]
  response?: {
    comment: string
    createdAt: string | null
  } | null
  images?: VendorEvidenceImage[]
}

export type VendorEvidenceBatchLink = {
  label: string
  href?: string
}

export type VendorEvidenceCoa = {
  id: number | string
  compound: string
  dosage: string | null
  batchNumbers: VendorEvidenceBatchLink[]
  purityLabel: string
  certificateLabel: string
  certificateUrl: string | null
  submittedBy?: 'peptshop' | 'user' | null
}

export type VendorEvidencePagination = {
  page: number
  totalPages: number
  totalItems: number
  perPage: number
  offset: number
}

export type VendorEvidenceCoaFilterOption = {
  compound: string
  dosages: string[]
}

export type VendorEvidenceCoaFilters = {
  compound: string
  dosage: string
  dateFrom: string
  dateTo: string
}

export type VendorEvidenceDialogProps = {
  open: boolean
  vendorName: string
  country?: string | null
  websiteUrl?: string | null
  profileHref: string
  isTrusted?: boolean
  theme?: VendorEvidenceTheme
  loading?: boolean
  error?: string | null
  averageRating: number
  recommendationPercentage: number
  totalReviews: number
  reviews: VendorEvidenceReview[]
  reviewsPagination: VendorEvidencePagination
  reviewsLoading?: boolean
  reviewsError?: string | null
  coas: VendorEvidenceCoa[]
  coasPagination: VendorEvidencePagination
  coasLoading?: boolean
  coasError?: string | null
  coaFilterOptions?: VendorEvidenceCoaFilterOption[]
  coaFilters: VendorEvidenceCoaFilters
  onClose: () => void
  onRetry: () => void
  onReviewsPageChange?: (page: number) => void
  onCoasPageChange?: (page: number) => void
  onCoaFiltersChange?: (filters: VendorEvidenceCoaFilters) => void
}

const EMPTY_COA_FILTERS: VendorEvidenceCoaFilters = {
  compound: '',
  dosage: '',
  dateFrom: '',
  dateTo: '',
}

function formatDate(value: string | null) {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function RatingStars({ rating }: { rating: number }) {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating)))

  return (
    <span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Star
          aria-hidden="true"
          className={index < normalizedRating ? styles.starFilled : styles.starEmpty}
          key={index}
          size={15}
        />
      ))}
    </span>
  )
}

function PaginationControls({
  label,
  pagination,
  loading,
  onPageChange,
}: {
  label: string
  pagination: VendorEvidencePagination
  loading: boolean
  onPageChange?: (page: number) => void
}) {
  if (pagination.totalPages <= 1) return null

  const start = pagination.offset + 1
  const end = Math.min(pagination.offset + pagination.perPage, pagination.totalItems)

  return (
    <div className={styles.pagination}>
      <span>
        Showing {start} to {end} of {pagination.totalItems} {label}
      </span>
      <div className={styles.paginationButtons}>
        <button
          type="button"
          onClick={() => onPageChange?.(pagination.page - 1)}
          disabled={loading || pagination.page <= 1}
          aria-label={`Previous ${label} page`}
        >
          <ChevronLeft aria-hidden="true" size={16} />
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange?.(pagination.page + 1)}
          disabled={loading || pagination.page >= pagination.totalPages}
          aria-label={`Next ${label} page`}
        >
          Next
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      </div>
    </div>
  )
}

function EmptyState({ tab }: { tab: VendorEvidenceTab }) {
  const reviews = tab === 'reviews'
  const Icon = reviews ? Users : FileCheck2

  return (
    <div className={styles.emptyState}>
      <span className={styles.emptyIcon}>
        <Icon aria-hidden="true" size={30} strokeWidth={1.7} />
      </span>
      <h3>{reviews ? 'No reviews yet' : 'No certificates yet'}</h3>
      <p>
        {reviews
          ? "This vendor hasn't received any customer reviews yet."
          : 'No certificates of analysis are available for this vendor yet.'}
      </p>
    </div>
  )
}

function ReviewsPanel({
  reviews,
  pagination,
  loading,
  error,
  onPageChange,
}: {
  reviews: VendorEvidenceReview[]
  pagination: VendorEvidencePagination
  loading: boolean
  error?: string | null
  onPageChange?: (page: number) => void
}) {
  if (reviews.length === 0 && !loading) return <EmptyState tab="reviews" />

  return (
    <div className={styles.panelStack} aria-busy={loading}>
      {error ? <p className={styles.inlineError}>{error}</p> : null}
      <div className={styles.reviewList}>
        {reviews.map((review) => (
          <article className={styles.reviewCard} key={review.id}>
            <div className={styles.reviewHead}>
              <div>
                <RatingStars rating={review.rating} />
                <span className={styles.reviewRating}>{review.rating}/5</span>
              </div>
              <span className={styles.reviewDate}>
                <CalendarDays aria-hidden="true" size={14} />
                {formatDate(review.createdAt)}
              </span>
            </div>
            <div
              className={review.isRecommending ? styles.recommendation : styles.notRecommendation}
            >
              {review.isRecommending ? (
                <CheckCircle2 aria-hidden="true" size={15} />
              ) : (
                <XCircle aria-hidden="true" size={15} />
              )}
              {review.isRecommending ? 'Recommends vendor' : 'Does not recommend'}
            </div>
            <p className={styles.reviewComment}>{review.comment || <em>No written comment</em>}</p>
            {review.productLabels?.length ? (
              <p className={styles.productLabels}>
                <strong>Products:</strong> {review.productLabels.join(', ')}
              </p>
            ) : null}
            {review.images?.length ? (
              <div className={styles.reviewImages}>
                {review.images.map((image) => (
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={image.id}
                    aria-label={`Open ${image.alt}`}
                  >
                    <img src={image.thumbnailUrl} alt={image.alt} loading="lazy" />
                  </a>
                ))}
              </div>
            ) : null}
            {review.response ? (
              <div className={styles.response}>
                <strong>PeptShop response</strong>
                <p>{review.response.comment}</p>
                <span>{formatDate(review.response.createdAt)}</span>
              </div>
            ) : null}
          </article>
        ))}
      </div>
      {loading ? <div className={styles.loadingLine}>Loading reviews...</div> : null}
      <PaginationControls
        label="reviews"
        pagination={pagination}
        loading={loading}
        onPageChange={onPageChange}
      />
    </div>
  )
}

function CoaPanel({
  coas,
  pagination,
  loading,
  error,
  filterOptions,
  filters,
  onPageChange,
  onFiltersChange,
}: {
  coas: VendorEvidenceCoa[]
  pagination: VendorEvidencePagination
  loading: boolean
  error?: string | null
  filterOptions: VendorEvidenceCoaFilterOption[]
  filters: VendorEvidenceCoaFilters
  onPageChange?: (page: number) => void
  onFiltersChange?: (filters: VendorEvidenceCoaFilters) => void
}) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState(filters)
  const filterPanelId = useId()

  useEffect(() => {
    setDraftFilters(filters)
  }, [filters])

  const dosageOptions = useMemo(
    () => filterOptions.find((option) => option.compound === draftFilters.compound)?.dosages ?? [],
    [draftFilters.compound, filterOptions],
  )
  const hasFilters = Boolean(
    filters.compound || filters.dosage || filters.dateFrom || filters.dateTo,
  )

  const submitFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onFiltersChange?.(draftFilters)
    setFiltersOpen(false)
  }

  const resetFilters = () => {
    setDraftFilters(EMPTY_COA_FILTERS)
    onFiltersChange?.(EMPTY_COA_FILTERS)
    setFiltersOpen(false)
  }

  return (
    <div className={styles.panelStack} aria-busy={loading}>
      <div className={styles.filterToolbar}>
        <p>{hasFilters ? 'Showing filtered certificates' : 'All available certificates'}</p>
        <button
          type="button"
          onClick={() => setFiltersOpen((current) => !current)}
          aria-controls={filterPanelId}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal aria-hidden="true" size={15} />
          Filters
        </button>
      </div>
      {filtersOpen ? (
        <form className={styles.filterPanel} id={filterPanelId} onSubmit={submitFilters}>
          <label>
            Product
            <select
              value={draftFilters.compound}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  compound: event.target.value,
                  dosage: '',
                }))
              }
            >
              <option value="">All products</option>
              {filterOptions.map((option) => (
                <option value={option.compound} key={option.compound}>
                  {option.compound}
                </option>
              ))}
            </select>
          </label>
          <label>
            Dosage
            <select
              value={draftFilters.dosage}
              disabled={!draftFilters.compound}
              onChange={(event) =>
                setDraftFilters((current) => ({ ...current, dosage: event.target.value }))
              }
            >
              <option value="">All dosages</option>
              {dosageOptions.map((dosage) => (
                <option value={dosage} key={dosage}>
                  {dosage}
                </option>
              ))}
            </select>
          </label>
          <label>
            From
            <input
              type="date"
              value={draftFilters.dateFrom}
              onChange={(event) =>
                setDraftFilters((current) => ({ ...current, dateFrom: event.target.value }))
              }
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={draftFilters.dateTo}
              onChange={(event) =>
                setDraftFilters((current) => ({ ...current, dateTo: event.target.value }))
              }
            />
          </label>
          <div className={styles.filterActions}>
            <button type="button" onClick={resetFilters}>
              Reset
            </button>
            <button type="submit">Apply filters</button>
          </div>
        </form>
      ) : null}
      {error ? <p className={styles.inlineError}>{error}</p> : null}
      {coas.length === 0 && !loading ? (
        <EmptyState tab="coas" />
      ) : (
        <div className={styles.coaList}>
          {coas.map((coa) => (
            <article className={styles.coaCard} key={coa.id}>
              <span className={styles.coaIcon}>
                <FileCheck2 aria-hidden="true" size={19} />
              </span>
              <div className={styles.coaDetails}>
                <div className={styles.coaTitleRow}>
                  <div>
                    <h3>{coa.compound}</h3>
                    {coa.dosage ? <span>{coa.dosage}</span> : null}
                  </div>
                  {coa.submittedBy ? (
                    <span className={styles.submittedBadge}>
                      {coa.submittedBy === 'peptshop' ? 'PeptShop submitted' : 'User submitted'}
                    </span>
                  ) : null}
                </div>
                <dl className={styles.coaFacts}>
                  <div>
                    <dt>Batch</dt>
                    <dd>
                      {coa.batchNumbers.length ? (
                        coa.batchNumbers.map((batch, index) => (
                          <span key={`${batch.label}-${index}`}>
                            {index > 0 ? ', ' : null}
                            {batch.href ? <a href={batch.href}>{batch.label}</a> : batch.label}
                          </span>
                        ))
                      ) : (
                        <span>Not listed</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Purity</dt>
                    <dd>{coa.purityLabel}</dd>
                  </div>
                </dl>
              </div>
              {coa.certificateUrl ? (
                <a
                  className={styles.certificateLink}
                  href={coa.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {coa.certificateLabel}
                  <ExternalLink aria-hidden="true" size={14} />
                </a>
              ) : (
                <span className={styles.certificateUnavailable}>{coa.certificateLabel}</span>
              )}
            </article>
          ))}
        </div>
      )}
      {loading ? <div className={styles.loadingLine}>Loading certificates...</div> : null}
      <PaginationControls
        label="certificates"
        pagination={pagination}
        loading={loading}
        onPageChange={onPageChange}
      />
    </div>
  )
}

function DialogSkeleton() {
  return (
    <div className={styles.skeleton} aria-label="Loading vendor evidence">
      <div className={styles.skeletonMetrics}>
        <span />
        <span />
      </div>
      <span className={styles.skeletonTabs} />
      <div className={styles.skeletonPanel}>
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

export function VendorEvidenceDialog({
  open,
  vendorName,
  country,
  websiteUrl,
  profileHref,
  isTrusted = false,
  theme = 'light',
  loading = false,
  error = null,
  averageRating,
  recommendationPercentage,
  totalReviews,
  reviews,
  reviewsPagination,
  reviewsLoading = false,
  reviewsError = null,
  coas,
  coasPagination,
  coasLoading = false,
  coasError = null,
  coaFilterOptions = [],
  coaFilters,
  onClose,
  onRetry,
  onReviewsPageChange,
  onCoasPageChange,
  onCoaFiltersChange,
}: VendorEvidenceDialogProps) {
  const [activeTab, setActiveTab] = useState<VendorEvidenceTab>('reviews')
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const reviewsTabId = useId()
  const coasTabId = useId()
  const reviewsPanelId = useId()
  const coasPanelId = useId()

  useEffect(() => {
    if (!open) return
    setActiveTab('reviews')
    closeButtonRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  if (!(open && typeof document !== 'undefined')) return null

  return createPortal(
    <div
      className={styles.backdrop}
      data-theme={theme}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`Reviews and certificates for ${vendorName}`}
        data-testid="vendor-evidence-dialog"
      >
        <header className={styles.header}>
          <div className={styles.vendorIdentity}>
            <span className={styles.eyebrow}>Vendor evidence</span>
            <div className={styles.vendorTitleRow}>
              {websiteUrl ? (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                  <h2>{vendorName}</h2>
                  <ExternalLink aria-hidden="true" size={16} />
                </a>
              ) : (
                <h2>{vendorName}</h2>
              )}
              {isTrusted ? (
                <span className={styles.trustedBadge} title="Trusted PeptShop escrow vendor">
                  <ShieldCheck aria-hidden="true" size={17} />
                  Trusted
                </span>
              ) : null}
            </div>
            {country ? <p>{country}</p> : null}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close vendor evidence dialog"
          >
            <X aria-hidden="true" size={21} />
          </button>
        </header>

        <div className={styles.body}>
          {loading ? (
            <DialogSkeleton />
          ) : error ? (
            <div className={styles.errorState}>
              <h3>Vendor evidence unavailable</h3>
              <p>{error}</p>
              <button type="button" onClick={onRetry}>
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className={styles.metrics}>
                <article>
                  <span>
                    <Star aria-hidden="true" size={16} />
                    Average rating
                  </span>
                  <strong>{averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}</strong>
                  <small>{totalReviews} total reviews</small>
                </article>
                <article>
                  <span>
                    <TrendingUp aria-hidden="true" size={16} />
                    Recommendation rate
                  </span>
                  <strong>{totalReviews > 0 ? `${recommendationPercentage}%` : 'N/A'}</strong>
                  <small>From verified customer feedback</small>
                </article>
              </div>

              <div className={styles.tabs} role="tablist" aria-label="Vendor evidence">
                <button
                  type="button"
                  id={reviewsTabId}
                  role="tab"
                  aria-controls={reviewsPanelId}
                  aria-selected={activeTab === 'reviews'}
                  className={activeTab === 'reviews' ? styles.tabActive : undefined}
                  onClick={() => setActiveTab('reviews')}
                >
                  Customer reviews
                  <span>{reviewsPagination.totalItems}</span>
                </button>
                <button
                  type="button"
                  id={coasTabId}
                  role="tab"
                  aria-controls={coasPanelId}
                  aria-selected={activeTab === 'coas'}
                  className={activeTab === 'coas' ? styles.tabActive : undefined}
                  onClick={() => setActiveTab('coas')}
                >
                  Certificates of analysis
                  <span>{coasPagination.totalItems}</span>
                </button>
              </div>

              <div className={styles.panel}>
                <div
                  id={reviewsPanelId}
                  role="tabpanel"
                  aria-labelledby={reviewsTabId}
                  hidden={activeTab !== 'reviews'}
                >
                  <ReviewsPanel
                    reviews={reviews}
                    pagination={reviewsPagination}
                    loading={reviewsLoading}
                    error={reviewsError}
                    onPageChange={onReviewsPageChange}
                  />
                </div>
                <div
                  id={coasPanelId}
                  role="tabpanel"
                  aria-labelledby={coasTabId}
                  hidden={activeTab !== 'coas'}
                >
                  <CoaPanel
                    coas={coas}
                    pagination={coasPagination}
                    loading={coasLoading}
                    error={coasError}
                    filterOptions={coaFilterOptions}
                    filters={coaFilters}
                    onPageChange={onCoasPageChange}
                    onFiltersChange={onCoaFiltersChange}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <footer className={styles.footer}>
          <a href={profileHref}>
            View full vendor profile
            <ChevronRight aria-hidden="true" size={16} />
          </a>
        </footer>
      </section>
    </div>,
    document.body,
  )
}
