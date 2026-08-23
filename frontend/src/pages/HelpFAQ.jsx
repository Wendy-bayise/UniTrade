import './HelpFAQ.css';
import { useState } from 'react';

export default function HelpFAQ() {
  const [open, setOpen] = useState(1);

  const faqs = [
    { id: 1, q: "Why is UniTrade the best platform for CPUT students?", a: "We are a safe, verified marketplace only for CPUT students with @cput.ac.za emails." },
    { id: 2, q: "How does the UniTrade process work?", a: "Register with CPUT email > List item > Chat > Meet on campus to trade." },
    { id: 3, q: "What can I list on UniTrade?", a: "Textbooks, calculators, lab coats, electronics, small furniture and student essentials." },
    { id: 4, q: "How much does it cost?", a: "100% FREE. No commission." },
    { id: 5, q: "Is it safe to meetup?", a: "Yes, only verified students and we recommend meeting at library or admin during the day." },
    { id: 6, q: "What is the purpose of UniTrade?", a: "To make student life affordable and reduce waste on campus." },
  ];

  return (
    <div className="topweb-page">
      <div className="faq-header-banner">
        <h1>FAQ'S</h1>
        <p><span>Home</span> - FAQ's</p>
      </div>

      <div className="faq-main-container">
        <div className="left-col">
          <div className="dark-box">
            <h3>Ready to trade on campus?</h3>
            <p>(+27) 21 460 3000</p>
            <p>info@unitrade.cput.ac.za</p>
            <br />
            <p>Cape Peninsula University of Technology<br/>Bellville Campus, Cape Town</p>
          </div>
          <div className="form-box">
            <h4>About UniTrade</h4>
            <p style={{fontSize:'13px', lineHeight:'1.6'}}>UniTrade is an exclusive marketplace built for CPUT students. We provide a safe, verified platform where CPUT students can buy and sell textbooks, electronics, and essential student living items at affordable prices. By using only verified @cput.ac.za accounts and on-campus meetups, we eliminate scams, delivery costs, and risks.</p>
          </div>
        </div>

        <div className="right-col">
          <h2 className="freq-title">Frequently Asked any Questions</h2>
          <div className="faq-list-new">
            {faqs.map((item) => (
              <div key={item.id} className="faq-row" onClick={() => setOpen(open === item.id ? null : item.id)}>
                <div className="faq-q-new">
                  <span className={open === item.id ? "pink" : ""}>{item.id}. {item.q}</span>
                  <span>{open === item.id ? "-" : "+"}</span>
                </div>
                {open === item.id && <div className="faq-a-new">{item.a}</div>}
              </div>
            ))}
          </div>
          
          
          <div className="faq-mini-footer">
            <div className="mini-footer-grid">
              <div>
                <h4><span className="u-logo">U</span> UniTrade.</h4>
                <p>Safe, verified marketplace for CPUT students.</p>
              </div>
              <div>
                <h5>Company</h5>
                <span>FAQs</span><span>About Us</span>
              </div>
              <div>
                <h5>Contact Info</h5>
                <span>021 460 3000</span><span>info@unitrade.cput.ac.za</span>
              </div>
              <div>
                <h5>Campus Hours</h5>
                <span>Mon-Fri 08:00-18:00</span><span>Closed Sunday</span>
              </div>
            </div>
            <div className="mini-copy">
              <span>Copyright © 2026 UniTrade CPUT. All Rights Reserved.</span>
              <span>Terms | Privacy Policy</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}