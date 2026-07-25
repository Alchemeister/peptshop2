import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Code2,
  ExternalLink,
  FileText,
  FlaskConical,
  Globe2,
  Mail,
  MapPin,
  PackageCheck,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import type { PageComponentProps } from '../contracts'
import { FrontendLink } from '../navigation'

const contentByPath: Record<string, { kicker: string; title: string; intro: string; sections: Array<[string, string]> }> = {
  '/about': {
    kicker: 'Why PeptShop exists',
    title: 'A clearer market for research compounds.',
    intro: 'PeptShop is a marketplace for research-use-only peptides and compounds. It organizes products, vendors, pricing, fulfillment signals, and public evidence into one comparison surface so buyers can make informed decisions.',
    sections: [
      ['Independent comparison', 'Listings are structured so a buyer can compare complete pack prices and per-mg pricing across vendors without piecing together multiple sites. Finnrick Analytics aggregates pricing, purity, and reputation data so the comparison is always apples-to-apples.'],
      ['Evidence in context', 'COAs (Certificates of Analysis) stay connected to compounds, vendors, and batches so the source of a purity claim remains visible. Buyers can verify what is in the vial before purchasing.'],
      ['Crypto escrow protection', 'Every transaction uses crypto escrow — your payment is held until you confirm the order arrived and the CoA matches. The vendor does not get paid until you are satisfied.'],
    ],
  },
  '/shipping': {
    kicker: 'Fulfillment guide',
    title: 'Know where an order ships from.',
    intro: 'Warehouse origin, available destinations, rates, and estimated dispatch are shown before checkout whenever a vendor supplies them. Each vendor ships from their own facility using their chosen carrier.',
    sections: [
      ['Warehouse origin', 'Marketplace listings identify the fulfillment region attached to the offer. Vendors may ship domestically (2-3 business days) or overseas (7-14 business days).'],
      ['Destination rules', 'It is the buyer\'s responsibility to understand and comply with all applicable local, state, national, and international laws regarding the purchase, possession, and use of research compounds.'],
      ['Tracking events', 'Customers can return to the private order page for tracking and delivery status. Title and risk of loss pass to the buyer when the carrier accepts the package.'],
    ],
  },
  '/privacy': {
    kicker: 'Privacy policy',
    title: 'Minimal data, specific purposes.',
    intro: 'PeptShop collects only the information required to operate marketplace browsing, checkout, fulfillment, and support. We do not require a real name or phone number for buyers.',
    sections: [
      ['What we collect', 'Account data (email, display name, password hash — for vendors only; buyers can check out without an account), order data (shipping name, address, email, cart contents), payment data (crypto payments are settled via NOWPayments and referenced by transaction ID — we do not store card numbers), messages (disputes and order-related messaging), usage data (pages viewed, referrer, device type via server logs), and cookies (session and cart persistence).'],
      ['What we do not collect', 'We do not require a real name for buyers. We do not require a phone number. We do not sell, rent, or trade your personal data to third parties for marketing. We do not require KYC identity verification to browse, compare, or order.'],
      ['Your rights', 'You can request a copy of, or deletion of, your personal data by emailing privacy@peptshop.io. We respond within 30 days. Order records are retained for at least 3 years for tax and dispute-resolution purposes.'],
    ],
  },
  '/privacy-policy': {
    kicker: 'Privacy policy',
    title: 'Minimal data, specific purposes.',
    intro: 'PeptShop collects only the information required to operate marketplace browsing, checkout, fulfillment, and support. We do not require a real name or phone number for buyers.',
    sections: [
      ['What we collect', 'Account data (email, display name, password hash — for vendors only; buyers can check out without an account), order data (shipping name, address, email, cart contents), payment data (crypto payments are settled via NOWPayments and referenced by transaction ID — we do not store card numbers), messages (disputes and order-related messaging), usage data (pages viewed, referrer, device type via server logs), and cookies (session and cart persistence).'],
      ['What we do not collect', 'We do not require a real name for buyers. We do not require a phone number. We do not sell, rent, or trade your personal data to third parties for marketing. We do not require KYC identity verification to browse, compare, or order.'],
      ['Your rights', 'You can request a copy of, or deletion of, your personal data by emailing privacy@peptshop.io. We respond within 30 days. Order records are retained for at least 3 years for tax and dispute-resolution purposes.'],
    ],
  },
  '/terms': {
    kicker: 'Terms of service',
    title: 'Marketplace terms in plain language.',
    intro: 'These terms govern use of PeptShop, a marketplace for research-use-only products. By accessing or using PeptShop you agree to these terms. You must be at least 18 years old to use the service.',
    sections: [
      ['Research use only', 'PeptShop is a marketplace for research-use-only products. By using the service you confirm that you will use all purchased products solely for legitimate in-vitro research, laboratory, or educational purposes in compliance with all applicable laws. Products are not intended for human consumption, diagnosis, treatment, cure, or mitigation of any disease.'],
      ['Orders & payment', 'All prices are listed in USD. Crypto payment amounts are computed at checkout based on the live exchange rate. Payment is complete when the transaction is confirmed on-chain. Orders are non-cancellable once payment is confirmed. If a vendor cannot fulfill an order, the buyer receives a full refund.'],
      ['Disputes', 'If something goes wrong with an order, open a dispute from the order page. PeptShop will mediate between buyer and vendor. Resolution may include a full or partial refund, a replacement, or a release of funds to the vendor, depending on the evidence.'],
    ],
  },
  '/disclaimers': {
    kicker: 'Important information',
    title: 'Research use and marketplace disclaimers.',
    intro: 'All products listed on PeptShop are sold strictly for in-vitro research, laboratory, and educational purposes. They are not intended for human consumption, diagnosis, treatment, cure, or mitigation of any disease or medical condition.',
    sections: [
      ['Research use only', 'All products listed on PeptShop are sold strictly for in-vitro research, laboratory, and educational purposes. They are not intended for human consumption, diagnosis, treatment, cure, or mitigation of any disease or medical condition. By using this site you confirm that you are a qualified researcher, laboratory professional, or educational institution purchasing for legitimate research purposes only.'],
      ['Not for human consumption', 'Products offered through PeptShop are not food, drugs, or cosmetics and have not been evaluated by any regulatory body for human safety or efficacy. Ingestion, injection, inhalation, or any other form of human or animal administration is strictly prohibited and violates these terms. Any buyer who uses products in violation of this disclaimer assumes all liability for any resulting harm.'],
      ['Safety and handling', 'Research compounds must be handled in accordance with laboratory safety protocols, including appropriate personal protective equipment, ventilation, and storage conditions as specified by the manufacturer. Buyers are responsible for ensuring that their facilities meet the requirements for safe receipt, storage, and disposal of these materials. PeptShop does not provide handling, storage, or disposal guidance beyond what is supplied by the vendor.'],
      ['Medical disclaimer', 'Content on PeptShop — including product descriptions, dosage suggestions, research summaries, and blog posts — is for informational purposes only. It is not medical, legal, or professional advice. Always consult a qualified professional before making research, clinical, or procurement decisions. PeptShop does not make any representation regarding the clinical safety, efficacy, or therapeutic value of any listed compound.'],
      ['Legal compliance', 'It is the buyer\'s responsibility to understand and comply with all applicable local, state, national, and international laws regarding the purchase, possession, handling, and use of research compounds. PeptShop does not provide legal advice and is not liable for any buyer\'s failure to comply with applicable laws. Orders shipped to jurisdictions where a product is restricted or prohibited are the sole responsibility of the buyer.'],
      ['Age restriction', 'You must be at least 18 years old (or the age of majority in your jurisdiction) to access and use PeptShop. By placing an order you confirm that you meet this requirement. PeptShop does not knowingly sell to minors and reserves the right to refuse or cancel any order where age verification cannot be confirmed.'],
      ['Marketplace platform', 'PeptShop is a marketplace that connects independent vendors with qualified research buyers. We verify vendor identity and CoA documentation at onboarding, but we do not independently re-test every batch, take possession of inventory, manufacture, or repackage any product. Vendor claims, purity numbers, and product descriptions are the responsibility of the vendor. PeptShop facilitates transactions and dispute resolution between parties.'],
      ['Quality and purity', 'Each vendor is required to provide a Certificate of Analysis (CoA) for every batch listed on the marketplace, and these CoAs are displayed publicly on the relevant product pages. PeptShop does not independently verify the accuracy of CoAs beyond confirming their presence and linking them to the vendor and batch. Any discrepancy between a CoA and the product received should be reported immediately via the dispute process.'],
      ['Crypto payment routing', 'Payments on PeptShop are settled in cryptocurrency via third-party processors such as NOWPayments and are referenced by transaction ID on the order record. PeptShop does not store card numbers or fiat payment credentials, and crypto payments are held in escrow until the buyer confirms receipt and product conformity. Payment errors, network failures, or disputes involving the payment processor are subject to the processor\'s own terms and resolution timeline.'],
      ['Shipping policy', 'Each vendor ships from their own facility using their chosen carrier, and listings identify the fulfillment region and estimated dispatch window before checkout. PeptShop does not guarantee delivery dates and is not liable for carrier delays, customs holds, or losses occurring after a package leaves the vendor\'s facility. Title and risk of loss pass to the buyer when the carrier accepts the package.'],
      ['Refund policy', 'Refunds are issued in cryptocurrency to the original payment address and are processed only after a dispute is resolved in the buyer\'s favor or a vendor confirms a fulfillment failure. Refund amounts are calculated in USD at the original order exchange rate and converted to the buyer\'s selected cryptocurrency at the live rate at the time of refund. Network fees are non-refundable and are deducted from the refunded amount.'],
      ['Return policy', 'Due to the nature of research compounds, returns are not accepted for products that have been opened, used, or stored outside of the specified conditions. Unopened products may be returned only with prior vendor authorization and within 14 days of receipt, in their original packaging and with intact batch identifiers. Buyers are responsible for return shipping costs unless the return results from a vendor error.'],
      ['Final sales policy', 'All sales are final once a crypto payment has been confirmed on-chain and the order has entered the vendor\'s fulfillment queue, except where a dispute is opened and resolved in the buyer\'s favor. Orders cannot be cancelled, modified, or refunded after fulfillment has begun without vendor approval. By confirming an order you acknowledge and accept this final-sale policy.'],
      ['Review content policy', 'Product and vendor reviews on PeptShop are submitted by verified buyers and are moderated to remove advertising, off-topic content, personal attacks, or claims about human use. Reviews are the opinion of the author and do not represent the position of PeptShop or its vendors. PeptShop reserves the right to remove or hide any review that violates these guidelines.'],
      ['Limitation of liability', 'PeptShop facilitates marketplace transactions but does not take possession of, manufacture, or repackage any product. Our total aggregate liability for any claim arising out of or relating to the use of the marketplace is limited to the fees we received from the disputed transaction. We are not liable for indirect, incidental, consequential, or punitive damages, or for any harm resulting from misuse of a product.'],
      ['Acknowledgment', 'By accessing PeptShop, browsing listings, or placing an order, you acknowledge that you have read, understood, and agreed to all of the disclaimers above. You confirm that you are a qualified researcher, laboratory professional, or educational institution purchasing solely for legitimate research purposes, and that you assume all responsibility for compliance with applicable laws and for the safe handling of any purchased product.'],
    ],
  },
}

