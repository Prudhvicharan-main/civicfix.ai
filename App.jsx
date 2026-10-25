
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import { supabase } from "./lib/supabase";

const initialReports = [
  {
    id: "CF-1024",
    title: "Large pothole near the main road",
    category: "Roads",
    location: "Benz Circle, Vijayawada",
    description:
      "A large pothole is making it difficult for vehicles and two-wheelers to travel safely.",
    status: "In Progress",
    priority: "High",
    date: "Oct 23, 2026",
    initials: "RD",
    color: "orange",
  },
  {
    id: "CF-1023",
    title: "Garbage overflowing near the park",
    category: "Garbage",
    location: "Gandhi Nagar, Vijayawada",
    description:
      "Waste has accumulated around the public bin and needs collection.",
    status: "Under Review",
    priority: "Medium",
    date: "Oct 22, 2026",
    initials: "GC",
    color: "green",
  },
  {
    id: "CF-1022",
    title: "Streetlight not working",
    category: "Streetlights",
    location: "Governor Peta, Vijayawada",
    description:
      "The streetlight has not been working for several evenings.",
    status: "Reported",
    priority: "Medium",
    date: "Oct 21, 2026",
    initials: "SL",
    color: "purple",
  },
  {
    id: "CF-1021",
    title: "Water leakage on the footpath",
    category: "Water",
    location: "Labbipet, Vijayawada",
    description:
      "Water is leaking continuously from a pipe near the footpath.",
    status: "Resolved",
    priority: "High",
    date: "Oct 20, 2026",
    initials: "WL",
    color: "blue",
  },
];

const navItems = [
  { label: "Overview", icon: "▦" },
  { label: "Explore Reports", icon: "⌕" },
  { label: "My Reports", icon: "▤" },
  { label: "Impact Dashboard", icon: "↗" },
  { label: "Admin Panel", icon: "⚙" },
];

const categories = [
  "Roads",
  "Garbage",
  "Water",
  "Streetlights",
  "Drainage",
  "Public Infrastructure",
  "Other",
];

function Icon({ children, className = "" }) {
  return <span className={`icon ${className}`}>{children}</span>;
}

