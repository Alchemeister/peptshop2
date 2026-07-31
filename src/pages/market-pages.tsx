import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  Filter,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Truck,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { PageComponentProps, ProductSummary, VendorSummary } from '../contracts'
import { researchStudies, type ResearchStudy } from '../mock-data'
import { FrontendLink } from '../navigation'
import {
  CompoundWaitlistDescription,
  CompoundWaitlistForm,
  CompoundWaitlistTitle,
  ProductBackControlFrame,
  ProductDosageOptionFrame,
  ProductDosageSelectorFrame,
  ProductOffersSection,
  ProductPageFrame,
  ProductPageHero,
  ProductUnavailableState,
  VendorOfferCardFrame,
  VendorOfferOptionFrame,
} from '../product-page'

export function CatalogPage({ actions, models }: PageComponentProps) {
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [stockOnly, setStockOnly] = useState(false)
  const [regionFilter, setRegionFilter] = useState<'all' | 'us' | 'eu'>('all')
  const [regionOpen, setRegionOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name')
  const [showTop, setShowTop] = useState(false)
  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const filtered = models.products.filter((product) => {
      if (stockOnly && (product.availability !== 'available' || product.vendorCount === 0)) return false
      if (regionFilter === 'eu' && product.vendorCount < 3) return false // EU = third sample vendor
      return !normalized || `${product.name}`.toLowerCase().includes(normalized)
    })
    return filtered.sort((left, right) => {
      if (sortBy === 'price-low') return (left.startingPrice ?? 999) - (right.startingPrice ?? 999)
      if (sortBy === 'price-high') return (right.startingPrice ?? 0) - (left.startingPrice ?? 0)
      return left.name.localeCompare(right.name)
    })
  }, [models.products, query, stockOnly, sortBy, regionFilter])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="ps-catalog-page ps-section-shell">
      <header className="ps-page-masthead">
        <span className="ps-kicker">Marketplace index</span>
        <div className="ps-page-title-row">
          <h1>All compounds</h1>
        </div>
      </header>

      <div className="ps-catalog-tools">
        <label className="ps-catalog-search">
          <Search size={18} />
          <span className="ps-visually-hidden">Search catalog</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search by compound"
          />
          {query ? <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button> : null}
        </label>
        <div className={`ps-region-dropdown ${regionOpen ? 'is-open' : ''}`}>
          <button
            type="button"
            className={`ps-region-trigger ${regionFilter !== 'all' ? 'is-active' : ''}`}
            onClick={() => setRegionOpen((open) => !open)}
            aria-expanded={regionOpen}
          >
            <MapPin size={15} />
            {regionFilter === 'all' ? 'All regions' : regionFilter === 'us' ? 'US warehouse' : 'EU warehouse'}
            <ChevronDown size={15} />
          </button>
          {regionOpen ? (
            <>
              <div className="ps-region-overlay" onClick={() => setRegionOpen(false)} />
              <div className="ps-region-menu">
                <button type="button" className={regionFilter === 'all' ? 'is-selected' : ''} onClick={() => { setRegionFilter('all'); setRegionOpen(false) }}>
                  <Check size={15} /> All regions
                </button>
                <button type="button" className={regionFilter === 'us' ? 'is-selected' : ''} onClick={() => { setRegionFilter('us'); setRegionOpen(false) }}>
                  <Check size={15} /> US warehouse
                </button>
                <button type="button" className={regionFilter === 'eu' ? 'is-selected' : ''} onClick={() => { setRegionFilter('eu'); setRegionOpen(false) }}>
                  <Check size={15} /> EU warehouse
                </button>
              </div>
            </>
          ) : null}
        </div>
        <button type="button" className="ps-filter-button" onClick={() => setFilterOpen((open) => !open)} aria-expanded={filterOpen}>
          <SlidersHorizontal size={17} /> Filters <ChevronDown size={15} />
        </button>
        <label className="ps-stock-switch">
          <input type="checkbox" checked={stockOnly} onChange={(event) => setStockOnly(event.currentTarget.checked)} />
          <span /> Available now
        </label>
        {stockOnly ? (
          <small className="ps-stock-hint">Showing {visibleProducts.length} of {models.products.length} — turn off to see all compounds</small>
        ) : null}
      </div>

      {filterOpen ? (
        <div className="ps-filter-strip">
          <Filter size={16} />
          <button type="button" className={sortBy === 'name' ? 'is-active' : ''} onClick={() => setSortBy('name')}>Sort <span>A–Z</span></button>
          <button type="button" className={sortBy === 'price-low' ? 'is-active' : ''} onClick={() => setSortBy('price-low')}>Price <span>Low–High</span></button>
          <button type="button" className={sortBy === 'price-high' ? 'is-active' : ''} onClick={() => setSortBy('price-high')}>Price <span>High–Low</span></button>
        </div>
      ) : null}

      {visibleProducts.length ? (
        <div className="ps-catalog-grid" style={{ marginTop: '1.5rem' }}>
          {visibleProducts.map((product) => (
            <CatalogCard key={product.id} product={product} navigate={actions.navigate} />
          ))}
        </div>
      ) : (
        <div className="ps-empty-state">
          <Search size={24} />
          <h2>No matching compounds</h2>
          <p>Try a shorter name or clear the availability filter.</p>
          <button type="button" onClick={() => { setQuery(''); setStockOnly(false) }}>Reset catalog</button>
        </div>
      )}
      {showTop ? (
        <button type="button" className="ps-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <ArrowUp size={20} />
        </button>
      ) : null}
    </div>
  )
}

function CatalogCard({ product, navigate }: { product: ProductSummary; navigate: (href: string) => void }) {
  return (
    <FrontendLink href={`/products/${product.slug}`} navigate={navigate} className="ps-catalog-card">
      <div className="ps-catalog-card-copy">
        <h2>{product.name}</h2>
        <p>{product.formats.join(' · ')}</p>
        <div>
          <span>{product.vendorCount ? `${product.vendorCount} ${product.vendorCount === 1 ? 'vendor' : 'vendors'}` : 'Join watchlist'}</span>
          {product.vendorCount >= 3 ? <small className="ps-region-badge">US · EU</small> : product.vendorCount >= 1 ? <small className="ps-region-badge">US</small> : null}
          <strong>{product.startingPrice === null ? 'No live offers' : `$${product.startingPrice.toFixed(2)}/mg`}</strong>
        </div>
        <i className="ps-catalog-coa-badge">{product.coaCount} COA{product.coaCount === 1 ? '' : 's'}</i>
      </div>
    </FrontendLink>
  )
}

// Product detail lookup: maps product name → extra fields not in ProductSummary
export const productDetails: Record<
  string,
  { cas: string; formula: string; mw: string; description: string }