export function ContentPage(props: PageComponentProps) {
  if (props.pathname === '/faq') return <FaqPage />
  if (props.pathname === '/contact') return <ContactPage />
  if (props.pathname === '/shipping') return <ShippingPage />
  const content = contentByPath[props.pathname]
  if (!content) return <NotFoundPage actions={props.actions} />

  return (
    <article className="ps-editorial-page ps-section-shell">
      <header><span className="ps-kicker">{content.kicker}</span><h1>{content.title}</h1><p>{content.intro}</p></header>
      <div className="ps-editorial-rule"><span>Last reviewed July 2026</span><span>PeptShop marketplace</span></div>
      <div className="ps-editorial-body">
        <aside><p>On this page</p>{content.sections.map(([title], index) => <a key={title} href={`#section-${index + 1}`}>{String(index + 1).padStart(2, '0')} {title}</a>)}</aside>
        <div>{content.sections.map(([title, body], index) => <section key={title} id={`section-${index + 1}`}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{body}</p></div></section>)}</div>
      </div>
    </article>
  )
}

function ShippingPage() {
  const [country, setCountry] = useState('')
  const shippingContent = contentByPath['/shipping']
  const countryInfo: Record<string, { status: string; eta: string; note: string }> = {
    'United States': { status: 'Available', eta: '2-7 business days', note: 'Domestic and overseas vendors ship to all 50 states. Customs inspection may apply for overseas shipments.' },
    'United Kingdom': { status: 'Available', eta: '5-12 business days', note: 'Overseas shipments subject to UK Border Force inspection. Domestic UK vendors may offer faster fulfillment.' },
    Canada: { status: 'Available', eta: '5-14 business days', note: 'Shipments subject to CBSA inspection. Buyers are responsible for confirming compound legality in their province.' },
    Australia: { status: 'Restricted', eta: '7-21 business days', note: 'The Australian Border Force strictly controls imported research compounds. Buyers must verify import permits before ordering.' },
    Germany: { status: 'Available', eta: '4-10 business days', note: 'EU customs applies to overseas shipments. Intra-EU vendor shipments may arrive faster without customs holds.' },
  }
  const info = country ? countryInfo[country] : null
  return (
    <article className="ps-editorial-page ps-section-shell">
      <header><span className="ps-kicker">{shippingContent.kicker}</span><h1>{shippingContent.title}</h1><p>{shippingContent.intro}</p></header>
      <div className="ps-editorial-rule"><span>Last reviewed July 2026</span><span>PeptShop marketplace</span></div>
      <section className="ps-shipping-selector">
        <label>
          <span>Check shipping availability for your country</span>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">Select a country…</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
          </select>
        </label>
        {info ? (
          <div className="ps-shipping-result">
            <div className="ps-shipping-status">
              <PackageCheck size={20} />
              <strong>{country}: {info.status}</strong>
            </div>
            <p><Truck size={16} /> Estimated delivery: {info.eta}</p>
            <p>{info.note}</p>
          </div>
        ) : null}
      </section>
      <div className="ps-editorial-body">
        <aside><p>On this page</p>{shippingContent.sections.map(([title], index) => <a key={title} href={`#section-${index + 1}`}>{String(index + 1).padStart(2, '0')} {title}</a>)}</aside>
        <div>{shippingContent.sections.map(([title, body], index) => <section key={title} id={`section-${index + 1}`}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{body}</p></div></section>)}</div>
      </div>
    </article>
  )
}

