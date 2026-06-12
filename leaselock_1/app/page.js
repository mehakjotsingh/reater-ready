import Link from 'next/link'

export default function Landing() {
  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="brand">
            <span className="brand-mark">🔒</span> LeaseLock
          </div>
          <div className="nav-links">
            <a href="#features" className="hide-sm">Features</a>
            <a href="#how" className="hide-sm">How it works</a>
            <a href="#pricing" className="hide-sm">Pricing</a>
            <Link href="/app" className="btn btn-ink">Launch app</Link>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">⚡ Built for first-time renters</span>
            <h1>Don't lose your <span className="hl">deposit.</span></h1>
            <p className="hero-sub">
              LeaseLock reads your lease, documents your move-in condition, and writes your landlord messages, so the proof is on your side when it is time to get your money back.
            </p>
            <div className="hero-cta">
              <Link href="/app" className="btn btn-mint btn-lg">Protect my deposit →</Link>
              <a href="#how" className="btn btn-ghost btn-lg">See how it works</a>
            </div>
            <div className="trust-row">
              <span><b>$1,000 to $3,000</b> at stake per lease</span>
              <span className="dot" />
              <span>No account needed to start</span>
            </div>
          </div>

          <div className="demo-card">
            <div className="demo-top">
              <div className="dots"><span /><span /><span /></div>
              <span className="ttl">Lease analysis · 2BR Apartment</span>
            </div>
            <div className="demo-body">
              <div className="demo-flag flag-warn">
                <span className="ic">!</span>
                <span className="tx"><b>Cleaning fee is non refundable</b><span>$250 deducted from deposit regardless of condition.</span></span>
              </div>
              <div className="demo-flag flag-info">
                <span className="ic">i</span>
                <span className="tx"><b>60 day notice required</b><span>Move out notice must be in writing by March 1.</span></span>
              </div>
              <div className="demo-flag flag-ok">
                <span className="ic">✓</span>
                <span className="tx"><b>Normal wear and tear protected</b><span>Landlord cannot charge for ordinary use.</span></span>
              </div>
              <div className="demo-score">
                <span className="lbl">Renter readiness</span>
                <span className="pill">Ready to sign</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="strip">
        <div className="wrap strip-inner">
          <div className="stat"><div className="n">26%</div><div className="c">of renters never get their full deposit back</div></div>
          <div className="stat"><div className="n">3 min</div><div className="c">to review a full lease with LeaseLock</div></div>
          <div className="stat"><div className="n">1 place</div><div className="c">for every photo, message, and document</div></div>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="tag">The problem</span>
            <h2>Most deposit disputes are lost before move-in.</h2>
            <p>Renters sign what they do not fully understand, forget to document existing damage, and have no written record when a charge shows up months later.</p>
          </div>
          <div className="prob-grid">
            <div className="prob"><span className="ic">?</span><div><b>Confusing lease language</b><span>Fees and clauses buried in legal wording you skim and sign.</span></div></div>
            <div className="prob"><span className="ic">📷</span><div><b>No move-in proof</b><span>Random camera roll photos that do not hold up as evidence.</span></div></div>
            <div className="prob"><span className="ic">✉</span><div><b>Awkward landlord messages</b><span>Not knowing how to ask for a repair or dispute a charge in writing.</span></div></div>
            <div className="prob"><span className="ic">$</span><div><b>Surprise deductions</b><span>Money taken from your deposit with no way to push back.</span></div></div>
          </div>
        </div>
      </section>

      <section className="section" id="features" style={{ background: '#fff', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="section-head">
            <span className="tag">What you get</span>
            <h2>Three tools that build your paper trail.</h2>
            <p>Everything a renter actually needs, in one guided workflow that takes minutes.</p>
          </div>

          <div className="feat">
            <div className="feat-text">
              <div className="num">Tool 01</div>
              <h3>AI lease risk review</h3>
              <p>Paste your lease and get a plain English breakdown in seconds. We surface the fees, the dates, and the clauses worth questioning before you sign.</p>
              <ul className="feat-list">
                <li>Plain English summary of every key term</li>
                <li>Risk flags on the clauses that cost you money</li>
                <li>The exact questions to ask your landlord first</li>
              </ul>
            </div>
            <div className="feat-visual">
              <div className="fv-card"><div className="h">📄 Lease summary</div><div className="s">12 month term · $2,400/mo · $2,400 deposit</div></div>
              <div className="fv-card"><div className="h">⚠ 3 risk flags found</div><div className="s">Auto renewal, cleaning fee, late penalty</div></div>
              <div><span className="fv-chip">✓ Questions ready to send</span></div>
            </div>
          </div>

          <div className="feat">
            <div className="feat-text">
              <div className="num">Tool 02</div>
              <h3>Move-in photo protection</h3>
              <p>Walk through room by room and snap photos. Our AI looks at each one, describes the existing damage, and builds a timestamped condition report your landlord cannot argue with.</p>
              <ul className="feat-list">
                <li>Upload photos for every room</li>
                <li>AI describes the damage it sees in each photo</li>
                <li>A clean report you can save and send on day one</li>
              </ul>
            </div>
            <div className="feat-visual">
              <div className="fv-card"><div className="h">🛏 Bedroom · 4 photos</div><div className="s">Scuff on north wall, stain near closet</div></div>
              <div className="fv-card"><div className="h">🚿 Bathroom · 2 photos</div><div className="s">Cracked tile behind door logged</div></div>
              <div><span className="fv-chip">📋 Report generated</span></div>
            </div>
          </div>

          <div className="feat">
            <div className="feat-text">
              <div className="num">Tool 03</div>
              <h3>Landlord message generator</h3>
              <p>Pick your situation, describe what happened, and get a professional message ready to send. Polite, clear, and written to protect you in writing.</p>
              <ul className="feat-list">
                <li>Repairs, disputes, deposit return, and more</li>
                <li>Firm and professional, never emotional</li>
                <li>Copy and send in one tap</li>
              </ul>
            </div>
            <div className="feat-visual">
              <div className="fv-card"><div className="h">✉ Subject: Move-in damage report</div><div className="s">Hi Mr. Johnson, I am writing to document a few items I noticed during move-in...</div></div>
              <div><span className="fv-chip">✓ Ready to copy</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head">
            <span className="tag">How it works</span>
            <h2>From lease to locked in, in three steps.</h2>
          </div>
          <div className="steps">
            <div className="step"><div className="sn">1</div><h4>Review your lease</h4><p>Paste the text before you sign and know exactly what you are agreeing to.</p></div>
            <div className="step"><div className="sn">2</div><h4>Document move-in</h4><p>Photograph each room on day one and let AI log the condition for you.</p></div>
            <div className="step"><div className="sn">3</div><h4>Communicate with proof</h4><p>Send professional messages and keep every record in one place.</p></div>
          </div>
        </div>
      </section>

      <section className="section" id="pricing" style={{ background: '#fff', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="section-head" style={{ textAlign: 'center', margin: '0 auto 52px' }}>
            <span className="tag">Pricing</span>
            <h2>Protect a $2,000 deposit for $20.</h2>
            <p style={{ margin: '0 auto' }}>Start free. Upgrade once, only when you need the full protection packet.</p>
          </div>
          <div className="price-grid">
            <div className="price">
              <span className="name">Free starter</span>
              <div className="amt">$0</div>
              <div className="desc">Everything you need to get oriented before you sign.</div>
              <ul>
                <li>Basic lease summary</li>
                <li>Renter readiness score</li>
                <li>One landlord message</li>
                <li className="off">Full move-in photo report</li>
                <li className="off">Evidence locker</li>
              </ul>
              <Link href="/app" className="btn btn-ghost btn-lg">Start free</Link>
            </div>
            <div className="price featured">
              <span className="badge">Most popular</span>
              <span className="name">Renter protection packet</span>
              <div className="amt">$19.99 <small>once</small></div>
              <div className="desc">One payment, tied to the deposit you are trying to protect.</div>
              <ul>
                <li>Full AI lease risk review</li>
                <li>AI photo move-in report, all rooms</li>
                <li>Unlimited landlord messages</li>
                <li>Move-out deposit checklist</li>
                <li>Exportable evidence packet</li>
              </ul>
              <Link href="/app" className="btn btn-mint btn-lg">Get protected</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="tag">Questions</span>
            <h2>The honest answers.</h2>
          </div>
          <div className="faq-grid">
            <div className="faq"><h4>Is this legal advice?</h4><p>No. LeaseLock helps you understand your lease and document your unit. For a legal dispute, talk to a tenant rights attorney.</p></div>
            <div className="faq"><h4>Do you store my lease?</h4><p>Your lease is analyzed in the moment and is not sold or shared. The protection packet keeps your records in your own evidence locker.</p></div>
            <div className="faq"><h4>How is this different from ChatGPT?</h4><p>ChatGPT can explain a clause. LeaseLock walks you through the whole workflow and builds an organized record you can actually send.</p></div>
            <div className="faq"><h4>Will photos really help?</h4><p>Timestamped, described move-in photos are the single strongest defense against unfair deposit deductions.</p></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band">
            <h2>Move in protected.</h2>
            <p>It takes three minutes and could save you a thousand dollars.</p>
            <Link href="/app" className="btn btn-mint btn-lg">Launch LeaseLock free →</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-inner">
            <div>
              <div className="brand"><span className="brand-mark">🔒</span> LeaseLock</div>
              <p>Sign smarter. Move in protected. Get your deposit back.</p>
            </div>
            <div className="footer-cols">
              <div className="footer-col">
                <h5>Product</h5>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <Link href="/app">Launch app</Link>
              </div>
              <div className="footer-col">
                <h5>Tools</h5>
                <Link href="/app">Lease review</Link>
                <Link href="/app">Move-in report</Link>
                <Link href="/app">Landlord messages</Link>
              </div>
            </div>
          </div>
          <div className="footer-base">
            <span>© 2026 LeaseLock. A USC Marshall MOR 531 project.</span>
            <span>Built by Grant, MJ, Matthew, and Claudia.</span>
          </div>
        </div>
      </footer>
    </>
  )
}