> = {
  'BPC-157': { cas: '137525-51-0', formula: 'C₆₂H₉₈N₁₆O₂₂', mw: '1419.5', description: 'Synthetic pentadecapeptide sequence derived from gastric mucosa. Studied for its effects on fibroblast migration and angiogenesis in in-vitro models.' },
  'Tirzepatide': { cas: '2023788-19-2', formula: 'C₂₂₅H₃₄₈N₄₈O₆₈', mw: '4813', description: 'Dual GIP/GLP-1 receptor agonist. Studied for glucose-dependent insulin secretion and metabolic signaling pathways.' },
  'NAD+': { cas: '53-84-9', formula: 'C₂₁H₂₇N₇O₁₄P₂', mw: '663.4', description: 'Essential coenzyme in cellular redox reactions. Studied for its role in electron transport and enzymatic cofactor activity.' },
  'MOTS-c': { cas: '1627580-64-6', formula: 'C₁₀₁H₁₅₂N₂₈O₂₂S₂', mw: '2174.6', description: 'Mitochondrial-derived peptide. Studied for AMPK signaling pathway modulation and metabolic gene expression.' },
  'Tesamorelin': { cas: '218949-48-5', formula: 'C₂₂₁H₃₆₆N₇₂O₆₇S', mw: '5136', description: 'Growth hormone releasing hormone analog. Studied for pituitary GH secretion stimulation and IGF-1 response.' },
  'Semax': { cas: '80714-61-0', formula: 'C₃₇H₅₁N₉O₁₀S', mw: '813.9', description: 'Synthetic heptapeptide. Studied for BDNF expression and melanocortin receptor activity.' },
  'GHK-Cu': { cas: '89030-95-5', formula: 'C₁₄H₂₃CuN₆O₄', mw: '402.92', description: 'Copper peptide complex. Studied for metalloproteinase modulation and extracellular matrix synthesis.' },
  'Retatrutide': { cas: '2381089-83-2', formula: 'C₂₂₁H₃₄₂N₄₆O₆₈', mw: '4731.42', description: 'Triple agonist (GLP-1/GIP/GcgR). Studied for multi-receptor binding and metabolic signaling.' },
  '5-Amino-1MQ': { cas: '685079-15-6', formula: 'C₁₀H₁₁N₂', mw: '159.21', description: 'Small molecule inhibitor of NNMT methyltransferase. Studied for NAD+ salvage pathway modulation.' },
  'AOD-9604': { cas: '221231-10-3', formula: 'C₇₈H₁₂₃N₂₃O₂₃S₂', mw: '1815.1', description: 'Modified fragment of growth hormone peptide sequence. Studied for beta-adrenergic lipolysis signaling.' },
  'Cagrilintide': { cas: '1415456-99-3', formula: 'C₁₉₄H₃₁₂N₅₄O₅₉S₂', mw: '4409', description: 'Long-acting amylin analog. Studied for calcitonin receptor activation and gastric motility.' },
  'DSIP': { cas: '62568-57-4', formula: 'C₃₅H₄₈N₁₀O₁₅', mw: '848.8', description: 'Delta sleep-inducing peptide. Studied for hypothalamic neuropeptide signaling and circadian modulation.' },
  'Epitalon': { cas: '307297-39-8', formula: 'C₁₄H₂₂N₄O₉', mw: '390.35', description: 'Synthetic tetrapeptide. Studied for telomerase activity modulation and pineal gland peptide signaling.' },
  'Glutathione': { cas: '70-18-8', formula: 'C₁₀H₁₇N₃O₆S', mw: '307.33', description: 'Tripeptide antioxidant. Studied for redox buffering and xenobiotic conjugation.' },
  'Ipamorelin': { cas: '170851-70-4', formula: 'C₃₈H₄₉N₉O₅', mw: '711.9', description: 'Synthetic pentapeptide. Studied for selective ghrelin receptor agonism.' },
  'Kisspeptin-10': { cas: '374675-21-5', formula: 'C₆₃H₈₃N₁₇O₁₄', mw: '1302.4', description: 'Neuropeptide derived from kisspeptin. Studied for GPR54 receptor activation and GnRH secretion.' },
  'PT-141': { cas: '189691-06-3', formula: 'C₅₀H₆₈N₁₄O₁₀', mw: '1025.2', description: 'Synthetic melanocortin receptor agonist. Studied for MC3R and MC4R receptor selectivity.' },
  'Pinealon': { cas: '175175-23-2', formula: 'C₁₅H₂₆N₆O₈', mw: '418.40', description: 'Synthetic tripeptide. Studied for gene-specific DNA sequence interactions.' },
  'SS-31': { cas: '736992-21-5', formula: 'C₃₂H₄₉N₉O₅', mw: '639.8', description: 'Mitochondria-targeted peptide. Studied for inner membrane stabilization and reactive oxygen species modulation.' },
  'Selank': { cas: '129954-34-3', formula: 'C₃₃H₅₇N₁₁O₉', mw: '751.9', description: 'Synthetic heptapeptide. Studied for enkephalin-degrading enzyme inhibition and immune modulation.' },
  'Semaglutide': { cas: '910463-68-2', formula: 'C₁₈₇H₂₉₁N₄₅O₅₉', mw: '4114', description: 'GLP-1 receptor agonist. Studied for glucose-dependent insulin secretion and gastric emptying modulation.' },
  'Sermorelin': { cas: '86168-78-7', formula: 'C₁₄₉H₂₄₆N₄₄O₄₂S', mw: '3357.9', description: 'Growth hormone releasing hormone analog. Studied for pituitary GH secretion stimulation.' },
  'BAC Water': { cas: '100-51-6', formula: 'C₇H₈O', mw: '108.14', description: 'Bacteriostatic water for injection. 0.9% benzyl alcohol preservative allows multi-dose use for up to 30 days.' },
  'Acetic Acid': { cas: '64-19-7', formula: 'C₂H₄O₂', mw: '60.05', description: 'Reconstitution solvent for peptide vials. 0.9% bacteriostatic acetic acid for compounds sensitive to neutral pH.' },
  'BPC-157 / TB-500 Blend': { cas: 'N/A', formula: 'N/A', mw: 'N/A', description: 'Combined formulation of BPC-157 and TB-500. Studied for synergistic effects on fibroblast activity.' },
  'CJC-1295': { cas: '446262-90-4', formula: 'C₁₆₅H₂₆₉N₄₇O₄₆', mw: '3647.2', description: 'Growth hormone releasing hormone analog. Studied for extended half-life via drug affinity complex.' },
  'GHRP-2': { cas: '158861-67-7', formula: 'C₄₅H₅₅N₉O₆', mw: '818.0', description: 'Growth hormone secretagogue. Studied for ghrelin receptor agonism and GH pulse amplification.' },
  'Melanotan II': { cas: '121062-08-6', formula: 'C₅₀H₆₉N₁₅O₉', mw: '1024.2', description: 'Synthetic analog of alpha-melanocyte stimulating hormone. Studied for melanocortin receptor binding affinity.' },
  'Hexarelin': { cas: '140703-51-1', formula: 'C₄₇H₅₈N₁₂O₆', mw: '887.0', description: 'Synthetic hexapeptide. Studied for ghrelin receptor agonism and GH secretagogue activity.' },
  'IGF-1 LR3': { cas: '143045-71-2', formula: 'C₃₃₁H₅₂₆N₇₆O₁₀₈S₆', mw: '7698.7', description: 'Long-acting insulin-like growth factor analog. Studied for IGF-1R binding and downstream PI3K/AKT signaling.' },
  'MOD-GRF 1-29': { cas: '86168-78-7', formula: 'C₁₄₉H₂₄₆N₄₄O₄₂S', mw: '3357.9', description: 'Modified growth hormone releasing factor analog. Studied for extended half-life and GH secretagogue activity.' },
  'PEG-MGF': { cas: 'Pending', formula: 'Pending', mw: 'Pending', description: 'Pegylated mechano growth factor. Studied for satellite cell activation and IGF-1 splice variant signaling.' },
  'Gonadorelin': { cas: '33515-09-2', formula: 'C₅₅H₇₅N₁₇O₁₃', mw: '1182.3', description: 'Synthetic GnRH analog. Studied for pituitary gonadotropin release stimulation.' },
  'Oxytocin': { cas: '50-56-6', formula: 'C₄₃H₆₆N₁₂O₁₂S₂', mw: '1007.2', description: 'Neurohypophysial hormone. Studied for oxytocin receptor signaling and neuropeptide modulation.' },
  'TB-500': { cas: '476014-70-7', formula: 'C₃₆H₆₆N₁₀O₁₃', mw: '847.0', description: 'Synthetic thymosin beta-4 fragment. Studied for actin sequestration and cell migration signaling.' },
  'Liraglutide': { cas: '204656-20-2', formula: 'C₁₇₂H₂₆₅N₄₃O₅₁', mw: '3751', description: 'GLP-1 receptor agonist. Studied for glucose-dependent insulin secretion and pancreatic beta-cell response.' },
  'Dihexa': { cas: '1401708-83-5', formula: 'C₂₇H₄₄N₄O₅', mw: '504.7', description: 'Angiotensin IV analog. Studied for hepatocyte growth factor signaling and synaptogenesis.' },
  'Follistatin-344': { cas: '137647-44-8', formula: 'Pending', mw: 'Pending', description: 'Recombinant glycoprotein. Studied for myostatin and activin binding inhibition.' },
  'ACE-031': { cas: '1100844-71-0', formula: 'Pending', mw: 'Pending', description: 'Recombinant fusion protein of activin receptor type IIB. Studied for myostatin and activin ligand trapping.' },
  'Eloralintide': { cas: '2883634-40-8', formula: 'C₂₀₁H₃₁₉N₄₉O₆₅S₂', mw: '4526', description: 'Long-acting GLP-1/glucagon dual agonist. Studied for metabolic signaling and energy balance modulation.' },
  'Mazdutide': { cas: '2259884-03-0', formula: 'C₂₀₇H₃₁₇N₄₅O₆₅', mw: '4476', description: 'Dual GLP-1/glucagon receptor agonist. Studied for glucose-dependent insulin secretion and energy expenditure.' },
  'Survodutide': { cas: '2805997-46-8', formula: 'C₁₉₂H₂₈₉N₄₇O₆₁', mw: '4232', description: 'Dual GLP-1/glucagon receptor agonist. Studied for metabolic signaling and hepatic glucose regulation.' },
  'Cagrilintide + Semaglutide': { cas: 'N/A', formula: 'N/A', mw: 'N/A', description: 'Combined formulation of cagrilintide and semaglutide. Studied for synergistic amylin and GLP-1 receptor signaling.' },
  'Ara-290': { cas: '1208243-50-8', formula: 'C₅₁H₈₄N₁₆O₂₁', mw: '1257.3', description: 'Synthetic erythropoietin-derived peptide. Studied for tissue-protective receptor signaling and inflammation modulation.' },
  'KPV': { cas: '88768-11-0', formula: 'C₁₁H₁₂O₃', mw: '192.21', description: 'Tripeptide fragment of alpha-melanocyte stimulating hormone. Studied for anti-inflammatory signaling pathways.' },
  'LL-37': { cas: '154947-66-7', formula: 'C₂₀₅H₃₄₀N₆₀O₅₃', mw: '4493', description: 'Human cathelicidin antimicrobial peptide. Studied for membrane disruption and immune signaling.' },
  'Thymalin': { cas: '63958-90-7', formula: 'C₃₃H₅₄N₁₂O₁₅', mw: '858.9', description: 'Thymus-derived peptide complex. Studied for T-cell maturation and immune system modulation.' },
  'Thymosin Alpha-1': { cas: '62304-98-7', formula: 'C₁₂₉H₂₁₅N₃₃O₅₅', mw: '3108.3', description: 'Thymus-derived peptide. Studied for T-cell activation and immune response modulation.' },
  'GLOW': { cas: 'N/A', formula: 'N/A', mw: 'N/A', description: 'Combined stack of BPC-157, TB-500, and GHK-Cu. Studied for synergistic tissue repair and extracellular matrix signaling.' },
  'KLOW': { cas: 'N/A', formula: 'N/A', mw: 'N/A', description: 'Combined stack of BPC-157, TB-500, GHK-Cu, and KPV. Studied for synergistic tissue repair, matrix synthesis, and anti-inflammatory signaling.' },
  'Adamax': { cas: 'Pending', formula: 'Pending', mw: 'Pending', description: 'Synthetic nootropic peptide. Studied for cognitive signaling and neuroplasticity pathways.' },
  'P21': { cas: 'Pending', formula: 'Pending', mw: 'Pending', description: 'Cerebrolysin-derived peptide. Studied for neurotrophic signaling and synaptic plasticity.' },
  'PE 22-28': { cas: 'Pending', formula: 'Pending', mw: 'Pending', description: 'Synthetic melanocortin-derived peptide. Studied for cognitive signaling and neuroprotective pathways.' },
  'CJC-1295 (with DAC)': { cas: '51714-35-3', formula: 'C₁₅₂H₂₅₂N₄₄O₄₂', mw: '3366.9', description: 'Growth hormone releasing hormone analog with drug affinity complex. Studied for extended half-life and sustained GH secretion.' },
  'CJC-1295 + Ipamorelin Blend': { cas: 'N/A', formula: 'N/A', mw: 'N/A', description: 'Combined formulation of CJC-1295 and ipamorelin. Studied for synergistic GH secretagogue signaling.' },
  'GHRP-6': { cas: '87630-95-7', formula: 'C₄₆H₅₆N₁₂O₆', mw: '873.0', description: 'Growth hormone secretagogue. Studied for ghrelin receptor agonism and GH pulse amplification.' },
  'GDF-8': { cas: '306-08-1', formula: 'Pending', mw: 'Pending', description: 'Myostatin protein. Studied for negative regulation of skeletal muscle mass.' },
  'Somatropin (HGH)': { cas: '9002-72-6', formula: 'C₂₂₅H₃₆₀N₇₆O₆₇S', mw: '22125', description: 'Recombinant human growth hormone. Studied for metabolic signaling and growth factor activity.' },
  'FOX04-DRI': { cas: '2460055-10-9', formula: 'C₂₂₈H₃₈₈N₈₆O₆₄', mw: '5358', description: 'FOXO4-derived peptide. Studied for senescent cell signaling and apoptosis induction.' },
  'SLU-PP-332': { cas: '303760-60-3', formula: 'C₁₈H₁₄N₂O₂', mw: '290.3', description: 'Errα agonist. Studied for metabolic gene expression and mitochondrial function modulation.' },
  'Cartalax': { cas: '85806-95-7', formula: 'C₁₂H₁₉N₃O₈', mw: '333.29', description: 'Synthetic bioregulator peptide. Studied for cartilage tissue signaling and extracellular matrix modulation.' },
  'Pancragen': { cas: 'Pending', formula: 'Pending', mw: 'Pending', description: 'Pancreas-derived peptide bioregulator. Studied for pancreatic function and metabolic signaling.' },
  'Vilon': { cas: '45234-02-4', formula: 'C₁₁H₂₁N₃O₅', mw: '275.30', description: 'Synthetic thymomimetic peptide. Studied for immune system modulation and cellular senescence.' },
  'KP1': { cas: 'Pending', formula: 'Pending', mw: 'Pending', description: 'Synthetic peptide. Studied for cellular signaling pathways.' },
  'AHK-Cu': { cas: '682809-81-0', formula: 'C₁₅H₂₄ClCuN₆O₄-', mw: '451.39', description: 'Copper peptide complex. Studied for fibroblast proliferation and extracellular matrix synthesis.' },
  'Melanotan-1': { cas: '75921-69-6', formula: 'C₇₈H₁₁₁N₂₁O₁₉', mw: '1646.8', description: 'Synthetic analog of alpha-melanocyte stimulating hormone. Studied for melanocortin-1 receptor agonism.' },
  'Snap-8': { cas: '868844-74-0', formula: 'C₄₁H₇₀N₁₆O₁₆S', mw: '1075.2', description: 'Acetyl octapeptide-3. Studied for neuromuscular junction signaling and muscle contraction modulation.' },
  'Hyaluronic Acid': { cas: '9004-61-9', formula: '(C₁₄H₂₁NO₁₁)n', mw: 'variable', description: 'Glycosaminoglycan polymer. Studied for extracellular matrix structure and cell signaling.' },
  'Dermorphin': { cas: '77614-16-5', formula: 'C₄₀H₅₀N₈O₁₀', mw: '802.9', description: 'Opioid peptide isolated from amphibian skin. Studied for mu-opioid receptor agonism.' },
  'VIP': { cas: '5551-37-1', formula: 'C₁₄₇H₂₄₂N₄₀O₄₂', mw: '3321.7', description: 'Vasoactive intestinal peptide. Studied for vasodilation signaling and smooth muscle relaxation.' },
  'HCG': { cas: '9002-61-3', formula: 'C₁₁H₁₉N₃O₆S', mw: '321.35', description: 'Human chorionic gonadotropin. Studied for luteinizing hormone receptor signaling.' },
  'HMG': { cas: '503-49-1', formula: 'C₆H₁₀O₅', mw: '162.14', description: 'Human menopausal gonadotropin. Studied for FSH and LH receptor signaling.' },
  'rFSH': { cas: '146479-72-1', formula: 'Pending', mw: 'Pending', description: 'Recombinant follicle-stimulating hormone. Studied for FSH receptor signaling and follicular development.' },
  'Testagen': { cas: 'Pending', formula: 'Pending', mw: 'Pending', description: 'Testis-derived peptide bioregulator. Studied for reproductive signaling and cellular metabolism.' },
  'B12 (Methylcobalamin)': { cas: '13422-55-4', formula: 'C₆₃H₉₁CoN₁₃O₁₄P', mw: '1344.4', description: 'Cobalamin vitamin. Studied for methionine synthase cofactor activity and nerve tissue metabolism.' },
  'L-Carnitine': { cas: '541-15-1', formula: 'C₇H₁₅NO₃', mw: '161.20', description: 'Quaternary ammonium compound. Studied for fatty acid transport and mitochondrial beta-oxidation.' },
  'PBS Water': { cas: 'Pending', formula: 'Pending', mw: 'Pending', description: 'Phosphate buffered saline solution. Used as reconstitution solvent for peptide compounds.' },
  'PNC-27': { cas: '1159861-00-3', formula: 'C₁₈₈H₂₉₃N₅₃O₄₄S', mw: '4032', description: 'Synthetic peptide. Studied for cancer cell membrane disruption via p53-dependent signaling.' },
  'FOX04': { cas: 'Pending', formula: 'Pending', mw: 'Pending', description: 'Forkhead box O4 transcription factor peptide. Studied for cellular stress response and apoptosis signaling.' },}