function FaqPage() {
  const [open, setOpen] = useState(0)
  const [faqQuery, setFaqQuery] = useState('')
  const allItems = [
    ['Why per-mg pricing?', 'Most peptide vendors sell in multi-vial packs at different dosages sizes. Per-mg pricing lets you compare the true cost across vendors and pack sizes — so a 10-vial pack of 5 mg BPC-157 from one vendor is directly comparable to a 10-vial pack of 2 mg from another. We display both the full pack price and the per-mg price on every listing.'],
    ['What is a COA and why does it matter?', 'A Certificate of Analysis (CoA) is a laboratory test report that confirms the identity, purity, and sometimes the concentration of a compound. Every vendor on PeptShop is required to provide a CoA for each batch. We display these CoAs publicly on each product page, linked to the vendor and batch, so you can verify what is in the vial before you buy.'],
    ['How does crypto escrow work?', 'When you place an order, your crypto payment is held in escrow — not sent directly to the vendor. The vendor ships the order. When you receive it and confirm the product matches the listing and CoA, the funds are released to the vendor. If something is wrong, you can open a dispute and the funds stay in escrow until PeptShop mediates a resolution.'],
    ['Are these products safe?', 'All products on PeptShop are sold strictly for in-vitro research, laboratory, and educational purposes. They are not intended for human consumption, diagnosis, treatment, cure, or mitigation of any disease. Safety in a research context depends on proper handling, storage, and laboratory protocols. PeptShop verifies vendor identity and CoA documentation but does not independently re-test every batch.'],
    ['What is Finnrick Analytics?', 'Finnrick Analytics is the data layer behind PeptShop. It aggregates pricing, purity data, vendor reputation signals, and marketplace history into a structured comparison surface. When you see per-mg pricing, vendor reputation scores, or purity trends on PeptShop, that data is sourced and organized by Finnrick Analytics.'],
    ['Do I need KYC to use PeptShop?', 'No. PeptShop does not require KYC (Know Your Customer) identity verification to browse, compare, or place an order. You can check out without creating an account. Vendors who list products on the marketplace go through a separate onboarding and verification process, but buyers do not need to submit identity documents.'],
    ['What cryptocurrencies can I use?', 'PeptShop accepts crypto payments via NOWPayments, which supports Bitcoin (BTC), Ethereum (ETH), Monero (XMR), USDT, USDC, and 100+ other coins across multiple networks. The exact amount is calculated at checkout based on the live exchange rate. Payment is confirmed when the transaction is verified on-chain.'],
    ['How do I verify purity claims?', 'Every product listing links to the vendor\'s CoA for that specific batch. The CoA shows the analytical method used (typically HPLC or mass spectrometry), the measured purity percentage, and the batch identifier. You can cross-reference the batch ID on the CoA with the batch ID on the physical product you receive. If they do not match, open a dispute immediately.'],
    ['How does PeptShop compare prices across vendors?', 'PeptShop normalizes all vendor offerings to a per-mg price, so you can compare a 2 mg × 10-vial pack from one vendor against a 5 mg × 10-vial pack from another on equal footing. We also display the total pack price, shipping cost, free shipping thresholds, and any volume discounts. The comparison table on each product page shows all active vendors side by side, sorted by per-mg price.'],
  ]
  const items = allItems.filter(([q, a]) => !faqQuery || `${q} ${a}`.toLowerCase().includes(faqQuery.toLowerCase()))
  return <div className="ps-faq-page ps-section-shell"><header><span className="ps-kicker">Help center</span><h1>Questions, answered clearly.</h1><label><Search size={18} /><input placeholder="Search help topics" value={faqQuery} onChange={(e) => setFaqQuery(e.target.value)} /></label></header><div className="ps-faq-layout"><aside><CircleHelp size={25} /><h2>Need a specific answer?</h2><p>Contact support with an order number when your question is tied to a purchase.</p><button type="button">Contact support <ArrowRight size={16} /></button></aside><div className="ps-faq-list">{items.map(([question, answer], index) => <article key={question}><button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><ChevronDown size={18} /></button>{open === index ? <p>{answer}</p> : null}</article>)}</div></div></div>
}

