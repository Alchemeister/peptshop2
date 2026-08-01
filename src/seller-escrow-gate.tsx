import { ArrowRight, Check, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useId, useState, useTransition } from 'react'

export type SellerEscrowTier = 'EXEMPT' | 'STANDARD' | 'EXTENDED'

export type SellerEscrowGateResult = {
  success: boolean
  error?: string
}

export type SellerEscrowGateOption = {
  tier: SellerEscrowTier
  percentage: 0 | 15 | 50
  title: string
  description?: string
  bullets: readonly string[]
  ctaLabel: string
  pendingLabel: string
  notice?: string
  detail?: {
    label: string
    value: string
    caption?: string
  }
  requiresConfirmation?: boolean
}

export type SellerEscrowGateModel = {
  badge: string
  headline: string
  lead: string
  options: readonly SellerEscrowGateOption[]
  confirmation: {
    prompt: string
    confirmLabel: string
    pendingLabel: string
    cancelLabel: string
  }
  failureLabel: string
  offboardNote: string
}

export type SellerEscrowGateProps = {
  model: SellerEscrowGateModel
  onChooseTier: (tier: SellerEscrowTier) => Promise<SellerEscrowGateResult>
}

/**
 * Designer-owned presentation for the seller's initial escrow choice.
 *
 * The private host supplies localized, sanitized display copy and implements
 * the callback. This component owns markup, visual states, confirmation, and
 * responsive presentation. It never decides eligibility or persists a tier.
 */
export function SellerEscrowGate({ model, onChooseTier }: SellerEscrowGateProps) {
  const headingId = useId()
  const [confirmingTier, setConfirmingTier] = useState<SellerEscrowTier | null>(null)
  const [pendingTier, setPendingTier] = useState<SellerEscrowTier | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const confirmingOption = model.options.find((option) => option.tier === confirmingTier)

  const submit = (tier: SellerEscrowTier) => {
    setError(null)
    setPendingTier(tier)
    startTransition(async () => {
      try {
        const result = await onChooseTier(tier)
        if (!result.success) {
          setError(result.error ?? model.failureLabel)
          setPendingTier(null)
          return
        }
        setConfirmingTier(null)
        setPendingTier(null)
      } catch {
        setError(model.failureLabel)
        setPendingTier(null)
      }
    })
  }

  const choose = (option: SellerEscrowGateOption) => {
    if (option.requiresConfirmation) {
      setError(null)
      setConfirmingTier(option.tier)
      return
    }
    setConfirmingTier(null)
    submit(option.tier)
  }

  return (
    <section
      className="ps-seller-escrow-gate"
      data-frontend-surface="seller-escrow-gate"
      aria-labelledby={headingId}
      aria-busy={isPending}
    >
      <header className="ps-seller-escrow-gate__header">
        <span className="ps-seller-escrow-gate__badge">
          <ShieldCheck size={15} aria-hidden="true" />
          {model.badge}
        </span>
        <div>
          <h1 id={headingId}>{model.headline}</h1>
          <span>{model.lead}</span>
        </div>
      </header>

      <div className="ps-seller-escrow-gate__options">
        {model.options.map((option) => (
          <article
            className="ps-seller-escrow-gate__option"
            data-tier={option.tier.toLowerCase()}
            data-confirming={confirmingTier === option.tier || undefined}
            key={option.tier}
          >
            <div className="ps-seller-escrow-gate__rate">
              <strong>{option.percentage}%</strong>
            </div>
            <div className="ps-seller-escrow-gate__copy">
              <h2>{option.title}</h2>
              {option.description ? <p>{option.description}</p> : null}
            </div>
            <ul>
              {option.bullets.map((bullet) => (
                <li key={bullet}>
                  <Check size={14} aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            {option.detail ? (
              <div className="ps-seller-escrow-gate__detail">
                <div>
                  <span>{option.detail.label}</span>
                  <strong>{option.detail.value}</strong>
                </div>
                {option.detail.caption ? <p>{option.detail.caption}</p> : null}
              </div>
            ) : null}
            {option.notice ? (
              <p
                className="ps-seller-escrow-gate__notice"
                id={`${headingId}-${option.tier}-notice`}
              >
                <LockKeyhole size={14} aria-hidden="true" />
                {option.notice}
              </p>
            ) : null}
            <button
              type="button"
              disabled={isPending}
              onClick={() => choose(option)}
              aria-describedby={option.notice ? `${headingId}-${option.tier}-notice` : undefined}
            >
              <span>
                {isPending && pendingTier === option.tier ? option.pendingLabel : option.ctaLabel}
              </span>
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>

      {confirmingOption ? (
        <div
          className="ps-seller-escrow-gate__confirmation"
          role="group"
          aria-label={model.confirmation.prompt}
        >
          <div>
            <p>{model.confirmation.prompt}</p>
          </div>
          <div className="ps-seller-escrow-gate__confirmation-actions">
            <button
              type="button"
              disabled={isPending}
              onClick={() => submit(confirmingOption.tier)}
            >
              {isPending && pendingTier === confirmingOption.tier
                ? model.confirmation.pendingLabel
                : model.confirmation.confirmLabel}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setConfirmingTier(null)
                setError(null)
              }}
            >
              {model.confirmation.cancelLabel}
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="ps-seller-escrow-gate__error" role="alert">
          {error}
        </p>
      ) : null}

      <footer>
        <LockKeyhole size={15} aria-hidden="true" />
        <p>{model.offboardNote}</p>
      </footer>
    </section>
  )
}
