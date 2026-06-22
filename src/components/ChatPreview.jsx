import React from 'react';

const ChatPreview = () => {
  return (
    <section className="demo-section">
      <div className="section-inner demo-inner">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="section-kicker" style={{ justifyContent: 'center' }}>Live Demo</div>
          <div className="section-title">See TESSA in <em>action.</em></div>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            This is how a real TESSA session begins. Notice — TESSA never explains first. It always asks first.
          </p>
        </div>

        <div className="app-mockup reveal">
          <div className="app-top">
            <div className="app-avatar">A</div>
            <div>
              <div className="app-user-name">Arjun · Class 6</div>
              <div className="app-user-sub">🔥 3-day streak · New Delhi</div>
            </div>
            <div className="xp-badge" style={{ marginLeft: 'auto' }}>⭐ 420 XP</div>
          </div>

          <div className="app-chat">
            <div className="chat-bubble chat-tessa">
              <span className="tessa-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <img src="/icons.svg" style={{ width: '14px', height: '14px', objectFit: 'contain' }} alt="robot" />
                TESSA · Probe Question — Stage 1
              </span>
              Hi Arjun! Before we explore today's topic — when you use Google Maps to find a route, do you think that's AI or just a regular program? What's your instinct?
            </div>
            <div className="chat-bubble chat-student">
              I think it's AI because it knows traffic and changes the route!
            </div>
            <div className="chat-bubble chat-tessa">
              <span className="tessa-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <img src="/icons.svg" style={{ width: '14px', height: '14px', objectFit: 'contain' }} alt="robot" />
                TESSA · Apply Level — Bloom 3
              </span>
              You've got something important right — it does adapt to traffic! Now here's a question: does a traffic light also adapt automatically? What's the difference between what the traffic light does and what Google Maps does?
            </div>
            <div className="chat-bubble chat-student">
              The traffic light just follows a timer... it doesn't actually learn anything new. But Maps learns from other drivers!
            </div>
            <div className="chat-bubble chat-tessa">
              <span className="tessa-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <img src="/icons.svg" style={{ width: '14px', height: '14px', objectFit: 'contain' }} alt="robot" />
                TESSA · Teach-Back — Bloom 5
              </span>
              Exactly! You just discovered the key difference — AI learns from data. Automation follows fixed rules. Now explain it to your Class 3 cousin in 2 sentences, without using the word "technology."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatPreview;
