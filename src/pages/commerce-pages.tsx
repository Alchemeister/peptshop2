import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  FileText,
  LockKeyhole,
  Mail,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  WalletCards,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { CartLine, OrderDisplayStatus, PageComponentProps } from '../contracts'
import { FrontendLink } from '../navigation'

const money = (value: number) => `$${value.toFixed(2)}`

export function CommercePage(props: PageComponentProps) {
  if (props.pathname === '/cart') return <CartPage {...props} />
  if (props.pathname.endsWith('/checkout') || props.pathname === '/checkout') return <CheckoutPage {...props} />
  return <PaymentPage {...props} />
}

function CartPage({ actions, models }: PageComponentProps) {
  const subtotal = models.cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  // Group cart lines by vendor
  const vendorGroups = useMemo(() => {
    const groups: Record<string, { vendorName: string; lines: CartLine[] }> = {}
    for (const line of models.cart) {
      const vName = line.vendor || 'Unassigned'
      if (!groups[vName]) groups[vName] = { vendorName: vName, lines: [] }
      groups[vName].lines.push(line)
    }
    return Object.values(groups)
  }, [models.cart])
  return (
    <div className="ps-cart-page ps-section-shell">
      <header className="ps-page-masthead"><span className="ps-kicker">Order builder</span><div className="ps-page-title-row"><h1>Your cart</h1><p>{models.cart.length} items from {vendorGroups.length} vendor{vendorGroups.length === 1 ? '' : 's'}.</p></div></header>
      <div className="ps-cart-layout">
        <div className="ps-cart-lines">
          {vendorGroups.length === 0 ? (
            <div className="ps-empty-state">
              <ShoppingBag size={24} />
              <h2>Your cart is empty</h2>
              <p>Browse the catalog to add items.</p>
              <FrontendLink href="/products" navigate={actions.navigate} className="ps-primary-action">Browse catalog <ArrowRight size={16} /></FrontendLink>
            </div>
          ) : (
            vendorGroups.map((group) => (
              <div key={group.vendorName} className="ps-cart-vendor-group">
                <div className="ps-cart-vendor-head"><div><span className="ps-status-dot" /><strong>{group.vendorName}</strong></div><span><MapPin size={14} /> Ships from USA · <Truck size={14} /> Tracked shipping</span></div>
                {group.lines.map((line) => <CartLineItem key={line.id} line={line} actions={actions} />)}
                <div className="ps-cart-vendor-subtotal">
                  <span>Subtotal from {group.vendorName}</span>
                  <strong>{money(group.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0))}</strong>
                </div>
              </div>
            ))
          )}
          {vendorGroups.length > 0 ? (
            <>
              <div className="ps-shipping-progress"><div><Truck size={17} /><span><strong>Tracked shipping</strong><small>Calculated during checkout</small></span></div><div><i style={{ width: '76%' }} /></div></div>
              <div className="ps-cart-secondary-actions">
                <FrontendLink href="/products" navigate={actions.navigate} className="ps-back-link"><ArrowLeft size={16} /> Continue browsing</FrontendLink>
                <button type="button" onClick={actions.clearCart}>Clear cart</button>
              </div>
            </>
          ) : null}
        </div>
        {vendorGroups.length > 0 ? <OrderSummaryPanel subtotal={subtotal} beginCheckout={actions.beginCheckout} navigate={actions.navigate} /> : null}
      </div>
    </div>
  )
}

function CartLineItem({ line, actions }: { line: CartLine; actions: PageComponentProps['actions'] }) {
  return (
    <article className="ps-cart-line">
      <div className="ps-cart-line-image"><img src="/vial.svg" alt="" /></div>
      <div className="ps-cart-line-copy"><h2>{line.product}</h2><p>{line.format}</p><button type="button" onClick={() => actions.removeCartLine(line.id)}>Remove</button></div>
      <div className="ps-quantity-control"><button type="button" aria-label="Decrease quantity" onClick={() => actions.updateCartQuantity(line.id, Math.max(1, line.quantity - 1))}><Minus size={14} /></button><span>{line.quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => actions.updateCartQuantity(line.id, line.quantity + 1)}><Plus size={14} /></button></div>
      <strong className="ps-cart-line-total">{money(line.unitPrice * line.quantity)}</strong>
    </article>
  )
}