function ContactPage() {
  const [sent, setSent] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [checks, setChecks] = useState([false, false, false, false])
  const statements = [
    'I am not going to ask about payment confirmation unless the order was placed over 24 hours ago and there is no confirmation email in my inbox.',
    'I am not going to ask when an order will ship. If it\'s been over 10 days I will open a ticket.',
    'I am not going to ask about the status of an order. If it\'s been 21 days since I received the tracking number, I will open a ticket.',
    'This is not about a missing product or quality control issue. If it is, I will open a dispute from my order page.',
  ]
  const allChecked = checks.every(Boolean)
  return <div className="ps-contact-page ps-section-shell"><header><span className="ps-kicker">Support</span><h1>Tell us what you need.</h1><p>Choose the closest topic and include an order number when relevant.</p></header><div className="ps-contact-layout"><aside><div><Mail size={20} /><span><strong>Customer support</strong><small>Order, delivery, and payment questions</small></span></div><div><Users size={20} /><span><strong>Vendor support</strong><small>Onboarding and seller operations</small></span></div><div><FlaskConical size={20} /><span><strong>Evidence review</strong><small>COA and batch questions</small></span></div></aside>{!confirmed ? <div className="ps-contact-gate"><h2>Confirm all four statements to reveal the support email.</h2>{statements.map((statement, index) => <label key={index} className="ps-contact-statement"><input type="checkbox" checked={checks[index]} onChange={(e) => { const next = [...checks]; next[index] = e.target.checked; setChecks(next); setConfirmed(next.every(Boolean)) }} /><span>{statement}</span></label>)}{allChecked ? <div className="ps-contact-gate-reveal"><CheckCircle2 size={20} /><strong>All statements confirmed. The support form is now available below.</strong></div> : null}</div> : null}{confirmed ? (sent ? <div className="ps-inline-success"><CheckCircle2 size={28} /><h2>Message sent</h2><p>We'll get back to you within 24 hours.</p><button type="button" onClick={() => setSent(false)}>Write another</button></div> : <form onSubmit={(event) => { event.preventDefault(); setSent(true) }}><div className="ps-form-grid"><label>Name<input placeholder="Name" required /></label><label>Email<input type="email" placeholder="Email address" required /></label><label className="ps-field-wide">Topic<select defaultValue="order"><option value="order">Order support</option><option value="vendor">Vendor question</option><option value="coa">COA review</option><option value="general">General question</option></select></label><label className="ps-field-wide">Message<textarea rows={7} placeholder="How can we help?" required /></label></div><button type="submit">Send message <Send size={16} /></button></form>) : null}</div></div>
}

export function LibraryPage({ actions, pathname }: PageComponentProps) {
  const detail = pathname !== '/articles' && pathname !== '/khavinson'
  if (detail) return <ArticlePage actions={actions} />
  return <div className="ps-library-page ps-section-shell"><header><span className="ps-kicker">Research library</span><h1>Read the compound, not the hype.</h1><p>Structured reference pages for research context, terminology, and marketplace navigation.</p></header><article className="ps-library-feature"><div><span>Featured guide</span><h2>How to read a peptide COA</h2><p>A practical framework for reviewing identity, purity, batch links, and the limits of a laboratory report.</p><FrontendLink href="/articles/how-to-read-a-coa" navigate={actions.navigate}>Read the guide <ArrowRight size={17} /></FrontendLink></div><div className="ps-library-feature-art"><FileText size={72} strokeWidth={1} /><span>Evidence<br />field notes</span></div></article><div className="ps-article-index">{['BPC-157 research overview', 'Understanding batch identifiers', 'Vendor fulfillment signals', 'Purity results and context', 'Research compound storage', 'Marketplace evidence policy'].map((title, index) => <FrontendLink key={title} href={`/articles/${title.toLowerCase().replaceAll(' ', '-')}`} navigate={actions.navigate}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{index % 2 ? 'Marketplace guide' : 'Compound reference'}</small><h2>{title}</h2><p>Read the full guide for practical context on this topic.</p></div><ArrowRight size={18} /></FrontendLink>)}</div></div>
}

function ArticlePage({ actions }: Pick<PageComponentProps, 'actions'>) {
  return <article className="ps-article-page ps-section-shell"><button type="button" className="ps-back-link" onClick={() => actions.navigate('/articles')}><ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Research library</button><header><span className="ps-kicker">Evidence field notes · 8 minute read</span><h1>How to read a peptide COA</h1><p>Start with identity, follow the batch, then place the reported purity in context.</p></header><div className="ps-article-layout"><aside><span>Contents</span><a href="#identity">Identity</a><a href="#batch">Batch linkage</a><a href="#method">Method</a><a href="#limits">Limits</a></aside><div><section id="identity"><span>01</span><h2>Confirm the identity</h2><p>The compound name and tested material should agree with the listing you are evaluating. Begin with the report itself, not a cropped preview or a filename.</p></section><blockquote><FlaskConical size={22} /><p>A certificate becomes useful when the product, vendor, batch, laboratory, and date can be read together.</p></blockquote><section id="batch"><span>02</span><h2>Follow the batch</h2><p>Look for a batch identifier on both the report and the physical product. A high purity number cannot establish a connection when the identifiers do not match.</p></section><section id="method"><span>03</span><h2>Understand the method</h2><p>Different analytical methods answer different questions. Understanding whether a report uses HPLC, mass spectrometry, or another technique helps you interpret the purity claim correctly.</p></section><section id="limits"><span>04</span><h2>Keep the limits visible</h2><p>A COA is one record to review. It is not a medical recommendation, clinical safety finding, or guarantee of suitability.</p></section></div></div></article>
}

export function ApiDocsPage() {
  return <div className="ps-api-page"><aside><div className="ps-brand ps-brand-inverse"><img src="/peptshop-logo.svg" alt="" /><span>peptshop</span></div><span>API reference</span><nav><a href="#start">Introduction</a><a href="#catalog">Catalog</a><a href="#vendors">Vendors</a><a href="#coas">COAs</a><a href="#errors">Errors</a></nav></aside><main><header id="start"><span className="ps-kicker">Public read API</span><h1>Build with marketplace data.</h1><p>Reference documentation for public read endpoints.</p></header><section id="catalog"><div><span className="ps-http-get">GET</span><code>/v1/catalog</code></div><h2>List catalog products</h2><p>Returns public compound summaries with approved offer and evidence counts.</p><pre>{`curl https://api.example.test/v1/catalog\n  -H "Accept: application/json"`}</pre></section><section id="vendors"><div><span className="ps-http-get">GET</span><code>/v1/vendors/:slug</code></div><h2>Get a public vendor profile</h2><p>Returns the public profile and marketplace metrics allowed for display.</p></section><div className="ps-api-note"><Code2 size={20} /><p>Endpoint behavior, authorization, and rate limits are managed server-side.</p></div></main></div>
}

function NotFoundPage({ actions }: Pick<PageComponentProps, 'actions'>) {
  return <div className="ps-not-found"><span>404</span><h1>Page not found</h1><p>The page you're looking for doesn't exist or has moved.</p><button type="button" onClick={() => actions.navigate('/')}>Return home <ArrowRight size={17} /></button></div>
}
