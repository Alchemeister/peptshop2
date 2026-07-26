import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileCheck2,
  FileUp,
  FlaskConical,
  Info,
  ScanLine,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PageComponentProps } from '../contracts'
import { FrontendLink } from '../navigation'

export function EvidencePage({ actions, models, pathname, query }: PageComponentProps) {
  if (pathname === '/verify' || pathname.startsWith('/verify')) return <VerifyPage actions={actions} query={query} />
  if (pathname.includes('submit-coa')) return <SubmitCoaPage actions={actions} models={models} />

  const vendorFilter = query.get('vendor')
  const productFilter = query.get('product')
  const filteredCoas = models.coas.filter((coa) => {
    if (vendorFilter && coa.vendor.toLowerCase() !== vendorFilter.toLowerCase()) return false
    if (productFilter && coa.product.toLowerCase() !== productFilter.toLowerCase()) return false
    return true
  }).sort((a, b) => b.testedAt.localeCompare(a.testedAt))

  return (
    <div className="ps-evidence-page ps-section-shell">
      <header className="ps-page-masthead ps-page-masthead-split">
        <div><span className="ps-kicker">Public evidence library</span><h1>{vendorFilter && productFilter ? `${productFilter} — ${vendorFilter}` : vendorFilter ? `${vendorFilter} — COAs` : 'Certificates of analysis'}</h1></div>
        <p>{vendorFilter && productFilter ? `Certificates of analysis for ${productFilter} from ${vendorFilter}.` : vendorFilter ? `Certificates of analysis published by ${vendorFilter}.` : 'Browse independent test records by compound, vendor, laboratory, or batch identifier.'}</p>
      </header>
      <div className="ps-evidence-toolbar">
        <label><Search size={18} /><span className="ps-visually-hidden">Search COAs</span><input placeholder="Search product, vendor, lab, or batch" /></label>
        <FrontendLink href="/verify" navigate={actions.navigate}><ScanLine size={17} /> Verify batch</FrontendLink>
        <FrontendLink href="/coa/submit-coa" navigate={actions.navigate}><FileUp size={17} /> Submit COA</FrontendLink>
      </div>
      <div className="ps-coa-table" role="table" aria-label="Certificate records">
        <div className="ps-coa-table-head" role="row">
          <span>Compound</span><span>Vendor</span><span>Laboratory</span><span>Tested</span><span>Result</span><span />
        </div>
        {filteredCoas.length === 0 ? (
          <div className="ps-coa-empty-state"><FileCheck2 size={28} /><p>No certificates have been published{vendorFilter ? ` by ${vendorFilter}` : ''} yet.</p><small>COAs from verified labs will appear here once vendors upload batch evidence.</small></div>
        ) : null}
        {filteredCoas.map((coa) => (
          <div className="ps-coa-row" role="row" key={coa.id}>
            <div><span className="ps-mobile-label">Compound</span><strong>{coa.product}</strong><small>{coa.batch}</small></div>
            <div><span className="ps-mobile-label">Vendor</span><strong>{coa.vendor}</strong></div>
            <div><span className="ps-mobile-label">Laboratory</span><strong>{coa.lab}</strong></div>
            <div><span className="ps-mobile-label">Tested</span><strong>{coa.testedAt}</strong></div>
            <div><span className="ps-mobile-label">Result</span><span className="ps-purity-result"><CheckCircle2 size={15} /> {coa.purity}</span></div>
            <button type="button" aria-label={`Open ${coa.product} certificate`}><ArrowRight size={18} /></button>
          </div>
        ))}
      </div>
      <div className="ps-evidence-method">
        <FileCheck2 size={22} />
        <div><h2>What a published record means</h2><p>PeptShop shows the submitted laboratory record and its marketplace associations. A listed COA is evidence to review, not a medical or safety guarantee.</p></div>
        <FrontendLink href="/faq" navigate={actions.navigate}>Read the evidence policy <ArrowRight size={16} /></FrontendLink>
      </div>
    </div>
  )
}