function StatusBadge({ status }) {
  const styles = {
    Reported: "status-reported",
    "Under Review": "status-review",
    "In Progress": "status-progress",
    Resolved: "status-resolved",
  };

  return (
    <span className={`status-badge ${styles[status] || ""}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={`priority-badge priority-${priority.toLowerCase()}`}>
      {priority}
    </span>
  );
}

function ReportCard({ report, onOpen }) {
  return (
    <button className="report-card" onClick={() => onOpen(report)}>
      <div className={`report-symbol ${report.color}`}>
        {report.category === "Roads" && "⌁"}
        {report.category === "Garbage" && "♻"}
        {report.category === "Streetlights" && "☼"}
        {report.category === "Water" && "≈"}
        {!["Roads", "Garbage", "Streetlights", "Water"].includes(
          report.category
        ) && "⌖"}
      </div>

      <div className="report-card-content">
        <div className="report-card-top">
          <span className="report-id">{report.id}</span>
          <StatusBadge status={report.status} />
        </div>
        <h3>{report.title}</h3>
        <p className="report-location">
          <Icon>⌖</Icon> {report.location}
        </p>
        <div className="report-card-bottom">
          <span className="category-label">{report.category}</span>
          <PriorityBadge priority={report.priority} />
        </div>
      </div>
      <span className="card-chevron">›</span>
    </button>
  );
}

function StatCard({ icon, label, value, note, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <p className="stat-label">{label}</p>
      <div className="stat-value">{value}</div>
      <p className="stat-note">{note}</p>
    </div>
  );
}

function ReportForm({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    category: "Roads",
    location: "",
    description: "",
  });
  const [photoName, setPhotoName] = useState("");

  function update(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({ ...form, photoName });
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">COMMUNITY REPORT</span>
            <h2 id="report-form-title">Report an issue</h2>
            <p>Help your community by sharing what needs attention.</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={submit} className="report-form">
          <label>
            Issue title <span className="required">*</span>
            <input
              required
              minLength={4}
              maxLength={100}
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Broken streetlight near the bus stop"
            />
          </label>

          <label>
            Category <span className="required">*</span>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>

          <label>
            Location <span className="required">*</span>
            <input
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Street, area or nearby landmark"
            />
          </label>

          <label>
            Description <span className="required">*</span>
            <textarea
              required
              minLength={10}
              maxLength={1000}
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the issue and how it affects residents..."
            />
          </label>

          <label className="upload-area">
            <span className="upload-icon">↑</span>
            <strong>{photoName || "Add a photo (optional)"}</strong>
            <span>Choose an image from your device</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPhotoName(e.target.files?.[0]?.name || "")
              }
            />
          </label>

          <div className="form-notice">
            <Icon>✳</Icon>
            AI analysis and live submission will be available after backend
            integration. This form currently creates a local demo report.
          </div>

          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              Submit demo report <span>→</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function MapPreview({ reports, onOpen }) {
  return (
    <div className="map-preview">
      <div className="map-streets" aria-hidden="true">
        <div className="map-road road-one" />
        <div className="map-road road-two" />
        <div className="map-road road-three" />
        <div className="map-road road-four" />
        <div className="map-road road-five" />
        <div className="map-water" />
        <div className="map-park">
          <span>GREEN PARK</span>
        </div>
        <span className="map-area area-one">GANDHI NAGAR</span>
        <span className="map-area area-two">GOVERNOR PETA</span>
        <span className="map-area area-three">LABBIPET</span>
      </div>

      {reports.slice(0, 4).map((report, index) => (
        <button
          key={report.id}
          className={`map-pin pin-${index + 1}`}
          onClick={() => onOpen(report)}
          title={`${report.title} — ${report.location}`}
          aria-label={`Open ${report.title}`}
        >
          <span>{index + 1}</span>
        </button>
      ))}

      <div className="map-caption">
        <div>
          <span className="live-indicator" />
          <strong>Community issue map</strong>
          <p>Illustrative preview · Not a live map</p>
        </div>
        <span className="map-count">{reports.length} reports</span>
      </div>
    </div>
  );
}

function ReportDetail({ report, onClose }) {
  if (!report) return null;

  const stages = ["Reported", "Under Review", "In Progress", "Resolved"];
  const currentStage = stages.indexOf(report.status);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal-panel detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">{report.id} · {report.date}</span>
            <h2 id="detail-title">{report.title}</h2>
            <p><Icon>⌖</Icon> {report.location}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="detail-badges">
          <StatusBadge status={report.status} />
          <PriorityBadge priority={report.priority} />
          <span className="category-label">{report.category}</span>
        </div>

        <div className="detail-section">
          <h3>Issue description</h3>
          <p>{report.description}</p>
        </div>

        <div className="detail-section">
          <h3>Report timeline</h3>
          <div className="timeline">
            {stages.map((stage, index) => (
              <div
                key={stage}
                className={`timeline-step ${index <= currentStage ? "completed" : ""}`}
              >
                <span className="timeline-marker">
                  {index < currentStage ? "✓" : index + 1}
                </span>
                <span>{stage}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="demo-notice">
          Demo status only. This is not confirmation that a government
          department has received or resolved the issue.
        </p>

        <button className="button button-secondary button-full" onClick={onClose}>
          Close details
        </button>
      </section>
    </div>
  );
}

function ExplorePage({ reports, onOpen }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");

  const filtered = reports.filter((report) => {
    const text = `${report.title} ${report.location} ${report.id}`.toLowerCase();
    return (
      text.includes(query.toLowerCase()) &&
      (category === "All categories" || report.category === category) &&
      (status === "All statuses" || report.status === status)
    );
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR COMMUNITY</span>
          <h1>Explore reports</h1>
          <p>Discover reported issues and follow their progress.</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Icon>⌕</Icon>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports or locations..."
            aria-label="Search reports"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option>All categories</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option>All statuses</option>
          {["Reported", "Under Review", "In Progress", "Resolved"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <p className="results-count">{filtered.length} reports found</p>
      <div className="report-list">
        {filtered.map((report) => (
          <ReportCard key={report.id} report={report} onOpen={onOpen} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <span>⌕</span>
          <h3>No reports found</h3>
          <p>Try changing your search or filters.</p>
        </div>
      )}
    </>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (mounted) {
        if (error) {
          console.error("Unable to read Supabase session:", error.message);
        }
        setSession(data?.session ?? null);
        setAuthLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setNotice(`Unable to sign out: ${error.message}`);
    }
  }

  const [page, setPage] = useState("Overview");
  const [reports, setReports] = useState(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [notice, setNotice] = useState("");

  const counts = useMemo(
    () => ({
      total: reports.length,
      progress: reports.filter((r) => r.status === "In Progress").length,
      review: reports.filter((r) => r.status === "Under Review").length,
      resolved: reports.filter((r) => r.status === "Resolved").length,
    }),
    [reports]
  );

  function createReport(form) {
    const report = {
      ...form,
      id: `CF-${1025 + reports.length - initialReports.length}`,
      status: "Reported",
      priority: "Medium",
      date: "Oct 24, 2026",
      initials: "NR",
      color: "blue",
      description: form.description,
    };
    setReports((previous) => [report, ...previous]);
    setShowForm(false);
    setPage("My Reports");
    setNotice("Demo report created successfully in this session.");
    window.setTimeout(() => setNotice(""), 4000);
  }

  function openReport(report) {
    setSelectedReport(report);
  }

  if (authLoading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "Inter, Arial, sans-serif",
          color: "#172b27",
          background: "#f5f7f6",
        }}
      >
        Loading CivicFix AI...
      </main>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setPage("Overview")} aria-label="CivicFix AI home">
          <span className="brand-mark"><span>c</span>✳</span>
          <span className="brand-name">CivicFix<span>AI</span><small>COMMUNITY FIRST</small></span>
        </button>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${page === item.label ? "active" : ""}`}
              onClick={() => setPage(item.label)}
            >
              <Icon>{item.icon}</Icon>
              <span>{item.label}</span>
              {item.label === "Explore Reports" && <span className="nav-count">{reports.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-spark">✳</span>
            <strong>Small actions.<br />Better communities.</strong>
            <p>Every report helps make public spaces better for everyone.</p>
            <button onClick={() => setShowForm(true)}>Report an issue <span>↗</span></button>
          </div>
          <div className="profile-row">
            <div className="avatar">G</div>
            <div className="profile-info">
              <strong>Signed-in resident</strong>
              <span>{session.user.email}</span>
            </div>
            <span className="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{page}</strong></div>
          <div className="topbar-actions">
            
            <button className="topbar-report" onClick={() => setShowForm(true)}>
              <span>＋</span> Report an issue
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="page-content">
          {notice && <div className="toast-message" role="status">✓ {notice}</div>}

          {page === "Overview" && (
            <>
              <section className="welcome-section">
                <div>
                  <div className="welcome-date"><span /> COMMUNITY OVERVIEW</div>
                  <h1>Let's make our<br className="mobile-break" /> city <span>better together.</span></h1>
                  <p>See what's happening around your community and help make a difference.</p>
                  <div className="welcome-actions">
                    <button className="button button-primary" onClick={() => setShowForm(true)}>
                      <span>＋</span> Report an issue
                    </button>
                    <button className="button button-secondary" onClick={() => setPage("Explore Reports")}>
                      Explore reports <span>→</span>
                    </button>
                  </div>
                </div>
                <div className="welcome-art" aria-hidden="true">
                  <div className="art-sun" />
                  <div className="art-cloud cloud-one" />
                  <div className="art-cloud cloud-two" />
                  <div className="art-building building-one"><i /><i /><i /><i /></div>
                  <div className="art-building building-two"><i /><i /><i /><i /><i /><i /></div>
                  <div className="art-building building-three"><i /><i /><i /><i /></div>
                  <div className="art-ground" />
                  <div className="art-tree tree-one"><i /><b /></div>
                  <div className="art-tree tree-two"><i /><b /></div>
                  <div className="art-person"><i /><b /></div>
                  <div className="art-plant">✳</div>
                </div>
              </section>

              <section className="stats-grid" aria-label="Community statistics">
                <StatCard icon="▦" label="Total reports" value={counts.total} note="In this demo" tone="tone-blue" />
                <StatCard icon="◷" label="Under review" value={counts.review} note="Awaiting review" tone="tone-orange" />
                <StatCard icon="↗" label="In progress" value={counts.progress} note="Demo status" tone="tone-purple" />
                <StatCard icon="✓" label="Resolved reports" value={counts.resolved} note="Demo status only" tone="tone-green" />
              </section>

              <section className="dashboard-grid">
                <div className="content-panel map-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Community at a glance</h2>
                      <p>Explore reported issues around your city.</p>
                    </div>
                    <button className="text-link" onClick={() => setPage("Explore Reports")}>View reports <span>→</span></button>
                  </div>
                  <MapPreview reports={reports} onOpen={openReport} />
                  <div className="map-legend">
                    <span><i className="legend-dot dot-red" /> High priority</span>
                    <span><i className="legend-dot dot-orange" /> Under review</span>
                    <span><i className="legend-dot dot-green" /> Resolved</span>
                  </div>
                </div>

                <div className="content-panel activity-panel">
                  <div className="panel-heading">
                    <div><h2>Recent reports</h2><p>Latest community submissions</p></div>
                    <button className="more-button" onClick={() => setPage("Explore Reports")} aria-label="See all reports">···</button>
                  </div>
                  <div className="recent-list">
                    {reports.slice(0, 4).map((report) => (
                      <button className="recent-item" key={report.id} onClick={() => openReport(report)}>
                        <div className={`recent-icon ${report.color}`}>
                          {report.category === "Roads" ? "⌁" : report.category === "Garbage" ? "♻" : report.category === "Water" ? "≈" : "☼"}
                        </div>
                        <div className="recent-info">
                          <strong>{report.title}</strong>
                          <span>{report.location}</span>
                          <small>{report.id} · {report.date}</small>
                        </div>
                        <span className="recent-arrow">↗</span>
                      </button>
                    ))}
                  </div>
                  <button className="all-reports-button" onClick={() => setPage("Explore Reports")}>
                    View all reports <span>→</span>
                  </button>
                </div>
              </section>

              <section className="ai-banner">
                <div className="ai-banner-icon">✳</div>
                <div>
                  <span className="eyebrow">COMING IN THE NEXT STAGE</span>
                  <h2>Smarter reporting starts here.</h2>
                  <p>AI-assisted issue classification, clearer summaries and suggested urgency — with people always in control.</p>
                </div>
                <span className="ai-banner-decoration">✳</span>
              </section>
            </>
          )}

          {page === "Explore Reports" && <ExplorePage reports={reports} onOpen={openReport} />}

          {page === "My Reports" && (
            <>
              <div className="page-heading">
                <div><span className="eyebrow">YOUR ACTIVITY</span><h1>My reports</h1><p>Reports created during this demo session.</p></div>
                <button className="button button-primary" onClick={() => setShowForm(true)}>＋ New report</button>
              </div>
              <div className="info-strip">These reports are stored only in the current browser session. They will not persist after a full page refresh.</div>
              <div className="report-list">
                {reports.filter((r) => r.id.startsWith("CF-") && r.id !== "CF-1024" && r.id !== "CF-1023" && r.id !== "CF-1022" && r.id !== "CF-1021").length === 0
                  ? <div className="empty-state"><span>▤</span><h3>Your reports will appear here</h3><p>Submit a demo report to see it in this list.</p><button className="button button-primary" onClick={() => setShowForm(true)}>＋ Report an issue</button></div>
                  : reports.filter((r) => !initialReports.some((original) => original.id === r.id)).map((report) => <ReportCard key={report.id} report={report} onOpen={openReport} />)}
              </div>
            </>
          )}

          {page === "Impact Dashboard" && (
            <>
              <div className="page-heading"><div><span className="eyebrow">COMMUNITY OUTCOMES</span><h1>Impact dashboard</h1><p>A clearer picture of the issues residents are reporting.</p></div></div>
              <div className="info-strip">Monitor reported civic issues, track progress, and identify problems that need attention.</div>
              <section className="stats-grid impact-stats">
                <StatCard icon="▦" label="Reports in demo" value={counts.total} note="All categories" tone="tone-blue" />
                <StatCard icon="✓" label="Marked resolved" value={counts.resolved} note="Not independently verified" tone="tone-green" />
                <StatCard icon="◷" label="Awaiting review" value={counts.review} note="Demo status" tone="tone-orange" />
                <StatCard icon="⌖" label="Issue categories" value={new Set(reports.map((r) => r.category)).size} note="Across sample reports" tone="tone-purple" />
              </section>
              <div className="content-panel impact-panel">
                <div className="panel-heading"><div><h2>Reports by category</h2><p>Distribution of sample community reports</p></div></div>
                <div className="category-bars">
                  {categories.filter((category) => reports.some((report) => report.category === category)).map((category) => {
                    const total = reports.filter((r) => r.category === category).length;
                    return <div className="bar-row" key={category}><div className="bar-label"><span>{category}</span><strong>{total}</strong></div><div className="bar-track"><div className="bar-fill" style={{ width: `${(total / reports.length) * 100}%` }} /></div></div>;
                  })}
                </div>
              </div>
            </>
          )}

          {page === "Admin Panel" && (
            <>
              <div className="page-heading"><div><span className="eyebrow">WORKFLOW PREVIEW</span><h1>Admin panel</h1><p>Preview the interface for reviewing and managing reports.</p></div><span className="demo-pill"><span /> </span></div>
              
              <div className="content-panel admin-table-panel">
                <div className="panel-heading"><div><h2>Report management</h2><p>{reports.length} sample and session reports</p></div></div>
                <div className="table-scroll">
                  <table className="reports-table">
                    <thead><tr><th>REPORT</th><th>CATEGORY</th><th>PRIORITY</th><th>STATUS</th><th>VIEW</th></tr></thead>
                    <tbody>{reports.map((report) => <tr key={report.id}><td><strong>{report.title}</strong><small>{report.id} · {report.location}</small></td><td>{report.category}</td><td><PriorityBadge priority={report.priority} /></td><td><StatusBadge status={report.status} /></td><td><button className="table-view" onClick={() => openReport(report)}>View ↗</button></td></tr>)}</tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <footer className="page-footer">
            <span>© 2026 CivicFix AI · Built for better communities.</span>
           
          </footer>
        </div>
      </main>

      {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmit={createReport} />}
      {selectedReport && <ReportDetail report={selectedReport} onClose={() => setSelectedReport(null)} />}
    </div>
  );
}

export default App;
