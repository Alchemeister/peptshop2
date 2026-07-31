import { Bell, Mail } from 'lucide-react'
import type {
  ButtonHTMLAttributes,
  ChangeEventHandler,
  FormEventHandler,
  HTMLAttributes,
  ReactNode,
} from 'react'
import styles from './product-page.module.css'

export type ProductPageTheme = 'light' | 'dark'

type ProductPageFrameProps = {
  children: ReactNode
  theme?: ProductPageTheme
}

type ProductPageHeroProps = {
  backControl: ReactNode
  cas?: string | null
  dosageLabel: string
  dosageSelector: ReactNode
  formula?: string | null
  imageAlt?: string
  imageSrc?: string | null
  mw?: string | null
  overview?: string | null
  productName: string
}

type ProductBackControlFrameProps = {
  children: ReactNode
}

type ProductDosageSelectorFrameProps = {
  children: ReactNode
}

type ProductDosageOptionFrameProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected: boolean
}

type ProductAboutSectionProps = {
  children: ReactNode
}

type ProductUnavailableStateProps = {
  onNotify: () => void
  productName: string
}

type ProductOffersSectionProps = {
  children: ReactNode
  dosage?: string | null
}

type CompoundWaitlistFormProps = {
  email: string
  errorMessage?: string | null
  indicator?: ReactNode
  isIdle: boolean
  onEmailChange: ChangeEventHandler<HTMLInputElement>
  onSubmit: FormEventHandler<HTMLFormElement>
  productName: string
}

type VendorOfferCardFrameProps = HTMLAttributes<HTMLElement> & {
  loading?: boolean
}

type VendorOfferOptionFrameProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected: boolean
}

const joinClassNames = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ')

export function ProductPageFrame({ children, theme = 'light' }: ProductPageFrameProps) {
  return (
    <div className={styles.page} data-product-theme={theme}>
      <div className={styles.pageInner}>{children}</div>
    </div>
  )
}

export function ProductBackControlFrame({ children }: ProductBackControlFrameProps) {
  return <span className={styles.backControlFrame}>{children}</span>
}

export function ProductDosageSelectorFrame({ children }: ProductDosageSelectorFrameProps) {
  return <div className={styles.dosageOptions}>{children}</div>
}

export function ProductDosageOptionFrame({
  children,
  className,
  selected,
  ...buttonProps
}: ProductDosageOptionFrameProps) {
  return (
    <button
      {...buttonProps}
      type="button"
      aria-pressed={selected}
      className={joinClassNames(
        styles.dosageOption,
        selected ? styles.dosageOptionSelected : undefined,
        className,
      )}
    >
      {children}
    </button>
  )
}