function VerifyPage({ actions, query }: Pick<PageComponentProps, 'actions' | 'query'>) {
  const initialBatch = query.get('batch') ?? ''
  const vendorName = query.get('vendor') ?? ''
  const productName = query.get('product') ?? ''
  const [batch, setBatch] = useState(initialBatch)
  const [result, setResult] = useState(Boolean(initialBatch.trim()))
  return (
    <div className="ps-verify-page">
      <section className="ps-verify-panel">
        <div className="ps-verify-copy">
          <span className="ps-kicker">Batch lookup</span>
          <h1>Verify what arrived.</h1>
          <p>Enter the batch printed on the product label. The private app will match it to active marketplace evidence.</p>
          <form onSubmit={(event) => { event.preventDefault(); actions.verifyBatch(batch); setResult(Boolean(batch.trim())) }}>
            <label htmlFor="batch-lookup">Batch number</label>
            <div><ScanLine size={19} /><input id="batch-lookup" value={batch} onChange={(event) => setBatch(event.currentTarget.value)} placeholder="Example: PS-0426-A" /><button type="submit">Verify</button></div>
          </form>
          <p className="ps-form-note"><Info size={15} /> Match the letters, numbers, and separators exactly.</p>
        </div>
        <div className="ps-verify-visual" aria-hidden="true"><span /><ScanLine size={88} strokeWidth={1} /><small>Batch linked evidence</small></div>
      </section>
      {result ? (
        <section className="ps-verify-result" aria-live="polite">
          <div className="ps-verify-result-icon"><ShieldCheck size={24} /></div>
          <div><span>Match found</span><h2>{productName ? `${productName}` : 'BPC-157'} · {batch || 'PS-0426-A'}</h2><p>{vendorName || 'Northstar Research'} · Independent Analytical Lab · Tested Jun 18, 2026</p></div>
          <div><span>Reported purity</span><strong>99.1%</strong></div>
          <button type="button"><Download size={17} /> View record</button>
        </section>
      ) : null}
    </div>
  )
}

function SubmitCoaPage({ actions, models }: Pick<PageComponentProps, 'actions' | 'models'>) {
  const [submitted, setSubmitted] = useState(false)
  const [compoundId, setCompoundId] = useState('')
  const [dosage, setDosage] = useState('')
  const selectedProduct = models.products.find((product) => product.id === compoundId)
  const doses = selectedProduct ? selectedProduct.formats : []
  useEffect(() => {
    if (submitted) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [submitted])
  if (submitted) {
    return <div className="ps-flow-success"><CheckCircle2 size={28} /><span className="ps-kicker">Submission received</span><h1>COA ready for review</h1><p>Your submission has been queued for review and will be published in the evidence library once verified.</p><button type="button" onClick={() => setSubmitted(false)}>Submit another</button></div>
  }
  return (
    <div className="ps-form-page ps-section-shell">
      <header><span className="ps-kicker">Community evidence</span><h1>Submit a COA</h1><p>Share a laboratory report for review and possible publication in the evidence library.</p></header>
      <form className="ps-long-form" onSubmit={(event) => { event.preventDefault(); actions.submitCoa(event.currentTarget); setSubmitted(true) }}>
        <section><span className="ps-form-step">01</span><div><h2>Pick the product you ordered</h2><p>Select the exact compound, vendor, and dosage from your order so we can match the submission to a listing.</p></div></section>
        <div className="ps-form-grid">
          <label>Compound
            <select name="compound" value={compoundId} onChange={(event) => { setCompoundId(event.currentTarget.value); setDosage('') }} required>
              <option value="">Select a compound</option>
              {models.products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
          </label>
          <label>Vendor
            <select name="vendor" required>
              <option value="">Select a vendor</option>
              {models.vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
            </select>
          </label>
          <label>Dosage
            <select name="dosage" value={dosage} onChange={(event) => setDosage(event.currentTarget.value)} required disabled={!selectedProduct}>
              <option value="">{selectedProduct ? 'Select a dosage' : 'Pick a compound first'}</option>
              {doses.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </div>

        <section><span className="ps-form-step">02</span><div><h2>Verify you bought this</h2><p>Confirm the order so we can tie the COA back to a real purchase.</p></div></section>
        <div className="ps-form-grid">
          <label>Order ID<input name="orderId" type="text" placeholder="e.g. 12345" required /></label>
          <label>Email on the order<input name="email" type="email" placeholder="you@example.com" required /></label>
          <label>Order code<input name="orderCode" type="text" placeholder="Paste the code from your confirmation email" required /></label>
        </div>
        <p className="ps-check-row"><Info size={16} /> <span>Orders become eligible 21 days after placement once shipment is recorded, and submissions close 2 months after the order ships.</span></p>

        <section><span className="ps-form-step">03</span><div><h2>Upload the COA</h2><p>Attach the laboratory report and tell us where you shared it publicly.</p></div></section>
        <div className="ps-form-grid">
          <label>Batch number<input name="batch" type="text" placeholder="Required only when this product had batch numbers enabled when you ordered" /></label>
          <label className="ps-file-drop"><FileUp size={28} /><strong>Choose the COA file</strong><span>PDF, PNG, or JPG up to 5MB</span><input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg" /></label>
          <label>Source link<input name="sourceLink" type="url" placeholder="https://example.com/your-post" required /></label>
        </div>
        <p className="ps-form-note"><ShieldCheck size={16} /> Paste a link to where you shared the COA publicly — a forum thread, social post, or public archive.</p>

        <div className="ps-form-submit-row"><p><ShieldCheck size={16} /> Submissions are reviewed before publication.</p><button type="submit">Send for review <ArrowRight size={17} /></button></div>
      </form>
    </div>
  )
}
