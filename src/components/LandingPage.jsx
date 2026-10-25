import civicIssuesImage from "../assets/civic-issues.png";

export default function LandingPage({ onGetStarted }) {
  const colors = {
    navy: "#173b35",
    green: "#087f5b",
    muted: "#64756e",
    background: "#f7faf8",
    border: "#e1eae4",
  };

  const section = {
    maxWidth: "1160px",
    width: "100%",
    margin: "0 auto",
    padding: "0 24px",
    boxSizing: "border-box",
  };

  const buttonPrimary = {
    border: 0,
    borderRadius: "12px",
    padding: "15px 21px",
    background: colors.green,
    color: "#fff",
    fontWeight: 750,
    fontSize: "15px",
    cursor: "pointer",
  };

  const features = [
    {
      icon: "📍",
      title: "Report a local problem",
      text: "Share details about potholes, rubbish, water leaks, broken streetlights, and other problems in public places.",
    },
    {
      icon: "🗂️",
      title: "Keep the details together",
      text: "Save the information you submit in one place, instead of losing track of it.",
    },
    {
      icon: "🔎",
      title: "Check your report later",
      text: "Return to your account to find your reports and see the status shown on the website.",
    },
  ];

  const steps = [
    ["01", "Spot a problem", "Notice something in your street or neighbourhood that needs attention."],
    ["02", "Tell us about it", "Sign in, describe the issue, and add the location details requested by the website."],
    ["03", "Keep track of it", "Find your report again and check for status updates. Local authorities are responsible for reviewing and fixing public issues."],
  ];

  return (
    <main style={{
      minHeight: "100vh",
      overflow: "hidden",
      background: colors.background,
      color: colors.navy,
      fontFamily: "Inter, Arial, sans-serif",
    }}>
      <style>{`
        @keyframes civicFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes civicFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-9px) rotate(0.4deg); }
        }
        @keyframes civicDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(7px, -8px); }
        }
        @keyframes civicPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(8,127,91,.15); }
          50% { box-shadow: 0 0 0 9px rgba(8,127,91,0); }
        }
        .civic-animate { animation: civicFadeUp 700ms cubic-bezier(.2,.7,.2,1) both; }
        .civic-delay-1 { animation-delay: 120ms; }
        .civic-delay-2 { animation-delay: 240ms; }
        .civic-delay-3 { animation-delay: 360ms; }
        .civic-float { animation: civicFloat 5s ease-in-out infinite; }
        .civic-drift { animation: civicDrift 6s ease-in-out infinite; }
        .civic-card { transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease; }
        .civic-card:hover { transform: translateY(-5px); box-shadow: 0 16px 32px rgba(23,59,53,.08); border-color: #c7ded0 !important; }
        .civic-button { transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease; }
        .civic-button:hover { transform: translateY(-2px); box-shadow: 0 9px 20px rgba(8,127,91,.2); }
        .civic-button:active { transform: scale(.98); }
        .civic-navlink { transition: color 180ms ease; }
        .civic-navlink:hover { color: ${colors.green} !important; }
        .civic-image-wrap { position: relative; isolation: isolate; }
        .civic-image-wrap::before { content: ''; position: absolute; z-index: -1; width: 75%; height: 75%; right: 5%; top: 10%; border-radius: 50%; background: #e4f3e9; filter: blur(2px); }
        .civic-image { display: block; width: 100%; height: auto; object-fit: contain; filter: drop-shadow(0 18px 22px rgba(23,59,53,.08)); }
        .civic-orbit { position: absolute; z-index: 2; display: flex; align-items: center; gap: 8px; padding: 11px 14px; border: 1px solid #dce9e0; border-radius: 14px; background: rgba(255,255,255,.96); color: ${colors.navy}; font-size: 12px; font-weight: 750; box-shadow: 0 12px 28px rgba(23,59,53,.09); }
        @media (max-width: 700px) {
          .civic-hero-grid { grid-template-columns: 1fr !important; gap: 20px !important; padding-top: 48px !important; padding-bottom: 48px !important; }
          .civic-hero-copy { text-align: left; }
          .civic-image-wrap { max-width: 540px; margin: 0 auto; }
          .civic-orbit { padding: 8px 10px; font-size: 11px; }
          .civic-header { padding-top: 14px !important; padding-bottom: 14px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
        }
        html { scroll-behavior: smooth; }
      `}</style>

      <header className="civic-header" style={{
        ...section,
        minHeight: "82px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "18px",
        flexWrap: "wrap",
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <div style={{
            width: "43px", height: "43px", display: "grid", placeItems: "center",
            borderRadius: "13px", background: colors.green, color: "white",
            fontWeight: 850, fontSize: "16px", boxShadow: "0 6px 14px rgba(8,127,91,.18)",
          }}>CF</div>
          <div>
            <div style={{ fontWeight: 850, fontSize: "21px", letterSpacing: "-0.5px" }}>
              CivicFix <span style={{ color: colors.green }}>AI</span>
            </div>
            <div style={{ color: colors.muted, fontSize: "10px", letterSpacing: "1.4px", marginTop: "2px" }}>
              BETTER COMMUNITIES START HERE
            </div>
          </div>
        </div>

        <nav aria-label="Main navigation" style={{ display: "flex", alignItems: "center", gap: "22px", flexWrap: "wrap" }}>
          <a className="civic-navlink" href="#how-it-works" style={{ color: colors.navy, textDecoration: "none", fontSize: "14px", fontWeight: 650 }}>How it works</a>
          <a className="civic-navlink" href="#features" style={{ color: colors.navy, textDecoration: "none", fontSize: "14px", fontWeight: 650 }}>What you can do</a>
          <button className="civic-button" style={buttonPrimary} onClick={onGetStarted}>Get started <span aria-hidden="true">→</span></button>
        </nav>
      </header>

      <section className="civic-hero-grid civic-animate" style={{
        ...section,
        paddingTop: "64px",
        paddingBottom: "72px",
        display: "grid",
        gridTemplateColumns: "minmax(0, .95fr) minmax(0, 1.05fr)",
        alignItems: "center",
        gap: "38px",
      }}>
        <div className="civic-hero-copy" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px", padding: "9px 13px",
            borderRadius: "999px", background: "#e4f4eb", color: colors.green,
            fontWeight: 800, fontSize: "12px", letterSpacing: ".35px", marginBottom: "22px",
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: colors.green, animation: "civicPulse 2.2s infinite" }} />
            YOUR VOICE CAN MAKE A DIFFERENCE
          </div>

          <h1 style={{
            fontSize: "clamp(40px, 5.1vw, 66px)", lineHeight: 1.04,
            letterSpacing: "-2.8px", margin: "0 0 22px", fontWeight: 850,
          }}>
            See a problem?<br />
            <span style={{ color: colors.green }}>Let’s fix it together.</span>
          </h1>

          <p style={{ fontSize: "17px", lineHeight: 1.85, color: colors.muted, maxWidth: "530px", margin: "0 0 27px" }}>
            A pothole on your road? Garbage piling up? A streetlight that isn't working? Report local civic issues, upload photos, and track progress with CivicFix AI. Help bring problems to attention and work toward cleaner, safer communities.
          </p>


          

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <button className="civic-button" style={buttonPrimary} onClick={onGetStarted}>Report a problem <span aria-hidden="true">→</span></button>
            <a className="civic-button" href="#how-it-works" style={{
              display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 18px",
              border: `1px solid ${colors.border}`, borderRadius: "12px", color: colors.navy,
              background: "rgba(255,255,255,.7)", textDecoration: "none", fontWeight: 750, fontSize: "15px",
            }}>How it works <span aria-hidden="true">↓</span></a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "25px", color: colors.muted, fontSize: "12px", lineHeight: 1.6 }}>
            <span style={{ display: "grid", placeItems: "center", width: "26px", height: "26px", flexShrink: 0, borderRadius: "50%", background: "#e4f4eb", color: colors.green, fontWeight: 900 }}>✓</span>
            <span>Simple to use. Made to help people speak up about local issues.</span>
          </div>
        </div>

        <div className="civic-image-wrap civic-animate civic-delay-2" style={{ minWidth: 0, padding: "4px 0" }}>
          <div className="civic-orbit civic-drift" style={{ top: "7%", left: "-1%" }}><span aria-hidden="true">📍</span> Local issues matter</div>
          <img className="civic-image civic-float" src={civicIssuesImage} alt="Illustration of common community problems, including a pothole, rubbish, a blocked drain, and a broken streetlight" />
          <div className="civic-orbit civic-delay-3" style={{ right: "0%", bottom: "8%", animation: "civicFadeUp 700ms 450ms both" }}><span aria-hidden="true" style={{ color: colors.green }}>✓</span> Make the problem visible</div>
        </div>
      </section>

