import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  KeyRound,
  LockKeyhole,
  Mail,
  MessageSquareText,
  PackageCheck,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Store,
  Truck,
  UserRoundPlus,
  Users,
} from 'lucide-react'
import { useState, useEffect, Fragment } from 'react'
import { AdminPricingSurface } from '../admin-pricing'
import type { OrderSummary, PageComponentProps } from '../contracts'
import { mockAdminPricingItems, mockAdminPricingVendors } from '../mock-data'
import { FrontendLink } from '../navigation'
import { mockSellerEscrowGateModel } from '../preview-fixtures'
import { SellerEscrowGate } from '../seller-escrow-gate'
import { PortalShell } from '../shell'

export function AuthPage({ actions, pathname }: PageComponentProps) {
  const [submitted, setSubmitted] = useState(pathname === '/login/check-email')
  const resetMode = pathname.includes('password')
  return (
    <div className="ps-auth-page">
      <section className="ps-auth-brand-panel">
        <FrontendLink href="/" navigate={actions.navigate} className="ps-brand ps-brand-inverse"><img src="/peptshop-logo.svg" alt="" /><span>peptshop</span></FrontendLink>
        <div><span className="ps-kicker">Partner access</span><h1>Operate the market without exposing the machinery.</h1><p>Seller and operator sessions are authenticated securely.</p></div>
        <dl><div><dt>Workspace</dt><dd>Seller and admin</dd></div><div><dt>Data source</dt><dd>Secure backend</dd></div></dl>
      </section>
      <section className="ps-auth-form-panel">
        {submitted ? (
          <div className="ps-auth-message"><span><Mail size={21} /></span><small>Secure sign-in</small><h2>Check your email</h2><p>If this email is authorized, a sign-in link has been sent.</p><button type="button" onClick={() => setSubmitted(false)}>Use another email</button></div>
        ) : (
          <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); actions.submitLogin(String(data.get('email') ?? '')); setSubmitted(true) }}>
            <span className="ps-kicker">{resetMode ? 'Account recovery' : 'Authorized access'}</span>
            <h2>{resetMode ? 'Reset your password' : 'Sign in to your workspace'}</h2>
            <p>{resetMode ? 'Enter the authorized account email to continue.' : 'Seller, staff, and admin access uses the same secure entry point.'}</p>
            <label>Email address<div><Mail size={17} /><input name="email" type="email" placeholder="Email address" required /></div></label>
            {pathname === '/auth/update-password' ? <label>New password<div><KeyRound size={17} /><input name="password" type="password" placeholder="New password" required /></div></label> : null}
            <button type="submit">Continue securely <ArrowRight size={17} /></button>
            <small><LockKeyhole size={14} /> Authentication runs securely outside the public storefront.</small>
          </form>
        )}
      </section>
    </div>
  )
}