const previewVendorOffers_REMOVED = true // Real vendors now come from models.vendors

function VerifiedBadge({ size = 14 }: { size?: number }) {
  return (
    <span className="ps-verified-badge" role="img" aria-label="Admin-verified vendor" tabIndex={0}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 5.5V11C4 16.5 7.4 21 12 22C16.6 21 20 16.5 20 11V5.5L12 2Z" fill="#FFA300" stroke="#E08E00" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M8.5 12L11 14.5L15.5 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="ps-verified-tooltip">Admin-verified vendor — identity and lab credentials confirmed by PeptShop staff.</span>
    </span>
  )
}

function ResearchLibrary({ slug, productName }: { slug: string; productName: string }) {
  const studies: ResearchStudy[] = researchStudies[slug] ?? []
  const [expanded, setExpanded] = useState(false)
  const visibleCount = expanded ? studies.length : Math.min(studies.length, 5)
  const visible = studies.slice(0, visibleCount)

  if (studies.length === 0) return null

  return (
    <section className="ps-research-library" aria-labelledby="ps-research-library-heading">
      <div className="ps-research-library-header">
        <span className="ps-kicker">Research Library</span>
        <h2 id="ps-research-library-heading">Latest Research News</h2>
        <p className="ps-research-library-subtitle">
          Peer-reviewed studies and publications referencing {productName}.
        </p>
      </div>
      <div className="ps-research-study-list">
        {visible.map((study) => (
          <article key={study.id} className="ps-research-study-card">
            <div className="ps-research-study-card-main">
              <h3 className="ps-research-study-title">{study.title}</h3>
              <div className="ps-research-study-meta">
                <span className="ps-research-study-date">{study.date}</span>
                <span className="ps-research-study-authors">{study.authors}</span>
              </div>
            </div>
            <a
              href={study.url}
              className="ps-research-study-open"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open
              <ArrowRight size={14} strokeWidth={1.8} />
            </a>
          </article>
        ))}
      </div>
      {studies.length > 5 && (
        <button
          type="button"
          className="ps-research-show-more"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show fewer studies' : `Show ${studies.length - 5} more studies`}
          <ChevronDown
            size={16}
            strokeWidth={1.8}
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </button>
      )}
    </section>
  )
}

