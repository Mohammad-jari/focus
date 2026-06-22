import React from 'react';

const BloomTaxonomy = () => {
  return (
    <section className="bloom-section" style={{ padding: '100px 0', background: 'rgba(0,0,0,0.1)' }}>
      <div className="section-inner">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="section-kicker" style={{ justifyContent: 'center' }}>The Learning Science</div>
          <div className="section-title">Every session climbs <em>Bloom's Taxonomy</em></div>
          <p className="section-desc" style={{ margin: '0 auto 48px' }}>
            Most students study at Levels 1–2. Board exams test Levels 3–4. TESSA's job is to push every student up — automatically.
          </p>
        </div>

        <div className="curriculum-grid reveal">
          <div className="class-card cc1">
            <div className="class-num" style={{ fontSize: '24px' }}>1</div>
            <div className="class-label" style={{ color: '#fff', fontSize: '14px' }}>Remember</div>
            <div className="class-tags" style={{ color: 'var(--text-dim)' }}>Recall facts</div>
          </div>
          <div className="class-card cc2">
            <div className="class-num" style={{ fontSize: '24px' }}>2</div>
            <div className="class-label" style={{ color: '#fff', fontSize: '14px' }}>Understand</div>
            <div className="class-tags" style={{ color: 'var(--text-dim)' }}>Explain in own words</div>
          </div>
          <div className="class-card cc3">
            <div className="class-num" style={{ fontSize: '24px' }}>3</div>
            <div className="class-label" style={{ color: '#fff', fontSize: '14px' }}>Apply</div>
            <div className="class-tags" style={{ color: 'var(--text-dim)' }}>Use in new situation</div>
          </div>
          <div className="class-card cc4">
            <div className="class-num" style={{ fontSize: '24px' }}>4</div>
            <div className="class-label" style={{ color: '#fff', fontSize: '14px' }}>Analyze</div>
            <div className="class-tags" style={{ color: 'var(--text-dim)' }}>Compare and examine</div>
          </div>
          <div className="class-card cc5">
            <div className="class-num" style={{ fontSize: '24px' }}>5</div>
            <div className="class-label" style={{ color: '#fff', fontSize: '14px' }}>Evaluate</div>
            <div className="class-tags" style={{ color: 'var(--text-dim)' }}>Judge and justify</div>
          </div>
          <div className="class-card cc6">
            <div className="class-num" style={{ fontSize: '24px' }}>6</div>
            <div className="class-label" style={{ color: '#fff', fontSize: '14px' }}>Create</div>
            <div className="class-tags" style={{ color: 'var(--text-dim)' }}>Build something new</div>
          </div>
        </div>

        <div className="reveal" style={{ marginTop: '32px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', maxWidth: '240px' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--orange)', marginBottom: '4px' }}>Most students</div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Study at Levels 1–2</div>
          </div>
          <div style={{ background: 'rgba(0,198,255,0.15)', border: '1px solid rgba(0,198,255,0.3)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', maxWidth: '240px' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--cyan)', marginBottom: '4px' }}>Board exams test</div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>60% marks at Levels 3–4</div>
          </div>
          <div style={{ background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: '16px', padding: '16px 24px', textAlign: 'center', maxWidth: '240px' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--green)', marginBottom: '4px' }}>TESSA pushes everyone</div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>from Level 2 to Level 4+</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BloomTaxonomy;