function OrderSummaryPanel({ subtotal, beginCheckout, navigate }: { subtotal: number; beginCheckout: () => void; navigate: (href: string) => void }) {
  return (
    <aside className="ps-order-summary-panel">
      <h2>Order summary</h2>
      <dl><div><dt>Products</dt><dd>{money(subtotal)}</dd></div><div><dt>Shipping</dt><dd>At checkout</dd></div><div><dt>Estimated total</dt><dd>{money(subtotal)}</dd></div></dl>
      <button type="button" onClick={() => { beginCheckout(); navigate('/checkout') }}>Continue to checkout <ArrowRight size={17} /></button>
      <p><LockKeyhole size={14} /> Secure order session</p>
      <div className="ps-summary-note"><ShieldCheck size={17} /><span><strong>Marketplace protection</strong>Order events and delivery confirmation remain attached to this checkout.</span></div>
    </aside>
  )
}

type CheckoutDraft = Record<string, string>

const readCheckoutDraft = (form: HTMLFormElement): CheckoutDraft => {
  const draft: CheckoutDraft = {}
  for (const [name, value] of new FormData(form)) {
    if (typeof value === 'string') draft[name] = value
  }
  return draft
}

function CheckoutPage({ actions, models }: PageComponentProps) {
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<CheckoutDraft>({})
  const subtotal = models.cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  const goBack = (form: HTMLFormElement | null) => {
    if (form) setDraft((current) => ({ ...current, ...readCheckoutDraft(form) }))
    setStep((value) => Math.max(1, value - 1))
  }
  return (
    <div className="ps-checkout-page ps-section-shell">
      <button type="button" className="ps-back-link" onClick={() => actions.navigate('/cart')}><ArrowLeft size={16} /> Return to cart</button>
      <header className="ps-checkout-head"><div><span className="ps-kicker">Secure checkout</span><h1>Complete your order</h1></div><ol><li data-active={step >= 1}><span>1</span>Contact</li><li data-active={step >= 2}><span>2</span>Delivery</li><li data-active={step >= 3}><span>3</span>Payment</li></ol></header>
      <div className="ps-checkout-layout">
        <form className="ps-checkout-form" onSubmit={(event) => {
          event.preventDefault()
          const nextDraft = { ...draft, ...readCheckoutDraft(event.currentTarget) }
          if (step < 3) {
            setDraft(nextDraft)
            setStep((value) => value + 1)
          } else {
            actions.submitCheckout(event.currentTarget)
          }
        }}>
          {step === 3 ? Object.entries(draft).map(([name, value]) => (
            <input key={name} name={name} type="hidden" value={value} />
          )) : null}
          {step === 1 ? <CheckoutContact draft={draft} /> : null}
          {step === 2 ? <CheckoutDelivery draft={draft} /> : null}
          {step === 3 ? <CheckoutPayment /> : null}
          <div className="ps-checkout-actions">{step > 1 ? <button type="button" onClick={(event) => goBack(event.currentTarget.form)}>Back</button> : <span /> }<button type="submit">{step === 3 ? 'Place order' : 'Continue'} <ArrowRight size={17} /></button></div>
        </form>
        <aside className="ps-checkout-summary"><h2>In this order</h2>{models.cart.map((line) => <div key={line.id}><img src="/vial.svg" alt="" /><span><strong>{line.product}</strong><small>{line.format}</small></span><b>{money(line.unitPrice)}</b></div>)}<dl><div><dt>Products</dt><dd>{money(subtotal)}</dd></div><div><dt>Shipping</dt><dd>$12.00</dd></div><div><dt>Total</dt><dd>{money(subtotal + 12)}</dd></div></dl><p><ShieldCheck size={15} /> Marketplace order protection included</p></aside>
      </div>
    </div>
  )
}

function CheckoutContact({ draft }: { draft: CheckoutDraft }) {
  return <fieldset className="ps-checkout-step"><legend><span>01</span><div><strong>Contact</strong><small>Where should order updates go?</small></div></legend><label>Email address<input defaultValue={draft.email} name="email" type="email" placeholder="Email address" required /></label><label>Phone number <small>Optional</small><input defaultValue={draft.phone} name="phone" type="tel" placeholder="Phone number" /></label><label className="ps-check-row"><input type="checkbox" /><span>Send essential fulfillment updates by text.</span></label></fieldset>
}