<section
  id="about"
  style={{
    background: "#f8faf9",
    padding: "68px 24px",
    borderTop: "1px solid #e1eae4",
    borderBottom: "1px solid #e1eae4",
  }}
>
  <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
    <p style={{
      color: "#087f5b",
      fontSize: "12px",
      fontWeight: 850,
      letterSpacing: "1.5px",
    }}>
      ABOUT CIVICFIX AI
    </p>

    <h2 style={{
      fontSize: "clamp(29px, 4vw, 42px)",
      color: "#173b35",
      marginBottom: "16px",
    }}>
      Building cleaner, safer communities together.
    </h2>

    <p style={{
      maxWidth: "800px",
      color: "#64756e",
      lineHeight: 1.8,
      fontSize: "16px",
    }}>
      CivicFix AI helps people report local problems, upload
      photos, explore civic issues on a map, and track report
      progress in one place. Our goal is to make civic reporting
      simpler and help communities work toward practical solutions.
    </p>

    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
      gap: "18px",
      marginTop: "30px",
    }}>
      {[
        ["📸", "Easy Reporting", "Describe local problems and upload photos."],
        ["🗺️", "Explore Issues", "See reported problems and their locations."],
        ["🤖", "AI Assistance", "Get AI-powered suggestions when reporting."],
        ["📈", "Track Progress", "Check report statuses and available updates."],
      ].map(([icon, title, text]) => (
       <article
  key={title}
  className="about-card"
  style={{
    padding: "24px",
    background: "#fff",
    border: "1px solid #e1eae4",
    borderRadius: "16px",
  }}
>
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>
            {icon}
          </div>
          <h3 style={{ color: "#173b35", marginBottom: "8px" }}>
            {title}
          </h3>
          <p style={{ color: "#64756e", lineHeight: 1.7, margin: 0 }}>
            {text}
          </p>
        </article>
      ))}
    </div>

    <div style={{
      marginTop: "24px",
      padding: "24px",
      background: "#e4f4eb",
      borderRadius: "16px",
    }}>
      <h3 style={{ color: "#173b35", marginTop: 0 }}>Our Mission</h3>
      <p style={{ color: "#43534a", lineHeight: 1.8, marginBottom: 0 }}>
        Make civic problems easier to report, improve their visibility,
        and help communities work toward cleaner, safer public spaces.
      </p>
    </div>
  </div>
