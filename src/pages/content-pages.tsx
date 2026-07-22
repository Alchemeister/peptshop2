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
    intro: 'PeptShop organizes products, vendors, pricing, fulfillment signals, and public evidence into one comparison surface.',
    sections: [
      ['Independent comparison', 'Listings are structured so a buyer can compare complete pack prices and vendor context without piecing together multiple sites.'],
      ['Evidence in context', 'COAs stay connected to compounds, vendors, and batches so the source of a claim remains visible.'],
      ['Accountable fulfillment', 'Order milestones, shipping updates, and delivery confirmation are recorded in one customer flow.'],
    ],
  },
  '/shipping': {
    kicker: 'Fulfillment guide',
    title: 'Know where an order ships from.',
    intro: 'Warehouse origin, available destinations, rates, and estimated dispatch are shown before checkout whenever a vendor supplies them.',
    sections: [
      ['Warehouse origin', 'Marketplace listings identify the fulfillment region attached to the offer.'],
      ['Destination rules', 'The private checkout adapter evaluates vendor rules against the delivery country.'],
      ['Tracking events', 'Customers can return to the private order page for tracking and delivery status.'],
    ],
  },
  '/privacy': {
    kicker: 'Privacy policy',
    title: 'Minimal data, specific purposes.',
    intro: 'PeptShop collects only the information required to operate marketplace browsing, checkout, fulfillment, and support.',
    sections: [
      ['Order data', 'Contact and delivery details are used to process the order and provide fulfillment updates.'],
      ['Access controls', 'Sensitive marketplace functions are restricted to the customer, relevant vendor, and authorized operators.'],
      ['Data requests', 'Customers may contact support to ask about access, correction, or removal where applicable.'],
    ],
  },
  '/privacy-policy': {
    kicker: 'Privacy policy',
    title: 'Minimal data, specific purposes.',
    intro: 'PeptShop collects only the information required to operate marketplace browsing, checkout, fulfillment, and support.',
    sections: [
      ['Order data', 'Contact and delivery details are used to process the order and provide fulfillment updates.'],
      ['Access controls', 'Sensitive marketplace functions are restricted to the customer, relevant vendor, and authorized operators.'],
      ['Data requests', 'Customers may contact support to ask about access, correction, or removal where applicable.'],
    ],
  },
  '/terms': {
    kicker: 'Terms of service',
    title: 'Marketplace terms in plain language.',
    intro: 'These terms govern use of the marketplace, including listings, checkout, fulfillment records, reviews, and evidence submissions.',
    sections: [
      ['Marketplace role', 'PeptShop provides marketplace infrastructure and does not manufacture the products listed by vendors.'],
      ['Research use only', 'Products are offered for legitimate laboratory research and are not for human consumption.'],
      ['Orders and disputes', 'Order-specific policies, evidence, and communication determine the available resolution process.'],
    ],
  },
  '/disclaimers': {
    kicker: 'Important information',
    title: 'Research use and marketplace disclaimers.',
    intro: 'Review these limitations before browsing, submitting evidence, or placing an order.',
    sections: [
      ['Not for human consumption', 'Marketplace products are offered solely for laboratory and in-vitro research.'],
      ['No medical guidance', 'PeptShop does not provide medical advice, diagnosis, treatment, or dosage instructions.'],
      ['Evidence limitations', 'A published laboratory document is provided for review and does not create a safety or suitability guarantee.'],
    ],
  },
}

export function ContentPage(props: PageComponentProps) {
  if (props.pathname === '/faq') return <FaqPage />
  if (props.pathname === '/contact') return <ContactPage />
  const content = contentByPath[props.pathname]
  if (!content) return <NotFoundPage actions={props.actions} />

  return (
    <article className="ps-editorial-page ps-section-shell">
      <header><span className="ps-kicker">{content.kicker}</span><h1>{content.title}</h1><p>{content.intro}</p></header>
      <div className="ps-editorial-rule"><span>Last reviewed July 2026</span><span>PeptShop marketplace</span></div>
      <div className="ps-editorial-body">
        <aside><p>On this page</p>{content.sections.map(([title], index) => <a key={title} href={`#section-${index + 1}`}>{String(index + 1).padStart(2, '0')} {title}</a>)}</aside>
        <div>{content.sections.map(([title, body], index) => <section key={title} id={`section-${index + 1}`}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{body}</p><p>The production application supplies the approved policy text for this route. This mock copy exists only to make typography, spacing, and hierarchy editable.</p></div></section>)}</div>
      </div>
    </article>
  )
}