function CheckoutDelivery({ draft }: { draft: CheckoutDraft }) {
  return <fieldset className="ps-checkout-step"><legend><span>02</span><div><strong>Delivery</strong><small>Used only to fulfill this order.</small></div></legend><div className="ps-form-grid"><label>Full name<input defaultValue={draft.name} name="name" placeholder="Full name" required /></label><label>Country<select name="country" defaultValue={draft.country ?? 'US'}><option value="US">United States</option><option value="GB">United Kingdom</option><option value="CA">Canada</option></select></label><label className="ps-field-wide">Street address<input defaultValue={draft.address} name="address" placeholder="Street address" required /></label><label>City<input defaultValue={draft.city} name="city" placeholder="City" required /></label><label>State or region<input defaultValue={draft.region} name="region" placeholder="State or region" required /></label><label>Postal code<input defaultValue={draft.postal} name="postal" placeholder="Postal code" required /></label></div><div className="ps-delivery-choice"><Truck size={19} /><span><strong>Tracked shipping</strong><small>Estimated 3 to 5 business days</small></span><b>$12.00</b></div></fieldset>
}

function CheckoutPayment() {
  return <fieldset className="ps-checkout-step"><legend><span>03</span><div><strong>Payment</strong><small>Select your payment method.</small></div></legend><div className="ps-payment-options"><label><input type="radio" name="payment" defaultChecked /><WalletCards size={20} /><span><strong>NOWPayments</strong><small>BTC, ETH, USDT, USDC, XMR, 100+ coins</small></span></label></div><label className="ps-check-row"><input type="checkbox" required /><span>I acknowledge the research-use terms and order policies.</span></label></fieldset>
}

function PaymentPage({ actions, models }: PageComponentProps) {
  const [copied, setCopied] = useState(false)
  const total = models.cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  const orderTotal = (total + 12).toFixed(2) // total + shipping
  const orderId = `PS-${Math.floor(1000 + Math.random() * 9000)}`
  return <div className="ps-payment-page"><section><span className="ps-kicker">Payment pending</span><h1>Send exactly <strong>${orderTotal}</strong></h1><p>Complete payment via NOWPayments. You'll receive a payment link by email with a live invoice and countdown timer. BTC, ETH, USDT, USDC, XMR, and 100+ coins accepted.</p><div className="ps-payment-address"><span>Order reference</span><code>{orderId}</code><button type="button" onClick={() => setCopied(true)}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button></div><div className="ps-payment-notes"><p><strong>Processor</strong>NOWPayments</p><p><strong>Order</strong>{orderId}</p><p><strong>Status</strong>Waiting for payment</p></div><button type="button" className="ps-outline-action" onClick={() => actions.navigate('/order/status/preview')}>I have sent payment <ArrowRight size={17} /></button></section></div>
}

export function OrderFlowPage({ actions, models, pathname }: PageComponentProps) {
  const isLookup = pathname === '/order-status' || pathname === '/order/status'
  if (isLookup) return <OrderLookupPage actions={actions} />
  if (pathname.includes('/review')) return <CustomerActionPage mode="review" />
  if (pathname.includes('/refund')) return <CustomerActionPage mode="refund" />
  if (pathname.includes('/confirm-delivery') || pathname.includes('/escrow-check-in')) return <CustomerActionPage mode="delivery" />
  if (pathname.includes('/dispute')) return <CustomerActionPage mode="dispute" />
  if (pathname.includes('/research/')) return <CustomerActionPage mode="research" />
  return <OrderStatusDetail actions={actions} models={models} pathname={pathname} />
}

function OrderLookupPage({ actions }: Pick<PageComponentProps, 'actions'>) {
  return <div className="ps-lookup-page"><section><span className="ps-kicker">Private order access</span><h1>Track an order</h1><p>Use a synthetic QA order number and its reserved example.test email.</p><form onSubmit={(event) => {
    event.preventDefault()
    const orderNumber = new FormData(event.currentTarget).get('orderNumber')
    if (typeof orderNumber === 'string' && orderNumber.trim()) {
      actions.navigate(`/order/status/${encodeURIComponent(orderNumber.trim().toUpperCase())}`)
    }
  }}><label>Order number<div><PackageCheck size={17} /><input name="orderNumber" placeholder="QA-1A2B3C4D" required /></div></label><label>Email address<div><Mail size={17} /><input name="email" type="email" placeholder="qa+designer@example.test" required /></div></label><button type="submit">Find order <ArrowRight size={17} /></button></form><p className="ps-form-note"><LockKeyhole size={14} /> The protected QA workspace contains synthetic orders only.</p></section></div>
}

const ORDER_STATUS_LABELS: Record<OrderDisplayStatus, string> = {
  accepted: 'Accepted',
  cancelled: 'Cancelled',
  delivered: 'Delivered',
  paid: 'Fake payment confirmed',
  payment_pending: 'Waiting for fake payment',
  refunded: 'Fake refund completed',
  review: 'Under review',
  shipped: 'Shipped',
}

