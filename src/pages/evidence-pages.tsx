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
import { useState } from 'react'
import type { PageComponentProps } from '../contracts'
import { FrontendLink } from '../navigation'

export function EvidencePage({ actions, models, pathname }: PageComponentProps) {
  if (pathname === '/verify') return <VerifyPage actions={actions} />
  if (pathname.includes('submit-coa')) return <SubmitCoaPage actions={actions} />

  return (
    <div className="ps-evidence-page ps-section-shell">
      <header className="ps-page-masthead ps-page-masthead-split">
        <div><span className="ps-kicker">Public evidence library</span><h1>Certificates of analysis</h1></div>
        <p>Browse independent test records by compound, vendor, laboratory, or batch identifier.</p>
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
        {models.coas.map((coa) => (
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

function VerifyPage({ actions }: Pick<PageComponentProps, 'actions'>) {
  const [batch, setBatch] = useState('')
  const [result, setResult] = useState(false)
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
          <div><span>Match found</span><h2>BPC-157 10 mg</h2><p>Northstar Research · Independent Analytical Lab · Tested Jun 18, 2026</p></div>
          <div><span>Reported purity</span><strong>99.1%</strong></div>
          <button type="button"><Download size={17} /> View record</button>
        </section>
      ) : null}
    </div>
  )
}

function SubmitCoaPage({ actions }: Pick<PageComponentProps, 'actions'>) {
  const [submitted, setSubmitted] = useState(false)
  if (submitted) {
    return <div className="ps-flow-success"><CheckCircle2 size={28} /><span className="ps-kicker">Submission received</span><h1>COA ready for review</h1><p>Your submission has been queued for review and will be published in the evidence library once verified.</p><button type="button" onClick={() => setSubmitted(false)}>Submit another</button></div>
  }
  return (
    <div className="ps-form-page ps-section-shell">
      <header><span className="ps-kicker">Community evidence</span><h1>Submit a COA</h1><p>Share a laboratory report for review and possible publication in the evidence library.</p></header>
      <form className="ps-long-form" onSubmit={(event) => { event.preventDefault(); actions.submitCoa(event.currentTarget); setSubmitted(true) }}>
        <section><span className="ps-form-step">01</span><div><h2>Identify the report</h2><p>Use the names and identifiers exactly as they appear on the document.</p></div></section>
        <div className="ps-form-grid"><label>Compound name<input name="compound" placeholder="BPC-157" required /></label><label>Batch number<input name="batch" placeholder="PS-0426-A" required /></label><label>Vendor name<input name="vendor" placeholder="Vendor shown on product" /></label><label>Laboratory<input name="lab" placeholder="Testing laboratory" required /></label></div>
        <section><span className="ps-form-step">02</span><div><h2>Add the document</h2><p>PDF and common image formats are accepted by the private upload flow.</p></div></section>
        <label className="ps-file-drop"><FileUp size={28} /><strong>Choose the COA file</strong><span>or drag it into this area</span><input name="file" type="file" /></label>
        <label className="ps-check-row"><input type="checkbox" required /><span>I confirm this report is unaltered and may be reviewed for public display.</span></label>
        <div className="ps-form-submit-row"><p><ShieldCheck size={16} /> Submissions are reviewed before publication.</p><button type="submit">Send for review <ArrowRight size={17} /></button></div>
      </form>
    </div>
  )
}