function FaqPage() {
  const [open, setOpen] = useState(0)
  const items = [
    ['What does PeptShop sell?', 'PeptShop is a marketplace for research compounds supplied by independent vendors. Products are intended for laboratory research only.'],
    ['How are vendors compared?', 'Public profiles combine marketplace history, fulfillment signals, customer reviews, available shipping regions, and supporting evidence.'],
    ['What is a COA?', 'A certificate of analysis is a laboratory record. PeptShop displays available records with their compound, vendor, lab, and batch context.'],
    ['Do I need an account to order?', 'The current customer flow uses private order access rather than a traditional customer account.'],
    ['How do I track an order?', 'Use the private order status page with the identifier and contact details supplied during checkout.'],
  ]
  return <div className="ps-faq-page ps-section-shell"><header><span className="ps-kicker">Help center</span><h1>Questions, answered clearly.</h1><label><Search size={18} /><input placeholder="Search help topics" /></label></header><div className="ps-faq-layout"><aside><CircleHelp size={25} /><h2>Need a specific answer?</h2><p>Contact support with an order number when your question is tied to a purchase.</p><button type="button">Contact support <ArrowRight size={16} /></button></aside><div className="ps-faq-list">{items.map(([question, answer], index) => <article key={question}><button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{String(index + 1).padStart(2, '0')}</span><strong>{question}</strong><ChevronDown size={18} /></button>{open === index ? <p>{answer}</p> : null}</article>)}</div></div></div>
}

function ContactPage() {
  const [sent, setSent] = useState(false)
  return <div className="ps-contact-page ps-section-shell"><header><span className="ps-kicker">Support</span><h1>Tell us what you need.</h1><p>Choose the closest topic and include an order number when relevant.</p></header><div className="ps-contact-layout"><aside><div><Mail size={20} /><span><strong>Customer support</strong><small>Order, delivery, and payment questions</small></span></div><div><Users size={20} /><span><strong>Vendor support</strong><small>Onboarding and seller operations</small></span></div><div><FlaskConical size={20} /><span><strong>Evidence review</strong><small>COA and batch questions</small></span></div></aside>{sent ? <div className="ps-inline-success"><CheckCircle2 size={28} /><h2>Message staged in preview</h2><p>No message was sent from this frontend workspace.</p><button type="button" onClick={() => setSent(false)}>Write another</button></div> : <form onSubmit={(event) => { event.preventDefault(); setSent(true) }}><div className="ps-form-grid"><label>Name<input placeholder="Name" required /></label><label>Email<input type="email" placeholder="Email address" required /></label><label className="ps-field-wide">Topic<select defaultValue="order"><option value="order">Order support</option><option value="vendor">Vendor question</option><option value="coa">COA review</option><option value="general">General question</option></select></label><label className="ps-field-wide">Message<textarea rows={7} placeholder="How can we help?" required /></label></div><button type="submit">Send message <Send size={16} /></button></form>}</div></div>
}