</section>

      <section id="how-it-works" style={{ background: "#fff", borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`, padding: "68px 0" }}>

        <div style={section}>
          <p style={{ color: colors.green, fontWeight: 850, fontSize: "12px", letterSpacing: "1.2px", margin: "0 0 10px" }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: "clamp(29px, 4vw, 42px)", letterSpacing: "-1.2px", margin: "0 0 12px" }}>Small steps can bring attention to big problems.</h2>
          <p style={{ color: colors.muted, lineHeight: 1.8, maxWidth: "700px", margin: 0 }}>Reporting makes it easier to record what is happening and keep the details together. Here is how to use CivicFix AI.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: "18px", marginTop: "32px" }}>
            {steps.map(([number, title, text], index) => (
              <article className={`civic-card civic-animate civic-delay-${index + 1}`} key={number} style={{ border: `1px solid ${colors.border}`, borderRadius: "18px", padding: "25px", background: colors.background }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <span style={{ color: colors.green, fontSize: "13px", fontWeight: 850, letterSpacing: ".8px" }}>STEP {number}</span>
                  <span aria-hidden="true" style={{ width: "38px", height: "38px", display: "grid", placeItems: "center", borderRadius: "12px", background: "#e4f4eb", color: colors.green, fontSize: "18px" }}>{["⌕", "✎", "↗"][index]}</span>
                </div>
                <h3 style={{ fontSize: "21px", margin: "18px 0 9px", letterSpacing: "-.3px" }}>{title}</h3>
                <p style={{ color: colors.muted, lineHeight: 1.75, margin: 0, fontSize: "14px" }}>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" style={{ ...section, paddingTop: "68px", paddingBottom: "68px" }}>
        <p style={{ color: colors.green, fontWeight: 850, fontSize: "12px", letterSpacing: "1.2px", margin: "0 0 10px" }}>WHAT YOU CAN DO</p>
        <h2 style={{ fontSize: "clamp(29px, 4vw, 42px)", letterSpacing: "-1.2px", margin: "0 0 12px" }}>Your local concerns, in one place.</h2>
        <p style={{ color: colors.muted, lineHeight: 1.8, maxWidth: "700px", margin: 0 }}>CivicFix AI helps you record a problem and return to the information you submitted.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "18px", marginTop: "30px" }}>
          {features.map((feature, index) => (
            <article className={`civic-card civic-animate civic-delay-${index + 1}`} key={feature.title} style={{ background: "#fff", border: `1px solid ${colors.border}`, borderRadius: "18px", padding: "25px" }}>
              <div aria-hidden="true" style={{ width: "48px", height: "48px", display: "grid", placeItems: "center", background: "#e4f4eb", borderRadius: "14px", fontSize: "23px" }}>{feature.icon}</div>
              <h3 style={{ fontSize: "20px", margin: "18px 0 8px" }}>{feature.title}</h3>
              <p style={{ color: colors.muted, lineHeight: 1.75, margin: 0, fontSize: "14px" }}>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...section, paddingBottom: "64px" }}>
        <div style={{ position: "relative", overflow: "hidden", background: colors.navy, color: "#fff", borderRadius: "22px", padding: "clamp(28px, 5vw, 50px)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ position: "absolute", width: "220px", height: "220px", right: "8%", top: "-130px", border: "1px solid rgba(255,255,255,.12)", borderRadius: "50%" }} />
          <div style={{ maxWidth: "650px", position: "relative" }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", margin: "0 0 12px" }}>Your community is worth speaking up for.</h2>
            <p style={{ color: "#d4e5dc", lineHeight: 1.8, margin: 0 }}>Start by recording the problem. Keep your report details handy and check back for updates.</p>
          </div>
          <button className="civic-button" style={{ ...buttonPrimary, background: "#fff", color: colors.navy, position: "relative" }} onClick={onGetStarted}>Get started <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <footer style={{ ...section, paddingTop: "24px", paddingBottom: "30px", borderTop: `1px solid ${colors.border}`, color: colors.muted, fontSize: "12px", lineHeight: 1.8 }}>
        <strong style={{ color: colors.navy }}>CivicFix AI</strong> · A student-built project for reporting and tracking local problems.
        <br />
        
      </footer>
    </main>
  );
}
