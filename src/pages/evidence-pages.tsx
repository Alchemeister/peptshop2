import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileCheck2,
  Info,
  ScanLine,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PageComponentProps } from '../contracts'
import { FrontendLink } from '../navigation'

export function EvidencePage({ actions, models, pathname, query }: PageComponentProps) {
  const [coaSearch, setCoaSearch] = useState('')
  if (pathname === '/verify' || pathname.startsWith('/verify')) return <VerifyPage actions={actions} query={query} />

  const vendorFilter = query.get('vendor')
  const productFilter = query.get('product')
  const normalizedSearch = coaSearch.trim().toLowerCase()
  const filteredCoas = models.coas.filter((coa) => {
    if (vendorFilter && coa.vendor.toLowerCase() !== vendorFilter.toLowerCase()) return false
    if (productFilter && coa.product.toLowerCase() !== productFilter.toLowerCase()) return false
    if (normalizedSearch) {
      const haystack = `${coa.product} ${coa.vendor} ${coa.lab} ${coa.batch}`.toLowerCase()
      if (!haystack.includes(normalizedSearch)) return false
    }
    return true
  }).sort((a, b) => b.testedAt.localeCompare(a.testedAt))

  return (
    <div className="ps-evidence-page ps-section-shell">
      <header className="ps-page-masthead ps-page-masthead-split">
        <div><span className="ps-kicker">Public evidence library</span><h1>{vendorFilter && productFilter ? `${productFilter} — ${vendorFilter}` : vendorFilter ? `${vendorFilter} — COAs` : 'Certificates of analysis'}</h1></div>
        <p>{vendorFilter && productFilter ? `Certificates of analysis for ${productFilter} from ${vendorFilter}.` : vendorFilter ? `Certificates of analysis published by ${vendorFilter}.` : 'Browse independent test records by compound, vendor, laboratory, or batch identifier.'}</p>
      </header>
      <div className="ps-evidence-toolbar">
        <label><Search size={18} /><span className="ps-visually-hidden">Search COAs</span><input value={coaSearch} onChange={(event) => setCoaSearch(event.currentTarget.value)} placeholder="Search product, vendor, lab, or batch" /></label>
        <FrontendLink href="/verify" navigate={actions.navigate}><ScanLine size={17} /> Verify batch</FrontendLink>
      </div>
      <div className="ps-coa-table" role="table" aria-label="Certificate records">
        <div className="ps-coa-table-head" role="row">
          <span>Compound</span><span>Vendor</span><span>Laboratory</span><span>Tested</span><span>Result</span><span />
        </div>
        {filteredCoas.length === 0 ? (
          <div className="ps-coa-empty-state"><FileCheck2 size={28} /><p>No certificates found. Try adjusting your search or check back later.</p><small>COAs from verified labs will appear here once vendors upload batch evidence.</small></div>
        ) : null}
        {filteredCoas.map((coa) => (
          <div className="ps-coa-row" role="row" key={coa.id}>
            <div><span className="ps-mobile-label">Compound</span><strong>{coa.product}</strong><small>{coa.batch}</small></div>
            <div><span className="ps-mobile-label">Vendor</span><strong>{coa.vendor}</strong></div>
            <div><span className="ps-mobile-label">Laboratory</span><strong>{coa.lab}</strong></div>
            <div><span className="ps-mobile-label">Tested</span><strong>{coa.testedAt}</strong></div>
            <div><span className="ps-mobile-label">Result</span><span className="ps-purity-result"><CheckCircle2 size={15} /> {coa.purity}</span></div>
            {coa.href ? (
              <a
                href={coa.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${coa.product} certificate`}
              >
                <ArrowRight size={18} />
              </a>
            ) : (
              <span className="ps-coa-link-unavailable" aria-label="Certificate link unavailable">
                <ArrowRight size={18} />
              </span>
            )}
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
          <div><span>Match found</span><h2>{productName ? `${productName}` : 'BPC-157'} · {batch || 'PS-0426-A'}</h2><p>{vendorName || 'Sample Vendor Zero'} · Independent Analytical Lab · Tested Jun 18, 2026</p></div>
          <div><span>Reported purity</span><strong>99.1%</strong></div>
          <button type="button"><Download size={17} /> View record</button>
        </section>
      ) : null}
    </div>
  )
}