const ORDER_STEPS: Array<{ label: string; status: OrderDisplayStatus }> = [
  { label: 'Order placed', status: 'payment_pending' },
  { label: 'Fake payment confirmed', status: 'paid' },
  { label: 'Vendor accepted', status: 'accepted' },
  { label: 'Marked shipped', status: 'shipped' },
  { label: 'Marked delivered', status: 'delivered' },
]

const formatOrderEventTime = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Synthetic event recorded'
    : new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC',
      }).format(date)
}

function OrderStatusDetail({
  actions,
  models,
  pathname,
}: Pick<PageComponentProps, 'actions' | 'models' | 'pathname'>) {
  const encodedNumber = pathname.split('/').filter(Boolean).at(-1) ?? ''
  const requestedNumber = decodeURIComponent(encodedNumber).toUpperCase()
  const order =
    requestedNumber === 'PREVIEW'
      ? models.orders[0]
      : models.orders.find((candidate) => candidate.number.toUpperCase() === requestedNumber)

  if (!order) {
    return <div className="ps-order-status-page ps-section-shell"><button type="button" className="ps-back-link" onClick={() => actions.navigate('/order/status')}><ArrowLeft size={16} /> Track another order</button><div className="ps-empty-state"><PackageCheck size={24} /><h1>No synthetic order found</h1><p>Place an order in the protected QA checkout or enter a QA order number from this workspace.</p></div></div>
  }

  const events = order.events ?? []
  return <div className="ps-order-status-page ps-section-shell"><button type="button" className="ps-back-link" onClick={() => actions.navigate('/order/status')}><ArrowLeft size={16} /> Track another order</button><header><div><span className="ps-kicker">Order {order.number}</span><h1>{ORDER_STATUS_LABELS[order.status]}</h1><p>Last updated {formatOrderEventTime(order.updatedAt)} UTC</p></div><span className="ps-status-pill"><PackageCheck size={16} /> {ORDER_STATUS_LABELS[order.status]}</span></header><div className="ps-order-status-grid"><section className="ps-order-timeline"><h2>Order progress</h2><ol>{ORDER_STEPS.map((step, index) => {
    const event = events.find((candidate) => candidate.status === step.status)
    return <li key={step.status} data-complete={Boolean(event)}><span>{event ? <Check size={15} /> : index + 1}</span><div><strong>{step.label}</strong><small>{event ? `${formatOrderEventTime(event.at)} UTC` : 'Waiting'}</small></div></li>
  })}</ol></section><aside className="ps-order-detail-card"><div><span>Synthetic order</span><strong>{order.number}</strong><button type="button" onClick={() => navigator.clipboard?.writeText(order.number)}><Copy size={15} /> Copy</button></div><dl><div><dt>Vendor</dt><dd>{order.vendor ?? 'Sample Vendor One'}</dd></div><div><dt>Destination</dt><dd>{order.destination ?? 'Sample region'}</dd></div><div><dt>Order total</dt><dd>{money(order.total)}</dd></div></dl><p>{order.itemSummary ?? 'Synthetic QA item'}</p><button type="button"><FileText size={16} /> View synthetic order details</button></aside></div></div>
}

function CustomerActionPage({ mode }: { mode: 'review' | 'refund' | 'delivery' | 'dispute' | 'research' }) {
  const content = {
    review: ['Share your order experience', 'Your review helps buyers understand vendor fulfillment and product presentation.'],
    refund: ['Choose a refund method', 'Select the available return route for this order.'],
    delivery: ['Confirm your delivery', 'Tell us whether the package arrived complete and in expected condition.'],
    dispute: ['Ticket center', 'Review the order history and add information to this private case.'],
    research: ['Research experience survey', 'Share structured, non-medical feedback about your research workflow.'],
  } as const
  const [title, description] = content[mode]
  return <div className="ps-action-page"><section><span className="ps-kicker">Private order action</span><h1>{title}</h1><p>{description}</p><div className="ps-action-order-summary"><PackageCheck size={20} /><div><strong>Order PS-1049</strong><span>BPC-157 10 mg · Sample Vendor Zero</span></div></div><form><label>Response<textarea rows={5} placeholder="Add the information requested for this flow" /></label><label className="ps-check-row"><input type="checkbox" /><span>I confirm this information is accurate.</span></label><button type="button">Continue <ArrowRight size={17} /></button></form></section></div>
}