export function ProductPageHero({
  backControl,
  cas,
  dosageLabel,
  dosageSelector,
  formula,
  imageAlt,
  imageSrc,
  mw,
  overview,
  productName,
}: ProductPageHeroProps) {
  const hasFacts = Boolean(cas || formula || mw)

  return (
    <header className={styles.hero} data-testid="peptide-header">
      <div className={styles.heroCopy}>
        <div className={styles.backControl}>{backControl}</div>
        <div className={styles.heroTitleBlock}>
          <h1>{productName}</h1>
          {overview ? (
            <p className={styles.heroOverview}>{overview}</p>
          ) : (
            <p>Compare verified listings, pack sizes, and fulfillment terms before you buy.</p>
          )}
        </div>

        {hasFacts ? (
          <dl className={styles.facts} aria-label="Product details">
            {cas ? (
              <div>
                <dt>CAS</dt>
                <dd>{cas}</dd>
              </div>
            ) : null}
            {formula ? (
              <div>
                <dt>Formula</dt>
                <dd>{formula}</dd>
              </div>
            ) : null}
            {mw ? (
              <div>
                <dt>MW</dt>
                <dd>{mw} Da</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </div>



      <div className={styles.dosageRail}>
        <div className={styles.dosagePrompt}>
          <span>Choose a format</span>
          <strong>{dosageLabel}</strong>
        </div>
        <div className={styles.dosageSelector}>{dosageSelector}</div>
      </div>
    </header>
  )
}

export function ProductUnavailableState({ onNotify, productName }: ProductUnavailableStateProps) {
  return (
    <section className={styles.unavailable} data-testid="compound-availability-waitlist-card">
      <div className={styles.unavailableIcon} aria-hidden="true">
        <Bell size={20} strokeWidth={1.8} />
      </div>
      <div className={styles.unavailableCopy}>
        <p className={styles.stateLabel}>Availability alert</p>
        <h2>No live offers yet</h2>
        <p>We will email you when {productName} becomes orderable from a PeptShop vendor.</p>
      </div>
      <button type="button" onClick={onNotify} className={styles.primaryAction}>
        <Bell size={17} strokeWidth={1.8} aria-hidden="true" />
        Notify me
      </button>
    </section>
  )
}

export function ProductAboutSection({ children }: ProductAboutSectionProps) {
  return (
    <section
      aria-labelledby="catalog-about-peptide-heading"
      className={styles.about}
      data-testid="catalog-about-peptide"
    >
      <h2 id="catalog-about-peptide-heading">Product overview</h2>
      <div className={styles.richText}>{children}</div>
    </section>
  )
}

export function ProductOffersSection({ children, dosage }: ProductOffersSectionProps) {
  return (
    <section className={styles.offers} aria-labelledby="peptshop-product-offers-heading">
      <div className={styles.sectionHeading}>
        <h2 id="peptshop-product-offers-heading">
          {dosage ? `${dosage} listings` : 'Vendor listings'}
        </h2>
        <p>Compare total price, pack size, batch evidence, and shipping origin.</p>
      </div>
      {children}
    </section>
  )
}

export function ProductFilterEmptyState() {
  return (
    <div className={styles.filterEmpty}>
      <strong>No matching listings</strong>
      <span>Clear a catalog filter to see more vendors.</span>
    </div>
  )
}

export function CompoundWaitlistTitle({ productName }: { productName: string }) {
  return <h2 className={styles.dialogTitle}>Get {productName} alerts</h2>
}

export function CompoundWaitlistDescription() {
  return (
    <p className={styles.dialogDescription}>
      One email when a PeptShop listing goes live. No promotional mail.
    </p>
  )
}

export function CompoundWaitlistForm({
  email,
  errorMessage,
  indicator,
  isIdle,
  onEmailChange,
  onSubmit,
  productName,
}: CompoundWaitlistFormProps) {
  return (
    <form
      className={styles.waitlistForm}
      onSubmit={onSubmit}
      toolname="join_compound_waitlist"
      tooldescription={`Requests an availability email when a vendor lists ${productName}.`}
    >
      <div className={styles.fieldGroup}>
        <label htmlFor="peptshop-product-alert-email">Email address</label>
        <div className={styles.inputShell}>
          <Mail size={17} strokeWidth={1.8} aria-hidden="true" />
          <input
            id="peptshop-product-alert-email"
            type="email"
            name="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Email address"
            autoComplete="email"
            toolparamdescription="The email address that should receive the waitlist confirmation message."
            required
            disabled={!isIdle}
          />
        </div>
      </div>

      {indicator}

      {errorMessage ? (
        <p className={styles.formError} role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className={styles.formSubmit}
        disabled={!isIdle || email.trim().length === 0}
      >
        Watch this product
      </button>
    </form>
  )
}

export function VendorOfferCardFrame({
  children,
  className,
  loading = false,
  ...articleProps
}: VendorOfferCardFrameProps) {
  return (
    <article
      {...articleProps}
      className={joinClassNames(
        styles.vendorCard,
        loading ? styles.vendorCardLoading : undefined,
        className,
      )}
    >
      {children}
    </article>
  )
}

export function VendorOfferOptionFrame({
  children,
  className,
  selected,
  ...buttonProps
}: VendorOfferOptionFrameProps) {
  return (
    <button
      {...buttonProps}
      type="button"
      aria-pressed={selected}
      className={joinClassNames(
        styles.vendorOption,
        selected ? styles.vendorOptionSelected : undefined,
        className,
      )}
    >
      {children}
    </button>
  )
}