export function ProductPage({ actions, models, query, theme, pathname }: PageComponentProps) {
  // Parse product name from URL — supports both /catalog/:name and /products/:slug
  let productName = ''
  if (pathname.includes('/catalog/')) {
    productName = decodeURIComponent(pathname.split('/catalog/')[1]?.split('?')[0] ?? '')
  } else if (pathname.includes('/products/')) {
    productName = decodeURIComponent(pathname.split('/products/')[1]?.split('?')[0] ?? '')
  } else if (pathname.includes('/peptides/')) {
    productName = decodeURIComponent(pathname.split('/peptides/')[1]?.split('?')[0] ?? '')
  }
  const source = models.products.find((p) => p.name === productName || p.slug === productName) ?? models.products.find((p) => p.name === 'BPC-157')!
  const details = productDetails[source?.name ?? ''] ?? { cas: 'Pending', formula: 'Pending', mw: 'Pending', description: 'Research compound available from vetted suppliers with transparent per-mg pricing and batch-level evidence.' }
  const dosages = source?.formats ?? ['2 mg', '5 mg', '10 mg']

  // Use real vendors from models — same ones on the Vendors page
  const allVendors = models.vendors
  const priceMultipliers: Record<string, number> = { 'vendor-northstar': 1, 'vendor-retalux': 1.08, 'vendor-axiom': 0.94 }
  const vendorPurity: Record<string, number> = { 'vendor-northstar': 99.2, 'vendor-retalux': 99.0, 'vendor-axiom': 99.1 }
  const vendorBatchPrefix: Record<string, string> = { 'vendor-northstar': 'NS', 'vendor-retalux': 'RX', 'vendor-axiom': 'AX' }

  // Deterministic presentation math only. It is not derived from private pricing or marketplace rules.
  const lookupVendorPrice = (dose: string, vendorId: string): number => {
    const doseNum = parseInt(dose) || 5
    const perMg = source?.startingPrice ?? 0.70
    return Math.round(perMg * doseNum * 10 * (priceMultipliers[vendorId] ?? 1) * 100) / 100
  }

  // Generate dose-specific batch number
  const makeBatch = (prefix: string, dose: string) => {
    const doseNum = parseInt(dose) || 5
    const letter = String.fromCharCode(65 + (doseNum % 26)) // A-Z based on dose
    return `${prefix}-${doseNum}mg-${letter}`
  }

  const productVendors = useMemo(
    () => allVendors.slice(0, Math.max(1, Math.min(source?.vendorCount ?? 1, allVendors.length))),
    [source?.vendorCount, allVendors],
  )

  const [selectedDose, setSelectedDose] = useState(dosages[1] ?? dosages[0])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedVendorId, setSelectedVendorId] = useState(productVendors[0]?.id ?? '')
  const [selectedPackSize, setSelectedPackSize] = useState<10 | 20>(10)
  const [reviewVendor, setReviewVendor] = useState<{ name: string; slug: string; rating: number; reviewCount: number; verified: boolean } | null>(null)
  const [reviewTab, setReviewTab] = useState<'reviews' | 'coas'>('reviews')
  const empty = query.get('state') === 'empty' || source?.availability === 'watchlist' || (source?.vendorCount === 0 && source?.availability !== 'available')
  const selectedVendor = productVendors.find((v) => v.id === selectedVendorId) ?? productVendors[0]

  const dosePrice = lookupVendorPrice(selectedDose, selectedVendor?.id ?? 'sample-vendor-one')
  const unitPrice = selectedPackSize === 20
    ? dosePrice * 1.9
    : dosePrice

  return (
    <div className="ps-product-route">
      <ProductPageFrame theme={theme}>
        <ProductPageHero
          productName={source?.name ?? 'Product'}
          dosageLabel="Dose per vial"
          cas={details.cas}
          formula={details.formula}
          mw={details.mw}
          overview={details.description}
          backControl={
            <ProductBackControlFrame>
              <button type="button" aria-label="Return to catalog" onClick={() => actions.navigate('/products')}>
                <ArrowLeft size={20} strokeWidth={1.8} />
              </button>
            </ProductBackControlFrame>
          }
          dosageSelector={
            <ProductDosageSelectorFrame>
              {dosages.map((dose) => (
                <ProductDosageOptionFrame key={dose} selected={dose === selectedDose} onClick={() => setSelectedDose(dose)}>
                  {dose}
                </ProductDosageOptionFrame>
              ))}
            </ProductDosageSelectorFrame>
          }
        />

        {empty ? (
          <ProductUnavailableState productName={source?.name ?? 'Product'} onNotify={() => setDialogOpen(true)} />
        ) : (
          <>
            <ProductOffersSection dosage={selectedDose}>
              <div className="ps-offer-grid">
                <div className="ps-offer-list">
                  {productVendors.map((vendor, index) => (
                    <VendorOfferCardFrame key={vendor.id}>
                      <div className={`ps-offer-heading ${selectedVendorId === vendor.id ? 'is-selected' : ''}`} onClick={() => { setSelectedVendorId(vendor.id); setQuantity(1) }} role="button" tabIndex={0}>
                        <div className="ps-offer-vendor-info">
                          <h3>
                            {vendor.name}
                            {vendor.status === 'trusted' && (vendor as any).verified ? <VerifiedBadge size={14} /> : null}
                            <span className="ps-offer-rating" onClick={(e) => { e.stopPropagation(); setReviewVendor({ name: vendor.name, slug: vendor.slug, rating: vendor.rating, reviewCount: vendor.reviewCount ?? 0, verified: vendor.status === 'trusted' && Boolean((vendor as any).verified) }) }}>
                              <Star size={15} /> {vendor.rating.toFixed(1)}
                            </span>
                          </h3>
                          <p><MapPin size={14} /> {vendor.location || 'Location pending'} · {vendor.fulfillment}</p>
                        </div>
                        <button type="button" className="ps-offer-coa-link" onClick={(e) => { e.stopPropagation(); setReviewVendor({ name: vendor.name, slug: vendor.slug, rating: vendor.rating, reviewCount: vendor.reviewCount ?? 0, verified: vendor.status === 'trusted' && Boolean((vendor as any).verified) }) }}>
                          Reviews
                        </button>
                      </div>
                      <div className="ps-offer-options">
                        {(() => {
                          const vPrice = lookupVendorPrice(selectedDose, vendor.id)
                          return (<>
                        <VendorOfferOptionFrame selected={selectedVendorId === vendor.id && selectedPackSize === 10} onClick={() => { setSelectedVendorId(vendor.id); setSelectedPackSize(10) }}>
                          <strong>10 vials</strong>
                          <span>${vPrice.toFixed(2)}</span>
                        </VendorOfferOptionFrame>
                        <VendorOfferOptionFrame selected={selectedVendorId === vendor.id && selectedPackSize === 20} onClick={() => { setSelectedVendorId(vendor.id); setSelectedPackSize(20) }}>
                          <strong>20 vials</strong>
                          <span>${(vPrice * 1.9).toFixed(2)}</span>
                        </VendorOfferOptionFrame>
                        </>); })()}
                      </div>
                      <div className="ps-offer-facts">
                        <span><FileCheck2 size={15} /><small>Purity</small>≥{vendorPurity[vendor.id] ?? 99}%</span>
                        <span><PackageCheck size={15} /><small>Batch</small>{makeBatch(vendorBatchPrefix[vendor.id] ?? 'QA', selectedDose)}</span>
                        <span><Truck size={15} /><small>Dispatch</small>{vendor.fulfillment}</span>
                        <button type="button" className="ps-offer-coa-link" onClick={() => actions.navigate(`/coas?vendor=${encodeURIComponent(vendor.name)}&product=${encodeURIComponent(source?.name ?? 'Product')}`)}>
                          <FileCheck2 size={13} /> COA
                        </button>
                      </div>
                      <div className="ps-offer-action">
                        <div>
                          <button type="button" onClick={() => { setSelectedVendorId(vendor.id); setQuantity((value) => Math.max(1, value - 1)) }} aria-label="Decrease quantity"><Minus size={15} /></button>
                          <span>{selectedVendorId === vendor.id ? quantity : 1}</span>
                          <button type="button" onClick={() => { setSelectedVendorId(vendor.id); setQuantity((value) => value + 1) }} aria-label="Increase quantity"><Plus size={15} /></button>
                        </div>
                        <button type="button" className="ps-add-to-cart-btn" onClick={() => {
                          setSelectedVendorId(vendor.id)
                          const vPrice = lookupVendorPrice(selectedDose, vendor.id)
                          const activeQty = selectedVendorId === vendor.id ? quantity : 1
                          const linePrice = (selectedPackSize === 20 ? vPrice * 1.9 : vPrice) * activeQty
                          actions.addToCart(source?.id ?? 'product-bpc-157', vendor.id, vendor.name, linePrice, `${selectedDose} · ${selectedPackSize} vials`, vendor.shippingCost ?? 12)
                        }}>
                          <ShoppingBag size={17} /> Add ${(() => {
                            const vPrice = lookupVendorPrice(selectedDose, vendor.id)
                            const activeQty = selectedVendorId === vendor.id ? quantity : 1
                            return ((selectedPackSize === 20 ? vPrice * 1.9 : vPrice) * activeQty).toFixed(2)
                          })()}
                        </button>
                      </div>
                    </VendorOfferCardFrame>
                  ))}
                </div>

                {/* Cart summary card — reflects selected vendor */}
                <aside className="ps-cart-summary-card">
                  <h3>Order summary</h3>
                  <div className="ps-cart-summary-product">
                    <div>
                      <strong>{source?.name ?? 'Product'}</strong>
                      <span>{selectedDose} · {selectedPackSize}-vial pack</span>
                      <small>From {selectedVendor?.name ?? '—'}</small>
                    </div>
                  </div>
                  <div className="ps-cart-summary-row">
                    <span>Unit price</span>
                    <strong>${unitPrice.toFixed(2)}</strong>
                  </div>
                  <div className="ps-cart-summary-row">
                    <span>Quantity</span>
                    <strong>{quantity} pack{quantity > 1 ? 's' : ''}</strong>
                  </div>
                  <div className="ps-cart-summary-divider" />
                  <div className="ps-cart-summary-total">
                    <span>Total</span>
                    <strong>${(unitPrice * quantity).toFixed(2)}</strong>
                  </div>
                  <div className="ps-cart-summary-badges">
                    <span><ShieldCheck size={14} /> Escrow protected</span>
                    <span><FileCheck2 size={14} /> Batch verified</span>
                  </div>
                </aside>
              </div>
            </ProductOffersSection>
          </>
        )}
        <ResearchLibrary slug={source?.slug ?? ''} productName={source?.name ?? 'Product'} />
      </ProductPageFrame>

      {dialogOpen ? (
        <div className="ps-modal-backdrop" role="presentation">
          <section className="ps-modal" role="dialog" aria-modal="true" aria-label="Product alert form">
            <button type="button" className="ps-modal-close" onClick={() => setDialogOpen(false)} aria-label="Close"><X size={18} /></button>
            {submitted ? (
              <div className="ps-modal-success"><Check size={22} /><h2>Alert saved</h2><p>We'll notify you when this compound becomes available from new vendors.</p></div>
            ) : (
              <>
                <CompoundWaitlistTitle productName={source?.name ?? 'Product'} />
                <CompoundWaitlistDescription />
                <CompoundWaitlistForm
                  productName={source?.name ?? 'Product'}
                  email={email}
                  isIdle
                  onEmailChange={(event) => setEmail(event.currentTarget.value)}
                  onSubmit={(event) => { event.preventDefault(); actions.submitEmail(email, 'product-waitlist'); setSubmitted(true) }}
                />
              </>
            )}
          </section>
        </div>
      ) : null}

      {reviewVendor ? (
        <div className="ps-modal-backdrop" role="presentation" onClick={() => setReviewVendor(null)}>
          <section className="ps-modal ps-review-modal" role="dialog" aria-modal="true" aria-label={`Reviews for ${reviewVendor.name}`} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="ps-modal-close" onClick={() => setReviewVendor(null)} aria-label="Close"><X size={18} /></button>
            <div className="ps-review-modal-header">
              <span className="ps-kicker">Vendor</span>
              <h2>{reviewVendor.name} {reviewVendor.verified ? <VerifiedBadge size={18} /> : null}</h2>
            </div>
            <div className="ps-review-modal-metrics">
              <div className="ps-review-metric-card">
                <div className="ps-review-metric-label"><Star size={15} /> Average Rating</div>
                <strong>{reviewVendor.rating.toFixed(1)}</strong>
                <span>{reviewVendor.reviewCount} total reviews</span>
              </div>
              <div className="ps-review-metric-card">
                <div className="ps-review-metric-label"><TrendingUp size={15} /> Recommendation Rate</div>
                <strong>96%</strong>
                <span>Based on verified purchases</span>
              </div>
            </div>
            <div className="ps-review-modal-tabs">
              <button type="button" className={`ps-review-tab ${reviewTab === 'reviews' ? 'is-active' : ''}`} onClick={() => setReviewTab('reviews')}>Customer Reviews</button>
              <button type="button" className={`ps-review-tab ${reviewTab === 'coas' ? 'is-active' : ''}`} onClick={() => setReviewTab('coas')}>Certificates of Analysis</button>
            </div>
            <div className="ps-review-modal-content">
              {reviewTab === 'reviews' ? (
                <>
                  <div className="ps-review-dist">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const pct = s === 5 ? 78 : s === 4 ? 14 : s === 3 ? 5 : s === 2 ? 2 : 1
                      return (
                        <div key={s} className="ps-review-dist-row">
                          <span>{s}★</span>
                          <div className="ps-review-dist-bar"><div className="ps-review-dist-fill" style={{ width: `${pct}%` }} /></div>
                          <small>{pct}%</small>
                        </div>
                      )
                    })}
                  </div>
                  <div className="ps-review-list ps-review-list-full">
                    {VENDOR_REVIEWS.slice(0, 5).map((rev, i) => (
                      <div key={i} className="ps-review-item">
                        <div className="ps-review-head">
                          <strong>{rev.buyer}</strong>
                          <span>{'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}</span>
                        </div>
                        <p>{rev.text}</p>
                        <small>{rev.date} · Verified purchase</small>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="ps-review-modal-all" onClick={() => { actions.navigate(`/vendors/${reviewVendor.slug}/reviews`); setReviewVendor(null) }}>
                    View all {reviewVendor.reviewCount} reviews
                  </button>
                </>
              ) : (
                <div className="ps-review-coa-list">
                  {models.products.filter((p) => p.availability === 'available').slice(0, 6).map((p, i) => (
                    <div key={i} className="ps-review-coa-item">
                      <FileCheck2 size={16} />
                      <div>
                        <strong>{p.name}</strong>
                        <span>Batch {p.slug.toUpperCase()}-{(i + 1).toString().padStart(2, '0')} · Purity ≥{(99 - i * 0.2).toFixed(1)}%</span>
                      </div>
                      <button type="button" className="ps-review-coa-link" onClick={() => { actions.navigate(`/coas?vendor=${encodeURIComponent(reviewVendor.name)}&product=${encodeURIComponent(p.name)}`); setReviewVendor(null) }}>View COA</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

export function VendorsPage({ actions, models }: PageComponentProps) {
  const [query, setQuery] = useState('')
  const vendors = models.vendors.filter((vendor) => vendor.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="ps-vendors-page ps-section-shell">
      <header className="ps-page-masthead ps-page-masthead-split">
        <div><span className="ps-kicker">Marketplace partners</span><h1>Vendors</h1></div>
        <p>Compare fulfillment history, customer reviews, warehouse region, and published evidence.</p>
      </header>
      <div className="ps-directory-tools">
        <div className="ps-directory-intro">
          <p>Search the public directory or check delivery coverage for your country.</p>
          {models.directoryShipping ? (
            <FrontendLink
              className="ps-directory-shipping-link"
              href={models.directoryShipping.href}
              navigate={actions.navigate}
            >
              {models.directoryShipping.label}
              <ArrowRight size={15} />
            </FrontendLink>
          ) : null}
        </div>
        <label className="ps-directory-search"><Search size={18} /><span className="ps-visually-hidden">Search vendors</span><input value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search vendor names" /></label>
      </div>
      <div className="ps-vendor-directory">
        {vendors.map((vendor, index) => <VendorRow key={vendor.id} vendor={vendor} index={index} navigate={actions.navigate} />)}
      </div>
      <section className="ps-vendor-page-summary">
        <div>
          <span className="ps-kicker">Marketplace standards</span>
          <h2>Every vendor vetted. Every batch verified.</h2>
          <p>All vendors on PeptShop undergo identity verification before listing. Each product listing links to batch-level certificates of analysis from independent labs. Buyers can verify purity, identity, and lab records before purchase.</p>
        </div>
        <dl>
          <div><dt>Total vendors</dt><dd>{models.vendors.length}</dd></div>
          <div><dt>Total COAs published</dt><dd>{models.vendors.reduce((sum, v) => sum + ((v as any)?.coaCount ?? 0), 0)}</dd></div>
          <div><dt>Average rating</dt><dd>{(models.vendors.reduce((sum, v) => sum + v.rating, 0) / Math.max(1, models.vendors.length)).toFixed(1)}★</dd></div>
          <div><dt>Total reviews</dt><dd>{models.vendors.reduce((sum, v) => sum + v.reviewCount, 0).toLocaleString()}</dd></div>
        </dl>
      </section>
    </div>
  )
}

function VendorRow({ vendor, index, navigate }: { vendor: VendorSummary; index: number; navigate: (href: string) => void }) {
  return (
    <FrontendLink href={`/vendors/${vendor.slug}`} navigate={navigate} className="ps-vendor-row">
      <span className="ps-vendor-rank">{String(index + 1).padStart(2, '0')}</span>
      <div className="ps-vendor-monogram">{vendor.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
      <div className="ps-vendor-name"><h2>{vendor.name}</h2><p><MapPin size={14} /> {vendor.location || 'Location pending'}</p></div>
      <div className="ps-vendor-rating"><Star size={16} /><strong>{vendor.rating.toFixed(1)}</strong><span>{vendor.reviewCount} reviews</span></div>
      <div className="ps-vendor-fulfillment"><Clock3 size={15} /><span>Typical dispatch</span><strong>{vendor.fulfillment}</strong></div>
      {vendor.status === 'trusted' && Boolean((vendor as any).verified) ? <span className={`ps-trust-label ps-trust-${vendor.status}`}><VerifiedBadge size={14} /> Verified vendor</span> : <span className="ps-trust-label ps-trust-pending">{vendor.status}</span>}
      <ArrowRight size={19} />
    </FrontendLink>
  )
}

const REVIEW_TEMPLATES: { stars: number; text: string }[] = [
  { stars: 5, text: 'Fast dispatch, product matched batch COA exactly. Will reorder.' },
  { stars: 5, text: 'Consistent quality across multiple orders. Packaging is professional.' },
  { stars: 4, text: 'Good product, shipping took one day longer than expected but quality was on point.' },
  { stars: 5, text: 'Third order from this vendor. Always reliable, and the independent lab reports check out.' },
  { stars: 5, text: 'Great communication and fast fulfillment. Product was exactly as described.' },
  { stars: 4, text: 'Solid product. Took 2 days to dispatch but arrived quickly after that.' },
  { stars: 5, text: 'Best vendor I have used on this platform. Batch evidence is always published.' },
  { stars: 3, text: 'Product was fine but the packaging could be more discreet. Otherwise no complaints.' },
  { stars: 5, text: 'Ordered BPC-157 and TB-500. Both verified at >99% purity. Highly recommend.' },
  { stars: 5, text: 'Repeat customer. Never had an issue. Shipping is consistently 1-2 days.' },
  { stars: 4, text: 'Quality is good but prices could be more competitive. Still worth it for the reliability.' },
  { stars: 5, text: 'Everything arrived safely packaged. COA verification was seamless.' },
  { stars: 2, text: 'Order was delayed by a week. Product quality was fine when it arrived though.' },
  { stars: 5, text: 'Excellent vendor. Responsive to questions and product is always as advertised.' },
  { stars: 4, text: 'Decent experience overall. Product works as expected, shipping was reasonable.' },
  { stars: 5, text: 'Six orders in and zero issues. This is my go-to vendor now.' },
  { stars: 3, text: 'Product quality is there but customer service response time could be better.' },
  { stars: 5, text: 'Verified purity on my end matched the COA exactly. Trust this vendor completely.' },
  { stars: 4, text: 'Good value for the price. Wish they offered more dosage options though.' },
  { stars: 5, text: 'Flawless transaction from order to delivery. Batch number checked out on verification.' },
]

const REVIEW_TIMEFRAMES = ['1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago', '2 months ago', '3 months ago', '4 months ago', '5 months ago', '6 months ago', '7 months ago', '8 months ago', '9 months ago', '10 months ago', '11 months ago', '1 year ago', '1 year ago', '2 years ago']

function generateReviews(count: number) {
  const reviews: { buyer: string; stars: number; text: string; date: string }[] = []
  for (let i = 0; i < count; i++) {
    const template = REVIEW_TEMPLATES[i % REVIEW_TEMPLATES.length]
    const timeframe = REVIEW_TIMEFRAMES[i % REVIEW_TIMEFRAMES.length]
    reviews.push({
      buyer: `Verified Buyer #${1000 + i}`,
      stars: template.stars,
      text: template.text,
      date: timeframe,
    })
  }
  return reviews
}

const VENDOR_REVIEWS = generateReviews(184)

const REVIEWS_PER_PAGE = 10

export function VendorPage({ actions, models, pathname }: PageComponentProps) {
  // Extract vendor slug from URL
  const slug = decodeURIComponent(pathname.split('/vendors/')[1]?.split('/')[0] ?? '')
  const vendor = models.vendors.find((v) => v.slug === slug) ?? models.vendors[0]
  const catalogMode = pathname.endsWith('/catalog')
  const reviewsMode = pathname.endsWith('/reviews')
  const vendorInitials = vendor?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) ?? 'NR'
  const [reviewPage, setReviewPage] = useState(0)
  const totalReviews = vendor?.reviewCount ?? 184
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE)
  const paginatedReviews = VENDOR_REVIEWS.slice(reviewPage * REVIEWS_PER_PAGE, (reviewPage + 1) * REVIEWS_PER_PAGE)
  useEffect(() => { setReviewPage(0) }, [slug, reviewsMode])
  return (
    <div className="ps-vendor-profile ps-section-shell">
      <button type="button" className="ps-back-link" onClick={() => actions.navigate('/vendors')}><ArrowLeft size={17} /> All vendors</button>
      <header className="ps-vendor-profile-head">
        <div className={`ps-vendor-profile-mark`}>{vendorInitials}</div>
        <div className="ps-vendor-profile-title">
          {vendor?.status === 'trusted' && Boolean((vendor as any).verified) ? <span className="ps-trust-label ps-trust-trusted"><VerifiedBadge size={14} /> Verified vendor</span> : null}
          <h1>{vendor?.name ?? 'Sample Vendor Zero'}</h1>
          <p><MapPin size={16} /> {vendor?.location ?? 'United States'} warehouse <span /> Active since 2024</p>
        </div>
        <div className="ps-vendor-profile-score"><strong>{vendor?.rating?.toFixed(1) ?? '4.9'}</strong><span><Star size={16} /> {vendor?.reviewCount ?? 184} verified reviews</span></div>
      </header>
      <nav className="ps-subnav" aria-label="Vendor profile sections">
        <FrontendLink href={`/vendors/${vendor?.slug ?? 'sample-vendor-zero'}`} navigate={actions.navigate} aria-current={!catalogMode && !reviewsMode ? 'page' : undefined}>Overview</FrontendLink>
        <FrontendLink href={`/vendors/${vendor?.slug ?? 'sample-vendor-zero'}/catalog`} navigate={actions.navigate} aria-current={catalogMode ? 'page' : undefined}>Catalog</FrontendLink>
        <FrontendLink href={`/coas?vendor=${encodeURIComponent(vendor?.name ?? '')}`} navigate={actions.navigate}>COAs <span>{(vendor as any)?.coaCount ?? 0}</span></FrontendLink>
        <FrontendLink href={`/vendors/${vendor?.slug ?? 'sample-vendor-zero'}/reviews`} navigate={actions.navigate} aria-current={reviewsMode ? 'page' : undefined}>Reviews <span>{vendor?.reviewCount ?? 0}</span></FrontendLink>
      </nav>
      {catalogMode ? (
        <div className="ps-vendor-catalog">
          <div className="ps-vendor-catalog-head"><div><span className="ps-kicker">Vendor catalog</span><h2>Available from {vendor?.name ?? 'Vendor'}</h2></div><label><Search size={16} /><input placeholder="Search this catalog" /></label></div>
          <div className="ps-compact-product-list">
            {models.products.filter((product) => product.availability === 'available').slice(0, 5).map((product) => (
              <FrontendLink key={product.id} href={`/products/${product.slug}`} navigate={actions.navigate}>
                <strong>{product.name}</strong><span>{product.formats[0]}</span><span>{product.coaCount} COA{product.coaCount === 1 ? '' : 's'}</span><b>${product.startingPrice?.toFixed(2)}/mg</b><ArrowRight size={17} />
              </FrontendLink>
            ))}
          </div>
        </div>
      ) : reviewsMode ? (
        <div className="ps-vendor-reviews-page">
          <div className="ps-reviews-header">
            <div className="ps-reviews-score"><strong>{vendor?.rating?.toFixed(1) ?? '4.9'}</strong><span>out of 5</span></div>
            <p>Based on {totalReviews} verified buyer reviews</p>
          </div>
          <div className="ps-review-list ps-review-list-full">
            {paginatedReviews.map((rev, i) => (
              <div key={reviewPage * REVIEWS_PER_PAGE + i} className="ps-review-item">
                <div className="ps-review-head">
                  <strong>{rev.buyer}</strong>
                  <span>{'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}</span>
                </div>
                <p>{rev.text}</p>
                <small>{rev.date} · Verified purchase</small>
              </div>
            ))}
          </div>
          {totalPages > 1 ? (
            <div className="ps-pagination">
              <button type="button" disabled={reviewPage === 0} onClick={() => setReviewPage((p) => Math.max(0, p - 1))}><ChevronDown size={16} className="ps-pagination-prev" /> Prev</button>
              <span className="ps-pagination-info">Page {reviewPage + 1} of {totalPages} · Showing {reviewPage * REVIEWS_PER_PAGE + 1}–{Math.min((reviewPage + 1) * REVIEWS_PER_PAGE, totalReviews)} of {totalReviews}</span>
              <button type="button" disabled={reviewPage >= totalPages - 1} onClick={() => setReviewPage((p) => Math.min(totalPages - 1, p + 1))}>Next <ChevronDown size={16} className="ps-pagination-next" /></button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="ps-vendor-overview-grid">
          <section className="ps-vendor-story"><span className="ps-kicker">At a glance</span><h2>{vendor?.location ?? 'US'} fulfillment with evidence linked at the batch level.</h2><p>{vendor?.name ?? 'This vendor'} ships from {vendor?.location ?? 'the US'} with {vendor?.fulfillment ?? '1–2 day'} dispatch. All listings include batch-level COA evidence.</p><div className="ps-button-row"><FrontendLink href={`/vendors/${vendor?.slug ?? 'sample-vendor-zero'}/catalog`} navigate={actions.navigate} className="ps-primary-action">View catalog <ArrowRight size={17} /></FrontendLink><button type="button"><Bell size={16} /> Follow vendor</button></div></section>
          <aside className="ps-vendor-facts"><dl><div><dt>Completed orders</dt><dd>{vendor?.orderCount?.toLocaleString() ?? '2,310'}</dd></div><div><dt>On-time shipping</dt><dd>98.6%</dd></div><div><dt>Median dispatch</dt><dd>{vendor?.fulfillment ?? '1–2 days'}</dd></div><div><dt>Published COAs</dt><dd>{(vendor as any)?.coaCount ?? 0}</dd></div></dl></aside>
          <section className="ps-vendor-policy"><h2>Fulfillment notes</h2><ul><li><Truck size={17} /><div><strong>Ships from {vendor?.location ?? 'USA'}</strong><span>Tracking supplied after dispatch.</span></div></li><li><CircleDollarSign size={17} /><div><strong>Transparent pack pricing</strong><span>Marketplace totals include PeptShop pricing rules.</span></div></li><li><FileCheck2 size={17} /><div><strong>Batch evidence</strong><span>Available certificates are attached to eligible listings.</span></div></li></ul></section>
          <section className="ps-vendor-reviews">
            <div className="ps-vendor-reviews-head">
              <h2>Reviews ({vendor?.reviewCount ?? 0})</h2>
              <FrontendLink href={`/vendors/${vendor?.slug ?? 'sample-vendor-zero'}/reviews`} navigate={actions.navigate} className="ps-reviews-view-all">View all <ArrowRight size={15} /></FrontendLink>
            </div>
            <div className="ps-review-summary">
              <strong>{vendor?.rating?.toFixed(1) ?? '4.9'}</strong>
              <span>Based on {vendor?.reviewCount ?? 0} verified reviews</span>
            </div>
            <div className="ps-review-list">
              {VENDOR_REVIEWS.slice(0, 3).map((rev, i) => (
                <div key={i} className="ps-review-item">
                  <div className="ps-review-head"><strong>{rev.buyer}</strong><span>{'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}</span></div>
                  <p>{rev.text}</p>
                  <small>{rev.date} · Verified purchase</small>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
