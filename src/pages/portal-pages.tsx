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
import { useState } from 'react'
import { AdminPricingSurface } from '../admin-pricing'
import type { OrderSummary, PageComponentProps } from '../contracts'
import { mockAdminPricingItems, mockAdminPricingVendors } from '../mock-data'
import { FrontendLink } from '../navigation'
import { PortalShell } from '../shell'

export function AuthPage({ actions, pathname }: PageComponentProps) {
  const [submitted, setSubmitted] = useState(pathname === '/login/check-email')
  const resetMode = pathname.includes('password')
  return (
    <div className="ps-auth-page">
      <section className="ps-auth-brand-panel">
        <FrontendLink href="/" navigate={actions.navigate} className="ps-brand ps-brand-inverse"><img src="/peptshop-logo.svg" alt="" /><span>peptshop</span></FrontendLink>
        <div><span className="ps-kicker">Partner access</span><h1>Operate the market without exposing the machinery.</h1><p>Seller and operator sessions are authenticated by the private application. This repository owns only the visible interface.</p></div>
        <dl><div><dt>Workspace</dt><dd>Seller and admin</dd></div><div><dt>Data source</dt><dd>Private adapters</dd></div></dl>
      </section>
      <section className="ps-auth-form-panel">
        {submitted ? (
          <div className="ps-auth-message"><span><Mail size={21} /></span><small>Secure sign-in</small><h2>Check your email</h2><p>The production auth service sends a private sign-in link when the address is authorized.</p><button type="button" onClick={() => setSubmitted(false)}>Use another email</button></div>
        ) : (
          <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); actions.submitLogin(String(data.get('email') ?? '')); setSubmitted(true) }}>
            <span className="ps-kicker">{resetMode ? 'Account recovery' : 'Authorized access'}</span>
            <h2>{resetMode ? 'Reset your password' : 'Sign in to your workspace'}</h2>
            <p>{resetMode ? 'Enter the authorized account email to continue.' : 'Seller, staff, and admin access uses the same secure entry point.'}</p>
            <label>Email address<div><Mail size={17} /><input name="email" type="email" placeholder="Email address" required /></div></label>
            {pathname === '/auth/update-password' ? <label>New password<div><KeyRound size={17} /><input name="password" type="password" placeholder="New password" required /></div></label> : null}
            <button type="submit">Continue securely <ArrowRight size={17} /></button>
            <small><LockKeyhole size={14} /> Authentication runs outside the public frontend package.</small>
          </form>
        )}
      </section>
    </div>
  )
}