export function LibraryPage({ actions, pathname }: PageComponentProps) {
  const detail = pathname !== '/articles' && pathname !== '/khavinson'
  if (detail) return <ArticlePage actions={actions} />
  return <div className="ps-library-page ps-section-shell"><header><span className="ps-kicker">Research library</span><h1>Read the compound, not the hype.</h1><p>Structured reference pages for research context, terminology, and marketplace navigation.</p></header><article className="ps-library-feature"><div><span>Featured guide</span><h2>How to read a peptide COA</h2><p>A practical framework for reviewing identity, purity, batch links, and the limits of a laboratory report.</p><FrontendLink href="/articles/how-to-read-a-coa" navigate={actions.navigate}>Read the guide <ArrowRight size={17} /></FrontendLink></div><div className="ps-library-feature-art"><FileText size={72} strokeWidth={1} /><span>Evidence<br />field notes</span></div></article><div className="ps-article-index">{['BPC-157 research overview', 'Understanding batch identifiers', 'Vendor fulfillment signals', 'Purity results and context', 'Research compound storage', 'Marketplace evidence policy'].map((title, index) => <FrontendLink key={title} href={`/articles/${title.toLowerCase().replaceAll(' ', '-')}`} navigate={actions.navigate}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{index % 2 ? 'Marketplace guide' : 'Compound reference'}</small><h2>{title}</h2><p>Editorial placeholder content supplied by the public frontend package.</p></div><ArrowRight size={18} /></FrontendLink>)}</div></div>
}

function ArticlePage({ actions }: Pick<PageComponentProps, 'actions'>) {
  return <article className="ps-article-page ps-section-shell"><button type="button" className="ps-back-link" onClick={() => actions.navigate('/articles')}><ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Research library</button><header><span className="ps-kicker">Evidence field notes · 8 minute read</span><h1>How to read a peptide COA</h1><p>Start with identity, follow the batch, then place the reported purity in context.</p></header><div className="ps-article-layout"><aside><span>Contents</span><a href="#identity">Identity</a><a href="#batch">Batch linkage</a><a href="#method">Method</a><a href="#limits">Limits</a></aside><div><section id="identity"><span>01</span><h2>Confirm the identity</h2><p>The compound name and tested material should agree with the listing you are evaluating. Begin with the report itself, not a cropped preview or a filename.</p></section><blockquote><FlaskConical size={22} /><p>A certificate becomes useful when the product, vendor, batch, laboratory, and date can be read together.</p></blockquote><section id="batch"><span>02</span><h2>Follow the batch</h2><p>Look for a batch identifier on both the report and the physical product. A high purity number cannot establish a connection when the identifiers do not match.</p></section><section id="method"><span>03</span><h2>Understand the method</h2><p>Different analytical methods answer different questions. The production article content can provide approved educational context without adding medical claims.</p></section><section id="limits"><span>04</span><h2>Keep the limits visible</h2><p>A COA is one record to review. It is not a medical recommendation, clinical safety finding, or guarantee of suitability.</p></section></div></div></article>
}

export function ApiDocsPage() {
  return <div className="ps-api-page"><aside><div className="ps-brand ps-brand-inverse"><img src="/peptshop-logo.svg" alt="" /><span>peptshop</span></div><span>API reference</span><nav><a href="#start">Introduction</a><a href="#catalog">Catalog</a><a href="#vendors">Vendors</a><a href="#coas">COAs</a><a href="#errors">Errors</a></nav></aside><main><header id="start"><span className="ps-kicker">Public read API</span><h1>Build with marketplace data.</h1><p>Reference presentation for sanitized, public endpoints exposed by the private application.</p></header><section id="catalog"><div><span className="ps-http-get">GET</span><code>/v1/catalog</code></div><h2>List catalog products</h2><p>Returns public compound summaries with approved offer and evidence counts.</p><pre>{`curl https://api.example.test/v1/catalog\n  -H "Accept: application/json"`}</pre></section><section id="vendors"><div><span className="ps-http-get">GET</span><code>/v1/vendors/:slug</code></div><h2>Get a public vendor profile</h2><p>Returns the public profile and marketplace metrics allowed for display.</p></section><div className="ps-api-note"><Code2 size={20} /><p>This frontend contains documentation layouts only. Endpoint behavior, authorization, and rate limits remain private.</p></div></main></div>
}

function NotFoundPage({ actions }: Pick<PageComponentProps, 'actions'>) {
  return <div className="ps-not-found"><span>404</span><h1>This route is not in the preview.</h1><p>Use the route explorer to open one of the designed page families.</p><button type="button" onClick={() => actions.navigate('/')}>Return home <ArrowRight size={17} /></button></div>
}