export function SellerPage(props: PageComponentProps) {
  const [hash, setHash] = useState(() => window.location.hash || '#dashboard')

  useEffect(() => {
    const sync = () => setHash(window.location.hash || '#dashboard')
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  const section = hash.replace('#', '')

  if (props.pathname === '/seller/escrow-gate') {
    return (
      <SellerWorkspaceFrame
        actions={props.actions}
        pathname={props.pathname}
        title="Sample Vendor Zero"
      >
        <SellerEscrowGate
          model={mockSellerEscrowGateModel}
          onChooseTier={(tier) => {
            props.actions.sellerAction('escrow-tier', tier)
            return Promise.resolve({ success: true })
          }}
        />
      </SellerWorkspaceFrame>
    )
  }

  let content: React.ReactNode

  if (section === 'orders' || section === 'dashboard') {
    content = (
      <>
        {section === 'dashboard' && (
          <>
            <div className="ps-portal-alert"><CircleAlert size={18} /><div><strong>Sample orders need review</strong><span>All queue values in this workspace are illustrative.</span></div><button type="button">Review now <ArrowRight size={15} /></button></div>
            <div className="ps-metric-grid">{props.models.sellerMetrics.map((metric, index) => <article key={metric.label}><div><span>{metric.label}</span>{index % 2 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}</div><strong>{metric.value}</strong><p>{metric.detail}</p></article>)}</div>
          </>
        )}
        <div className="ps-portal-two-column">
          <section className="ps-portal-table-section"><SectionHeader title="Orders requiring action" detail="Live marketplace queue" action="View all" /><OrderTable orders={props.models.orders} mode="seller" /></section>
          {section === 'dashboard' && (
            <aside className="ps-seller-capacity"><SectionHeader title="Weekly capacity" detail="Illustrative presentation state" /><div className="ps-capacity-gauge"><span style={{ '--progress': '60%' } as React.CSSProperties}><i>Sample</i></span></div><dl><div><dt>Accepted this week</dt><dd>Sample</dd></div><div><dt>Current limit</dt><dd>Sample</dd></div><div><dt>Available</dt><dd>Sample</dd></div></dl><button type="button" onClick={() => props.actions.sellerAction('capacity')}>Review capacity settings</button></aside>
          )}
        </div>
        {section === 'dashboard' && (
          <div className="ps-seller-operations"><section><SectionHeader title="Catalog health" detail="Public listing readiness" /><ul><li><span><CheckCircle2 size={17} /> Active listings</span><strong>42</strong></li><li><span><CircleAlert size={17} /> Missing current COA</span><strong>3</strong></li><li><span><Boxes size={17} /> Low availability</span><strong>7</strong></li></ul></section><section><SectionHeader title="Fulfillment signals" detail="Trailing 30 days" /><ul><li><span><Truck size={17} /> Median dispatch</span><strong>1.4 days</strong></li><li><span><PackageCheck size={17} /> On-time shipping</span><strong>98.6%</strong></li><li><span><MessageSquareText size={17} /> Open tickets</span><strong>2</strong></li></ul></section></div>
        )}
      </>
    )
  } else if (section === 'catalog') {
    content = (
      <div className="ps-portal-two-column">
        <section className="ps-portal-table-section">
          <SectionHeader title="Product catalog" detail="Manage your live listings" action="Add product" />
          <table className="ps-portal-table">
            <thead><tr><th>Product</th><th>Format</th><th>Price</th><th>Status</th></tr></thead>
            <tbody>
              {props.models.products.slice(0, 8).map((p) => (
                <tr key={p.id}><td><strong>{p.name}</strong></td><td>{p.formats?.join(', ') || '—'}</td><td>{p.startingPrice != null ? `$${p.startingPrice.toFixed(2)}/mg` : '—'}</td><td><span className="ps-status-dot" /> Active</td></tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside>
          <SectionHeader title="Add a product" detail="Create a new listing" />
          <div className="ps-portal-card">
            <label className="ps-field-wide">Product name<input placeholder="e.g., BPC-157" /></label>
            <label className="ps-field-wide">Format<input placeholder="e.g., 5 mg" /></label>
            <label className="ps-field-wide">Price per mg<input type="number" placeholder="2.50" /></label>
            <button type="button" className="ps-primary-action" onClick={() => props.actions.sellerAction('add-product')}>Add product</button>
          </div>
        </aside>
      </div>
    )
  } else if (section === 'batches') {
    content = (
      <section className="ps-portal-table-section">
        <SectionHeader title="COA batches" detail="Certificate of Analysis uploads" action="Upload COA" />
        <table className="ps-portal-table">
          <thead><tr><th>Product</th><th>Batch</th><th>Lab</th><th>Uploaded</th><th>Status</th></tr></thead>
          <tbody>
            {props.models.coas.slice(0, 10).map((c) => (
              <tr key={c.id}><td>{c.product}</td><td>{c.batch}</td><td>{c.lab}</td><td>{c.testedAt}</td><td><span className="ps-status-dot" /> Verified</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    )
  } else if (section === 'shipping') {
    content = (
      <div className="ps-portal-two-column">
        <section>
          <SectionHeader title="Shipping options" detail="Configure your shipping tiers" />
          <div className="ps-portal-card">
            <div className="ps-shipping-tier">
              <strong>Tier 1: $0 – $400</strong>
              <p>$50 flat-rate shipping · 3–5 business days · Worldwide</p>
            </div>
            <div className="ps-shipping-tier">
              <strong>Tier 2: $400+</strong>
              <p>FREE priority shipping · 3–5 business days · Worldwide</p>
            </div>
            <button type="button" className="ps-primary-action" onClick={() => props.actions.sellerAction('shipping')}>Edit tiers</button>
          </div>
        </section>
        <aside>
          <SectionHeader title="Shipping metrics" detail="Trailing 30 days" />
          <div className="ps-portal-card">
            <dl>
              <div><dt>Median dispatch time</dt><dd>1.4 days</dd></div>
              <div><dt>On-time shipping rate</dt><dd>98.6%</dd></div>
              <div><dt>Average shipping cost</dt><dd>$50.00</dd></div>
              <div><dt>Free shipping orders</dt><dd>62%</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    )
  } else if (section === 'inbox') {
    content = (
      <section className="ps-portal-table-section">
        <SectionHeader title="Messages" detail="Customer and admin communications" />
        <div className="ps-portal-card">
          <p style={{ color: 'var(--ps-text-muted)', textAlign: 'center', padding: '2rem' }}>No new messages.</p>
        </div>
      </section>
    )
  } else if (section === 'availability') {
    content = (
      <div className="ps-portal-two-column">
        <section>
          <SectionHeader title="Settings" detail="Vendor configuration" />
          <div className="ps-portal-card">
            <label className="ps-field-wide">Vendor name<input defaultValue="Sample Vendor Zero" /></label>
            <label className="ps-field-wide">Email<input defaultValue="vendor@peptshop.io" /></label>
            <label className="ps-field-wide">Wallet address<input defaultValue="0x0000000000000000000000000000000000000000" readOnly /></label>
            <button type="button" className="ps-primary-action" onClick={() => props.actions.sellerAction('settings')}>Save settings</button>
          </div>
        </section>
        <aside>
          <SectionHeader title="Availability" detail="Weekly capacity settings" />
          <div className="ps-portal-card">
            <dl>
              <div><dt>Accepted this week</dt><dd>Sample</dd></div>
              <div><dt>Current limit</dt><dd>Sample</dd></div>
              <div><dt>Available slots</dt><dd>Sample</dd></div>
            </dl>
            <button type="button" onClick={() => props.actions.sellerAction('capacity')}>Update capacity</button>
          </div>
        </aside>
      </div>
    )
  } else {
    content = (
      <>
        <div className="ps-portal-alert"><CircleAlert size={18} /><div><strong>Sample orders need review</strong><span>All queue values in this workspace are illustrative.</span></div><button type="button">Review now <ArrowRight size={15} /></button></div>
        <div className="ps-metric-grid">{props.models.sellerMetrics.map((metric, index) => <article key={metric.label}><div><span>{metric.label}</span>{index % 2 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}</div><strong>{metric.value}</strong><p>{metric.detail}</p></article>)}</div>
        <div className="ps-portal-two-column">
          <section className="ps-portal-table-section"><SectionHeader title="Orders requiring action" detail="Live marketplace queue" action="View all" /><OrderTable orders={props.models.orders} mode="seller" /></section>
          <aside className="ps-seller-capacity"><SectionHeader title="Weekly capacity" detail="Illustrative presentation state" /><div className="ps-capacity-gauge"><span style={{ '--progress': '60%' } as React.CSSProperties}><i>Sample</i></span></div><dl><div><dt>Accepted this week</dt><dd>Sample</dd></div><div><dt>Current limit</dt><dd>Sample</dd></div><div><dt>Available</dt><dd>Sample</dd></div></dl><button type="button" onClick={() => props.actions.sellerAction('capacity')}>Review capacity settings</button></aside>
        </div>
        <div className="ps-seller-operations"><section><SectionHeader title="Catalog health" detail="Public listing readiness" /><ul><li><span><CheckCircle2 size={17} /> Active listings</span><strong>42</strong></li><li><span><CircleAlert size={17} /> Missing current COA</span><strong>3</strong></li><li><span><Boxes size={17} /> Low availability</span><strong>7</strong></li></ul></section><section><SectionHeader title="Fulfillment signals" detail="Trailing 30 days" /><ul><li><span><Truck size={17} /> Median dispatch</span><strong>1.4 days</strong></li><li><span><PackageCheck size={17} /> On-time shipping</span><strong>98.6%</strong></li><li><span><MessageSquareText size={17} /> Open tickets</span><strong>2</strong></li></ul></section></div>
      </>
    )
  }

  return (
    <SellerWorkspaceFrame
      actions={props.actions}
      pathname={props.pathname}
      title="Sample Vendor Zero"
    >
      {content}
    </SellerWorkspaceFrame>
  )
}

export function SellerWorkspaceFrame({
  actions,
  children,
  environmentLabel,
  onSignOut,
  pathname,
  title,
}: {
  actions: PageComponentProps['actions']
  children: React.ReactNode
  environmentLabel?: string
  onSignOut?: () => void
  pathname: string
  title: string
}) {
  const avatarLabel =
    title
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PS'

  return (
    <PortalShell
      actions={actions}
      environmentLabel={environmentLabel}
      onSignOut={onSignOut}
      pathname={pathname}
      role="seller"
    >
      <PortalTopbar
        eyebrow="Seller overview"
        title={title}
        avatarLabel={avatarLabel}
        action={
          <button type="button" onClick={() => actions.sellerAction('availability')}>
            <Activity size={16} /> Update availability
          </button>
        }
      />
      <div className="ps-portal-content ps-seller-workspace-content">{children}</div>
    </PortalShell>
  )
}

export function AdminPage(props: PageComponentProps) {
  if (props.pathname === '/admin/pricing') {
    return <AdminPricingPreviewPage {...props} />
  }

  return <AdminOverviewPage {...props} />
}

function AdminOverviewPage(props: PageComponentProps) {
  const [vendorModal, setVendorModal] = useState(false)
  const [created, setCreated] = useState(false)
  return (
    <PortalShell actions={props.actions} pathname={props.pathname} role="admin">
      <PortalTopbar eyebrow="Marketplace operations" title="Admin console" action={<button type="button" onClick={() => { setCreated(false); setVendorModal(true) }}><UserRoundPlus size={16} /> Add vendor</button>} />
      <div className="ps-portal-content">
        <div className="ps-admin-command-row">
          <label><Search size={17} /><input placeholder="Search orders, vendors, batches" /></label>
          <button type="button" onClick={() => props.actions.navigate('/admin/pricing')}><Settings2 size={16} /> Manage pricing</button>
        </div>
        <div className="ps-metric-grid ps-admin-metrics">
          <article><div><span>Gross order value</span><ArrowUpRight size={16} /></div><strong>Sample</strong><p>Illustrative only</p></article>
          <article><div><span>Orders in review</span><CircleAlert size={16} /></div><strong>Sample</strong><p>Illustrative only</p></article>
          <article><div><span>Active vendors</span><Store size={16} /></div><strong>Sample</strong><p>Illustrative only</p></article>
          <article><div><span>Held orders</span><CircleDollarSign size={16} /></div><strong>Sample</strong><p>Illustrative only</p></article>
        </div>
        <div className="ps-portal-two-column ps-admin-main-grid">
          <section className="ps-portal-table-section"><SectionHeader title="Operations queue" detail="Prioritized by risk and deadline" action="Open queue" /><OrderTable orders={props.models.orders} mode="admin" /></section>
          <aside className="ps-admin-watchlist"><SectionHeader title="System watchlist" detail="Synthetic examples" /><ul><li><span className="ps-severity ps-severity-high">High</span><div><strong>Sample review</strong><small>Illustrative presentation state</small></div></li><li><span className="ps-severity ps-severity-medium">Med</span><div><strong>Sample review</strong><small>Illustrative presentation state</small></div></li><li><span className="ps-severity ps-severity-low">Low</span><div><strong>Sample review</strong><small>Illustrative presentation state</small></div></li></ul></aside>
        </div>
        <section className="ps-admin-vendors"><SectionHeader title="Vendor control" detail="Public identity and operating status" action="View all vendors" /><div className="ps-admin-vendor-list">{props.models.vendors.slice(0, 3).map((vendor) => <article key={vendor.id}><div className="ps-vendor-monogram">{vendor.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><strong>{vendor.name}</strong><span>{vendor.location}</span></div><span className={`ps-trust-label ps-trust-${vendor.status}`}><ShieldCheck size={13} /> {vendor.status}</span><dl><div><dt>Orders</dt><dd>{vendor.orderCount.toLocaleString()}</dd></div><div><dt>Rating</dt><dd>{vendor.rating.toFixed(1)}</dd></div></dl><button type="button" onClick={() => props.actions.adminAction('open-vendor', vendor.id)}>Manage <ArrowRight size={15} /></button></article>)}</div></section>
      </div>

      {vendorModal ? (
        <div className="ps-modal-backdrop ps-portal-modal-backdrop" role="presentation">
          <section className="ps-modal ps-vendor-modal" role="dialog" aria-modal="true" aria-label="Add vendor">
            {created ? <div className="ps-modal-success"><Check size={23} /><h2>Vendor created</h2><p>The vendor has been added and will appear in the marketplace once onboarding is complete.</p><button type="button" onClick={() => setVendorModal(false)}>Close</button></div> : <><header><div><span className="ps-kicker">Admin action</span><h2>Add a vendor</h2><p>Create the marketplace identity first. Login access and private configuration remain separate.</p></div><button type="button" onClick={() => setVendorModal(false)} aria-label="Close vendor form">×</button></header><form onSubmit={(event) => { event.preventDefault(); props.actions.createVendor(event.currentTarget); setCreated(true) }}><div className="ps-form-grid"><label>Public vendor name<input name="displayName" placeholder="Vendor name" required /></label><label>Internal identifier<input name="slug" placeholder="vendor-slug" required /></label><label>Primary warehouse<select name="warehouse" defaultValue="US"><option value="US">United States</option><option value="GB">United Kingdom</option><option value="EU">European Union</option><option value="CN">China</option></select></label><label>Initial status<select name="status" defaultValue="onboarding"><option value="onboarding">Onboarding</option><option value="active">Active</option><option value="paused">Paused</option></select></label><label className="ps-field-wide">Authorized seller email<input name="email" type="email" placeholder="Email address" required /></label></div><label className="ps-check-row"><input type="checkbox" /><span>Send the vendor onboarding message after creation.</span></label><div className="ps-form-submit-row"><p><LockKeyhole size={15} /> Admin authorization required.</p><button type="submit">Create vendor <ArrowRight size={16} /></button></div></form></>}
          </section>
        </div>
      ) : null}
    </PortalShell>
  )
}

function AdminPricingPreviewPage(props: PageComponentProps) {
  const requestedVendorId = props.query.get('vendor')
  const selectedVendorId = mockAdminPricingVendors.some(
    (vendor) => vendor.id === requestedVendorId,
  )
    ? requestedVendorId ?? mockAdminPricingVendors[0]?.id
    : mockAdminPricingVendors[0]?.id
  const items = mockAdminPricingItems
    .filter((item) => item.vendorId === selectedVendorId)
    .map(({ vendorId: _vendorId, ...item }) => item)

  return (
    <PortalShell actions={props.actions} pathname={props.pathname} role="admin">
      <AdminPricingSurface
        vendors={mockAdminPricingVendors}
        selectedVendorId={selectedVendorId}
        items={items}
        onBack={() => props.actions.navigate('/admin')}
        onAddVendor={() => props.actions.navigate('/admin')}
        onSelectVendor={(vendorId) =>
          props.actions.navigate(`/admin/pricing?vendor=${encodeURIComponent(vendorId)}`)
        }
        onSave={(input) => {
          props.actions.adminAction('save-pricing', input.itemId)
          return Promise.resolve({ ok: true, message: 'Pricing updated.' })
        }}
      />
    </PortalShell>
  )
}

export function StaffPage(props: PageComponentProps) {
  return (
    <PortalShell actions={props.actions} pathname={props.pathname} role="staff">
      <PortalTopbar eyebrow="Support operations" title="Staff workspace" action={<button type="button"><Search size={16} /> Order lookup</button>} />
      <div className="ps-portal-content">
        <div className="ps-metric-grid"><article><div><span>Open tickets</span><MessageSquareText size={16} /></div><strong>14</strong><p>5 assigned to you</p></article><article><div><span>Orders to review</span><ClipboardCheck size={16} /></div><strong>9</strong><p>Oldest is 42 minutes</p></article><article><div><span>Batch conflicts</span><FileCheck2 size={16} /></div><strong>3</strong><p>Evidence mismatch queue</p></article><article><div><span>Vendor alerts</span><CircleAlert size={16} /></div><strong>6</strong><p>Across 4 vendors</p></article></div>
        <section className="ps-portal-table-section"><SectionHeader title="Assigned work" detail="Customer and vendor operations" action="Open full queue" /><OrderTable orders={props.models.orders} mode="staff" /></section>
      </div>
    </PortalShell>
  )
}

export function AffiliatePage(props: PageComponentProps) {
  return (
    <PortalShell actions={props.actions} pathname={props.pathname} role="affiliate">
      <PortalTopbar eyebrow="Partner performance" title="Affiliate workspace" action={<button type="button"><Plus size={16} /> New link</button>} />
      <div className="ps-portal-content"><div className="ps-metric-grid"><article><div><span>Attributed sales</span><BadgeDollarSign size={16} /></div><strong>Sample</strong><p>Illustrative only</p></article><article><div><span>Earned</span><CircleDollarSign size={16} /></div><strong>Sample</strong><p>No private terms represented</p></article><article><div><span>Conversions</span><Users size={16} /></div><strong>Sample</strong><p>Illustrative only</p></article><article><div><span>Status</span><Clock3 size={16} /></div><strong>Preview</strong><p>No live data</p></article></div><section className="ps-portal-table-section"><SectionHeader title="Active links" detail="Synthetic attribution layout" action="Export" /><div className="ps-link-table"><div><strong>Sample guide one</strong><code>/r/sample-one</code><span>Sample visits</span><span>Sample orders</span><b>Sample</b></div><div><strong>Sample guide two</strong><code>/r/sample-two</code><span>Sample visits</span><span>Sample orders</span><b>Sample</b></div><div><strong>Sample comparison</strong><code>/r/sample-three</code><span>Sample visits</span><span>Sample orders</span><b>Sample</b></div></div></section></div>
    </PortalShell>
  )
}

function PortalTopbar({ eyebrow, title, action, avatarLabel = 'PS' }: { eyebrow: string; title: string; action: React.ReactNode; avatarLabel?: string }) {
  return <header className="ps-portal-topbar"><div><span>{eyebrow}</span><h1>{title}</h1></div><div className="ps-portal-topbar-actions"><button type="button" className="ps-portal-notification" aria-label="Notifications"><CircleAlert size={18} /><i /></button>{action}<button type="button" className="ps-avatar-button">{avatarLabel} <ChevronDown size={14} /></button></div></header>
}

function SectionHeader({ title, detail, action }: { title: string; detail: string; action?: string }) {
  return <header className="ps-portal-section-head"><div><h2>{title}</h2><p>{detail}</p></div>{action ? <button type="button">{action} <ArrowRight size={15} /></button> : null}</header>
}

function OrderTable({ orders, mode }: { orders: OrderSummary[]; mode: 'seller' | 'admin' | 'staff' }) {
  const [openId, setOpenId] = useState<string | null>(null)
  return <div className="ps-order-table" role="table"><div role="row"><span>Order</span><span>Customer</span><span>Status</span><span>Total</span><span>Updated</span><span /></div>{orders.map((order) => {
    const isOpen = openId === order.id
    return <Fragment key={`${mode}-${order.id}`}>
      <div role="row">
        <strong>{order.number}</strong>
        <span>{order.customer}</span>
        <span className={`ps-order-status ps-order-status-${order.status}`}>{order.status}</span>
        <strong>${order.total.toFixed(2)}</strong>
        <span>{order.updatedAt}</span>
        <button type="button" onClick={() => setOpenId(isOpen ? null : order.id)}>{isOpen ? 'Close' : 'Open'} {isOpen ? <ChevronDown size={14} /> : <ArrowRight size={14} />}</button>
      </div>
      {isOpen && <div role="row" className="ps-order-detail">
        <div className="ps-order-detail-grid">
          <div>
            <h4>Items</h4>
            <p>{order.itemSummary || 'No item details'}</p>
            {order.vendor && <p className="ps-order-detail-vendor">Vendor: {order.vendor}</p>}
          </div>
          <div>
            <h4>Ship to</h4>
            <p>{order.customer}</p>
            <p>{order.destination || '—'}</p>
          </div>
          <div>
            <h4>Timeline</h4>
            {(order.events || []).map((ev, i) => <p key={i}><span className={`ps-order-status ps-order-status-${ev.status}`}>{ev.status}</span> — {ev.at}</p>)}
          </div>
        </div>
      </div>}
    </Fragment>
  })}</div>
}