export function SellerPage(props: PageComponentProps) {
  return (
    <PortalShell actions={props.actions} pathname={props.pathname} role="seller">
      <PortalTopbar eyebrow="Seller overview" title="Northstar Research" action={<button type="button" onClick={() => props.actions.sellerAction('availability')}><Activity size={16} /> Update availability</button>} />
      <div className="ps-portal-content">
        <div className="ps-portal-alert"><CircleAlert size={18} /><div><strong>4 orders need acceptance today</strong><span>The oldest response window closes in 2 hours and 14 minutes.</span></div><button type="button">Review now <ArrowRight size={15} /></button></div>
        <div className="ps-metric-grid">{props.models.sellerMetrics.map((metric, index) => <article key={metric.label}><div><span>{metric.label}</span>{index % 2 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}</div><strong>{metric.value}</strong><p>{metric.detail}</p></article>)}</div>
        <div className="ps-portal-two-column">
          <section className="ps-portal-table-section"><SectionHeader title="Orders requiring action" detail="Live marketplace queue" action="View all" /><OrderTable orders={props.models.orders} mode="seller" /></section>
          <aside className="ps-seller-capacity"><SectionHeader title="Weekly capacity" detail="Current fulfillment limit" /><div className="ps-capacity-gauge"><span style={{ '--progress': '72%' } as React.CSSProperties}><i>72%</i></span></div><dl><div><dt>Accepted this week</dt><dd>$21,640</dd></div><div><dt>Current limit</dt><dd>$30,000</dd></div><div><dt>Available</dt><dd>$8,360</dd></div></dl><button type="button" onClick={() => props.actions.sellerAction('capacity')}>Review capacity settings</button></aside>
        </div>
        <div className="ps-seller-operations"><section><SectionHeader title="Catalog health" detail="Public listing readiness" /><ul><li><span><CheckCircle2 size={17} /> Active listings</span><strong>42</strong></li><li><span><CircleAlert size={17} /> Missing current COA</span><strong>3</strong></li><li><span><Boxes size={17} /> Low availability</span><strong>7</strong></li></ul></section><section><SectionHeader title="Fulfillment signals" detail="Trailing 30 days" /><ul><li><span><Truck size={17} /> Median dispatch</span><strong>1.4 days</strong></li><li><span><PackageCheck size={17} /> On-time shipping</span><strong>98.6%</strong></li><li><span><MessageSquareText size={17} /> Open tickets</span><strong>2</strong></li></ul></section></div>
      </div>
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
          <article><div><span>Gross order value</span><ArrowUpRight size={16} /></div><strong>$142.8k</strong><p>Last 30 days</p></article>
          <article><div><span>Orders in review</span><CircleAlert size={16} /></div><strong>18</strong><p>6 need operator action</p></article>
          <article><div><span>Active vendors</span><Store size={16} /></div><strong>18</strong><p>2 onboarding</p></article>
          <article><div><span>Escrow pending</span><CircleDollarSign size={16} /></div><strong>$38.4k</strong><p>Across 54 orders</p></article>
        </div>
        <div className="ps-portal-two-column ps-admin-main-grid">
          <section className="ps-portal-table-section"><SectionHeader title="Operations queue" detail="Prioritized by risk and deadline" action="Open queue" /><OrderTable orders={props.models.orders} mode="admin" /></section>
          <aside className="ps-admin-watchlist"><SectionHeader title="System watchlist" detail="Requires review" /><ul><li><span className="ps-severity ps-severity-high">High</span><div><strong>2 payout holds</strong><small>Evidence required before release</small></div></li><li><span className="ps-severity ps-severity-medium">Med</span><div><strong>6 late shipments</strong><small>Vendor SLA windows exceeded</small></div></li><li><span className="ps-severity ps-severity-low">Low</span><div><strong>3 COA reviews</strong><small>Awaiting publication decision</small></div></li></ul></aside>
        </div>
        <section className="ps-admin-vendors"><SectionHeader title="Vendor control" detail="Public identity and operating status" action="View all vendors" /><div className="ps-admin-vendor-list">{props.models.vendors.slice(0, 3).map((vendor) => <article key={vendor.id}><div className="ps-vendor-monogram">{vendor.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><strong>{vendor.name}</strong><span>{vendor.location}</span></div><span className={`ps-trust-label ps-trust-${vendor.status}`}><ShieldCheck size={13} /> {vendor.status}</span><dl><div><dt>Orders</dt><dd>{vendor.orderCount.toLocaleString()}</dd></div><div><dt>Rating</dt><dd>{vendor.rating.toFixed(1)}</dd></div></dl><button type="button" onClick={() => props.actions.adminAction('open-vendor', vendor.id)}>Manage <ArrowRight size={15} /></button></article>)}</div></section>
      </div>

      {vendorModal ? (
        <div className="ps-modal-backdrop ps-portal-modal-backdrop" role="presentation">
          <section className="ps-modal ps-vendor-modal" role="dialog" aria-modal="true" aria-label="Add vendor">
            {created ? <div className="ps-modal-success"><Check size={23} /><h2>Vendor staged in preview</h2><p>The private admin adapter will create the real vendor and authorization records.</p><button type="button" onClick={() => setVendorModal(false)}>Close</button></div> : <><header><div><span className="ps-kicker">Admin action</span><h2>Add a vendor</h2><p>Create the marketplace identity first. Login access and private configuration remain separate.</p></div><button type="button" onClick={() => setVendorModal(false)} aria-label="Close vendor form">×</button></header><form onSubmit={(event) => { event.preventDefault(); props.actions.createVendor(event.currentTarget); setCreated(true) }}><div className="ps-form-grid"><label>Public vendor name<input name="displayName" placeholder="Vendor name" required /></label><label>Internal identifier<input name="slug" placeholder="vendor-slug" required /></label><label>Primary warehouse<select name="warehouse" defaultValue="US"><option value="US">United States</option><option value="GB">United Kingdom</option><option value="EU">European Union</option><option value="CN">China</option></select></label><label>Initial status<select name="status" defaultValue="onboarding"><option value="onboarding">Onboarding</option><option value="active">Active</option><option value="paused">Paused</option></select></label><label className="ps-field-wide">Authorized seller email<input name="email" type="email" placeholder="Email address" required /></label></div><label className="ps-check-row"><input type="checkbox" /><span>Send the vendor onboarding message after creation.</span></label><div className="ps-form-submit-row"><p><LockKeyhole size={15} /> Admin authorization is enforced by the private application.</p><button type="submit">Create vendor <ArrowRight size={16} /></button></div></form></>}
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
          return Promise.resolve({ ok: true, message: 'Saved in this frontend preview.' })
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
      <div className="ps-portal-content"><div className="ps-metric-grid"><article><div><span>Attributed sales</span><BadgeDollarSign size={16} /></div><strong>$12,840</strong><p>Last 30 days</p></article><article><div><span>Earned</span><CircleDollarSign size={16} /></div><strong>$642</strong><p>5% commission</p></article><article><div><span>Conversions</span><Users size={16} /></div><strong>46</strong><p>From 1,284 visits</p></article><article><div><span>Next payout</span><Clock3 size={16} /></div><strong>Jul 29</strong><p>$418 eligible</p></article></div><section className="ps-portal-table-section"><SectionHeader title="Active links" detail="Mock attribution summary" action="Export" /><div className="ps-link-table"><div><strong>Summer research guide</strong><code>/r/summer-guide</code><span>682 visits</span><span>29 orders</span><b>$406.00</b></div><div><strong>COA explainer</strong><code>/r/coa-guide</code><span>402 visits</span><span>12 orders</span><b>$168.00</b></div><div><strong>Vendor comparison</strong><code>/r/vendor-list</code><span>200 visits</span><span>5 orders</span><b>$68.00</b></div></div></section></div>
    </PortalShell>
  )
}

function PortalTopbar({ eyebrow, title, action }: { eyebrow: string; title: string; action: React.ReactNode }) {
  return <header className="ps-portal-topbar"><div><span>{eyebrow}</span><h1>{title}</h1></div><div className="ps-portal-topbar-actions"><button type="button" className="ps-portal-notification" aria-label="Notifications"><CircleAlert size={18} /><i /></button>{action}<button type="button" className="ps-avatar-button">NR <ChevronDown size={14} /></button></div></header>
}

function SectionHeader({ title, detail, action }: { title: string; detail: string; action?: string }) {
  return <header className="ps-portal-section-head"><div><h2>{title}</h2><p>{detail}</p></div>{action ? <button type="button">{action} <ArrowRight size={15} /></button> : null}</header>
}

function OrderTable({ orders, mode }: { orders: OrderSummary[]; mode: 'seller' | 'admin' | 'staff' }) {
  return <div className="ps-order-table" role="table"><div role="row"><span>Order</span><span>Customer</span><span>Status</span><span>Total</span><span>Updated</span><span /></div>{orders.map((order) => <div role="row" key={`${mode}-${order.id}`}><strong>{order.number}</strong><span>{order.customer}</span><span className={`ps-order-status ps-order-status-${order.status}`}>{order.status}</span><strong>${order.total.toFixed(2)}</strong><span>{order.updatedAt}</span><button type="button">Open <ArrowRight size={14} /></button></div>)}</div>
}
