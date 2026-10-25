import { useEffect, useMemo, useState, useRef } from "react";
import "./App.css";
import Auth from "./components/Auth";
import LandingPage from "./components/LandingPage";
import { supabase } from "./lib/supabase";
import CivicMap from "./CivicMap";

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


function mapDatabaseReport(row) {
  const categoryFromDatabase = {
    Pothole: "Roads",
    Garbage: "Garbage",
    Streetlight: "Streetlights",
    "Water Leakage": "Water",
    Drainage: "Drainage",
    "Public Infrastructure": "Public Infrastructure",
    Other: "Other",
  };

  const priorityForUi = {
    Low: "Low",
    Normal: "Medium",
    High: "High",
    Urgent: "Urgent",
  };

  const colors = {
    Pothole: "orange",
    Garbage: "green",
    Streetlight: "purple",
    "Water Leakage": "blue",
  };

  const titleWords = (row.title || "CF")
    .split(/\s+/)
    .filter(Boolean);

  return {
    id: row.report_code,
     user_id: row.user_id,
    title: row.title,
    category: categoryFromDatabase[row.category] || row.category,
    location: row.location,
    latitude: row.latitude ?? null,
longitude: row.longitude ?? null,
    description: row.description,
    status: row.status,
    priority: priorityForUi[row.priority] || row.priority || "Medium",
    date: row.created_at
      ? new Date(row.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recently",
    initials: titleWords
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase(),
    color: colors[row.category] || "blue",
    photo_path: row.photo_path || null,
    photo_url: row.photo_url || null,
    aiAnalysis: row.ai_analysis || null,
  };
}


 


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

async function uploadReportPhoto(file, userId) {
  if (!file) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be smaller than 5 MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
  const photoPath = `${userId}/${crypto.randomUUID()}.${safeExtension}`;

  const { error } = await supabase.storage
    .from("report-photos")
    .upload(photoPath, file, { contentType: file.type, upsert: false });

  if (error) throw error;
  return photoPath;
}

async function addSignedPhotoUrls(reports) {
  return Promise.all(reports.map(async (report) => {
    if (!report.photo_path) return report;
    const { data, error } = await supabase.storage
      .from("report-photos")
      .createSignedUrl(report.photo_path, 60 * 60);
    if (error) {
      console.error("Unable to create signed photo URL:", error.message);
      return { ...report, photo_url: null };
    }
    return { ...report, photo_url: data?.signedUrl || null };
  }));
}


async function geocodeAddress(location) {
  try {
    const params = new URLSearchParams({
      q: `${location}, India`,
      format: "jsonv2",
      limit: "1",
      countrycodes: "in",
    });

    const response = await fetch(
      
      `https://nominatim.openstreetmap.org/search?${params.toString()}`
    );


    if (!response.ok) {
      console.error("Geocoding request failed:", response.status);
      return null;
    }

    const results = await response.json();
    console.log("Geocoding results:", results);

    if (!results.length) {
      return null;
    }

    const latitude = Number(results[0].lat);
    const longitude = Number(results[0].lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return null;
    }

    return { latitude, longitude };
  } catch (error) {
    console.error("Address geocoding failed:", error);
    return null;
  }
}

function ReportForm({ onClose, onSubmit }) {
   


    const [form, setForm] = useState({
  
  title: "",
  category: "Roads",
  location: "",
  latitude: "",
  longitude: "",
  description: "",
});
  const [photo, setPhoto] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  function update(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setAnalysis(null);
    setAiError("");
  }

  async function analyzeWithAI() {
    if (form.title.trim().length < 4) {
      setAiError("Enter an issue title with at least 4 characters.");
      return;
    }

    if (form.description.trim().length < 10) {
      setAiError("Describe the issue in at least 10 characters.");
      return;
    }

    if (!form.location.trim()) {
      setAiError("Enter the issue location first.");
      return;
    }

    setAiLoading(true);
    setAiError("");
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "analyze-civic-issue",
        {
          body: {
            title: form.title.trim(),
            description: form.description.trim(),
            location: form.location.trim(),
          },
        }
      );

      if (error) {
        throw new Error(
          error.message || "Unable to connect to the AI function."
        );
      }

      if (!data?.analysis) {
        throw new Error(
          data?.error || "The AI did not return an analysis."
        );
      }

      setAnalysis(data.analysis);
    } catch (error) {
      console.error("CivicFix AI analysis error:", error);
      setAiError(
        error.message ||
          "AI analysis failed. Please check your connection and try again."
      );
    } finally {
      setAiLoading(false);
    }
  }

  function applySuggestion() {
    if (!analysis) return;

    const validCategories = [
      "Roads",
      "Garbage",
      "Water",
      "Streetlights",
      "Drainage",
      "Public Infrastructure",
      "Other",
    ];

    if (validCategories.includes(analysis.category)) {
      setForm((previous) => ({
        ...previous,
        category: analysis.category,
      }));
    }
  }

  function submit(event) {
    event.preventDefault();

    onSubmit({
      ...form,
      photo,
      aiAnalysis: analysis,
    });
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
            <p>Describe the problem and let AI help classify it.</p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close"
          >
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
            <div className="coordinate-fields">
  
</div>


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

          <button
            type="button"
            className="button button-secondary button-full"
            onClick={analyzeWithAI}
            disabled={aiLoading}
          >
            {aiLoading
              ? "Analyzing issue..."
              : "✳ Analyze with AI"}
          </button>

          {aiError && (
            <div
              role="alert"
              style={{
                marginTop: "12px",
                padding: "12px",
                borderRadius: "10px",
                background: "#fff0ee",
                color: "#a33327",
                fontSize: "14px",
              }}
            >
              {aiError}
            </div>
          )}

          {analysis && (
            <section
              aria-live="polite"
              style={{
                marginTop: "16px",
                padding: "16px",
                border: "1px solid #cfe5d6",
                borderRadius: "14px",
                background: "#f3faf5",
                color: "#203b2c",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.7px",
                  marginBottom: "12px",
                  color: "#287447",
                }}
              >
                ✳ AI ISSUE ANALYSIS
              </div>

              <p>
                <strong>Suggested category:</strong>{" "}
                {analysis.category}
              </p>

              <p>
                <strong>Suggested priority:</strong>{" "}
                {analysis.priority}
              </p>

              <p>
                <strong>Summary:</strong> {analysis.summary}
              </p>

              <p>
                <strong>Suggested action:</strong>{" "}
                {analysis.suggested_action}
              </p>

              <p>
                <strong>Reason:</strong> {analysis.reason}
              </p>

              <button
                type="button"
                className="button button-secondary"
                onClick={applySuggestion}
              >
                Use suggested category
              </button>

              <p style={{ fontSize: "12px", marginBottom: 0 }}>
                AI suggestions may be incorrect. Review them before
                submitting; priority is a recommendation, not an
                official assessment.
              </p>
            </section>
          )}

          <label className="upload-area">
            <span className="upload-icon">↑</span>
            <strong>{photo?.name || "Add a photo (optional)"}</strong>
            <span>Choose an image from your device (max 5 MB)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setPhoto(event.target.files?.[0] || null)
              }
            />
          </label>

          <div className="form-notice">
            <Icon>✳</Icon>
           Your report and optional photo help document the issue so it can be reviewed and tracked toward resolution.
            AI suggestions are provided to assist you.
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={aiLoading}
            >
              Submit report <span>→</span>
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

        {report.photo_url && (
          <div className="detail-section report-photo-section">
            <h3>Attached photo</h3>
            <img
              src={report.photo_url}
              alt={`Photo attached to ${report.title}`}
              className="report-detail-photo"
              loading="lazy"
              style={{ display: "block", width: "100%", maxHeight: "360px", objectFit: "contain", borderRadius: "12px", background: "#f3f5f4" }}
            />
          </div>
        )}

        <div className="detail-section">
          <h3>Issue description</h3>
          <p>{report.description}</p>
        </div>
          
          
{report.aiAnalysis && (
  <section className="detail-section ai-analysis-details">
    <h3>✳ AI Issue Analysis</h3>

    <p>
      <strong>Suggested category:</strong>{" "}
      {report.aiAnalysis.category || "Not available"}
    </p>

    <p>
      <strong>Suggested priority:</strong>{" "}
      {report.aiAnalysis.priority || "Not available"}
    </p>

    <p>
      <strong>Summary:</strong>{" "}
      {report.aiAnalysis.summary || "Not available"}
    </p>

    <p>
      <strong>Suggested action:</strong>{" "}
      {report.aiAnalysis.suggested_action || "Not available"}
    </p>

    <p>
      <strong>Reason:</strong>{" "}
      {report.aiAnalysis.reason || "Not available"}
    </p>

    <p className="ai-analysis-note">
      AI-generated recommendations are advisory and do not confirm
      official assessment or government action.
    </p>
  </section>
)}


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
  const submittingReportRef = useRef(false);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [publicView, setPublicView] = useState("landing");
  const [isAdmin, setIsAdmin] = useState(false);
const [roleLoading, setRoleLoading] = useState(true);

const [updatingReportId, setUpdatingReportId] = useState(null);

async function handleStatusChange(report, newStatus) {
  if (!isAdmin || !userId) {
    setNotice("Only administrators can update report status.");
    return;
  }

  const previousStatus = report.status;
  setUpdatingReportId(report.id);

  // Update the UI immediately.
  setReports((current) =>
    current.map((item) =>
      item.id === report.id
        ? { ...item, status: newStatus }
        : item
    )
  );

  try {
    // Replace databaseId with the actual database primary key
    // if your mapDatabaseReport function uses another field.
    const { error } = await supabase
      .from("reports")
      .update({ status: newStatus })
      .eq("report_code", report.id);

    if (error) throw error;

    setNotice(`Report status changed to ${newStatus}.`);
  } catch (error) {
    setReports((current) =>
      current.map((item) =>
        item.id === report.id
          ? { ...item, status: previousStatus }
          : item
      )
    );

    setNotice(`Status update failed: ${error.message}`);
  } finally {
    setUpdatingReportId(null);
  }
}

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
 const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [notice, setNotice] = useState("");

  // Track the signed-in user's ID.
  const userId = session?.user?.id;

useEffect(() => {
  let cancelled = false;

  async function checkUserRole() {
    setRoleLoading(true);
    setIsAdmin(false);

    if (!userId) {
      setRoleLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (cancelled) return;

    if (error) {
      console.error("Role check failed:", error.message);
      setIsAdmin(false);
    } else {
      setIsAdmin(data?.role === "admin");
    }

    setRoleLoading(false);
  }

  checkUserRole();

  return () => {
    cancelled = true;
  };
}, [userId]);



// Check the signed-in user's role in Supabase.
useEffect(() => {
  let cancelled = false;

  async function checkUserRole() {
    setRoleLoading(true);
    setIsAdmin(false);

    if (!userId) {
      setRoleLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (cancelled) return;

    if (error) {
      console.error("Unable to check user role:", error.message);
      setNotice(`Unable to verify permissions: ${error.message}`);
      setRoleLoading(false);
      return;
    }

    setIsAdmin(data?.role === "admin");
    setRoleLoading(false);
  }

  checkUserRole();

  return () => {
    cancelled = true;
  };
}, [userId]);

  // Load saved reports whenever the signed-in user changes.
  useEffect(() => {
    let cancelled = false;

if (!userId) {
  return;
}
    async function loadReports() {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Unable to load reports:", error.message);
        setNotice(`Could not load saved reports: ${error.message}`);
        return;
      }

      const mappedReports = (data || []).map(mapDatabaseReport);
      const savedReports = await addSignedPhotoUrls(mappedReports);
      console.log("Database rows:", data?.length);
console.log("Mapped reports:", mappedReports.length);
console.log("Reports after photo URLs:", savedReports.length);
console.table(
  savedReports.map((report) => ({
    id: report.id,
    title: report.title,
    user_id: report.user_id,
  }))
); 



      if (cancelled) return;

      setReports(savedReports);
    }

    loadReports();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  
const counts = useMemo(() => {
  const sampleIds = new Set(initialReports.map((report) => report.id));

  // Keep demo examples separate from reports stored in Supabase.
  const savedReports = reports.filter(
    (report) => !sampleIds.has(report.id)
  );

  return {
    total: savedReports.length,
    demo: reports.filter((report) => sampleIds.has(report.id)).length,

    pending: savedReports.filter(
      (report) =>
        report.status === "Reported" ||
        report.status === "Under Review"
    ).length,

    progress: savedReports.filter(
      (report) => report.status === "In Progress"
    ).length,

    resolved: savedReports.filter(
      (report) => report.status === "Resolved"
    ).length,

    highPriority: savedReports.filter(
      (report) =>
        report.priority === "High" ||
        report.priority === "Urgent"
    ).length,
  };
}, [reports]);

async function createReport(form) {
  if (submittingReportRef.current) return;

  if (!session?.user?.id) {
    setNotice("Please sign in before submitting a report.");
    return;
  }

  submittingReportRef.current = true;

 
const coordinates = await geocodeAddress(form.location.trim());
console.log("Coordinates before saving:", coordinates);

if (!coordinates) {
  submittingReportRef.current = false;
  setNotice(
    "Location not found. Please enter a nearby landmark and city, then try again."
  );
  return;
}

    const categoryToDatabase = {
      Roads: "Pothole",
      Garbage: "Garbage",
      Water: "Water Leakage",
      Streetlights: "Streetlight",
      Drainage: "Drainage",
      "Public Infrastructure": "Public Infrastructure",
      Other: "Other",
    };

    let photoPath = null;
    try {
      if (form.photo) {
        setNotice("Uploading your photo...");
        photoPath = await uploadReportPhoto(form.photo, session.user.id);
      }
   } catch (uploadError) {
  submittingReportRef.current = false;
  console.error("Unable to upload report photo:", uploadError);
  setNotice(`Photo upload failed: ${uploadError.message}`);
  return;
}

    const { data, error } = await supabase
      .from("reports")
      .insert({
        user_id: session.user.id,
        title: form.title.trim(),
        
        description: form.description.trim(),
        category: categoryToDatabase[form.category] || "Other",
        location: form.location.trim(),
        latitude: coordinates?.latitude ?? null,
        longitude: coordinates?.longitude ?? null,
        status: "Reported",
        
        
        priority: ({
            Low: "Low",
            Medium: "Normal",
            High: "High",
           Urgent: "Urgent",
            })[form.aiAnalysis?.priority] || "Normal",

        photo_path: photoPath,
        ai_analysis: form.aiAnalysis ?? null,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Unable to save report:", error.message);
      setNotice(`Report was not saved: ${error.message}`);
      return;
    }

    const mappedReport = mapDatabaseReport(data);
    const [report] = await addSignedPhotoUrls([mappedReport]);
    setReports((previous) => [report, ...previous.filter((item) => item.id !== report.id)]);
    setShowForm(false);
    setPage("My Reports");
    setNotice("Report submitted successfully and saved to Supabase.");
    window.setTimeout(() => setNotice(""), 1000);
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
    if (publicView === "auth") {
      return <Auth onBack={() => setPublicView("landing")} />;
    }

    return <LandingPage onGetStarted={() => setPublicView("auth")} />;
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
          {navItems
  .filter((item) => item.label !== "Admin Panel" || isAdmin)
  .map((item) => (
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
  <StatCard
    icon="▦"
    label="Community reports"
    value={counts.total}
    note="Saved reports only"
    tone="tone-blue"
  />

  <StatCard
    icon="◷"
    label="Pending reports"
    value={counts.pending}
    note="Reported or under review"
    tone="tone-orange"
  />

  <StatCard
    icon="↗"
    label="In progress"
    value={counts.progress}
    note="Currently being addressed"
    tone="tone-purple"
  />

  <StatCard
    icon="✓"
    label="Resolved reports"
    value={counts.resolved}
    note="Marked as resolved"
    tone="tone-green"
  />
</section>



<section className="priority-insight" aria-label="High priority issue insights">
  <div className="priority-insight-icon">!</div>

  <div className="priority-insight-content">
    <h3>High-priority issues</h3>
    <p>
      Reports marked High or Urgent that may need attention.
    </p>
  </div>

  <div className="priority-insight-count">
    <strong>{counts.highPriority}</strong>
    <span>High / Urgent</span>
  </div>
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
                  
<span className="eyebrow">AI-POWERED CIVIC REPORTING</span>
<h2>Turn civic issues into actionable insights.</h2>
<p>
  AI helps classify reported issues, summarize problems,
  assess priority, and recommend next steps — while people
  remain in control of decisions.
</p>

                </div>
                <span className="ai-banner-decoration">✳</span>
              </section>
            </>
          )}
{page === "Explore Reports" && (
  <>
    <CivicMap
      reports={reports}
      onOpen={openReport}
    />

    <ExplorePage
      reports={reports}
      onOpen={openReport}
    />
  </>
)}
         
{page === "My Reports" && (
  <>
    <div className="page-heading">
      <div>
        <span className="eyebrow">YOUR ACTIVITY</span>
        <h1>My reports</h1>
      
      </div>
      <button
        className="button button-primary"
        onClick={() => setShowForm(true)}
      >
        ＋ New report
      </button>
    </div>

   
    {(() => {
      const sampleIds = new Set(
        initialReports.map((report) => report.id)
      );

     const myReports = reports.filter(
  (report) =>
    report.user_id === userId &&
    !sampleIds.has(report.id)
);

      const pendingCount = myReports.filter(
        (report) =>
          report.status === "Reported" ||
          report.status === "Under Review"
      ).length;

      const progressCount = myReports.filter(
        (report) => report.status === "In Progress"
      ).length;

      const resolvedCount = myReports.filter(
        (report) => report.status === "Resolved"
      ).length;

      return (
        <>
          <section className="stats-grid impact-stats">
            <StatCard
              icon="▤"
              label="Total reports"
              value={myReports.length}
              note="Reports saved"
              tone="tone-blue"
            />
            <StatCard
              icon="◷"
              label="Pending"
              value={pendingCount}
              note="Reported or under review"
              tone="tone-orange"
            />
            <StatCard
              icon="↗"
              label="In progress"
              value={progressCount}
              note="Work in progress"
              tone="tone-purple"
            />
            <StatCard
              icon="✓"
              label="Resolved"
              value={resolvedCount}
              note="Marked resolved"
              tone="tone-green"
            />
          </section>

          <div className="report-list">
            {myReports.length === 0 ? (
              <div className="empty-state">
                <span>▤</span>
                <h3>Your reports will appear here</h3>
                <p>
                  Submit a community issue to see its status,
                  details, and AI analysis here.
                </p>
                <button
                  className="button button-primary"
                  onClick={() => setShowForm(true)}
                >
                  ＋ Report an issue
                </button>
              </div>
            ) : (
              myReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onOpen={openReport}
                />
              ))
            )}
          </div>
        </>
      );
    })()}
  </>
)}


          
{page === "Impact Dashboard" && (
  <>
    <div className="page-heading">
      <div>
        <span className="eyebrow">COMMUNITY OUTCOMES</span>
        <h1>Impact dashboard</h1>
        <p>A clearer picture of the issues residents are reporting.</p>
      </div>
    </div>

    

    <section className="stats-grid impact-stats">
      <StatCard
        icon="▦"
        label="Community reports"
        value={counts.total}
        note="Saved reports only"
        tone="tone-blue"
      />

      <StatCard
        icon="✓"
        label="Marked resolved"
        value={counts.resolved}
        note="Not independently verified"
        tone="tone-green"
      />

      <StatCard
        icon="◷"
        label="Awaiting review"
        value={counts.pending}
        note="Reported or under review"
        tone="tone-orange"
      />

      <StatCard
        icon="⌖"
        label="Issue categories"
        value={
          new Set(
            reports
              .filter((report) => !initialReports.some((sample) => sample.id === report.id))
              .map((report) => report.category)
          ).size
        }
        note="Across saved reports"
        tone="tone-purple"
      />
    </section>

    <section className="impact-summary" aria-label="Community resolution rate">
      <div className="impact-summary-heading">
        <div>
          <h2>Community resolution rate</h2>
          <p>Share of saved reports marked resolved</p>
        </div>
        <span className="impact-summary-badge">Report status</span>
      </div>

      <div className="impact-rate">
        <strong>
          {counts.total > 0
            ? Math.round((counts.resolved / counts.total) * 100)
            : 0}%
        </strong>

        <div
          className="impact-rate-track"
          role="progressbar"
          aria-label="Resolution rate"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={
            counts.total > 0
              ? Math.round((counts.resolved / counts.total) * 100)
              : 0
          }
        >
          <div
            className="impact-rate-fill"
            style={{
              width: `${
                counts.total > 0
                  ? Math.min(100, (counts.resolved / counts.total) * 100)
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      <p className="impact-summary-footnote">
        {counts.resolved} of {counts.total} saved reports marked resolved.
      </p>
    </section>

    <div className="content-panel impact-panel">
      <div className="panel-heading">
        <div>
          <h2>Reports by category</h2>
          <p>Distribution of saved community reports</p>
        </div>
      </div>

      {(() => {
        const sampleIds = new Set(initialReports.map((report) => report.id));
        const savedReports = reports.filter(
          (report) => !sampleIds.has(report.id)
        );

        if (savedReports.length === 0) {
          return (
            <div className="empty-state">
              <span>⌖</span>
              <h3>No saved reports to analyze yet</h3>
              <p>
                Submit a community report to see the category breakdown.
              </p>
            </div>
          );
        }

        return (
          <div className="category-bars">
            {categories
              .filter((category) =>
                savedReports.some((report) => report.category === category)
              )
              .map((category) => {
                const total = savedReports.filter(
                  (report) => report.category === category
                ).length;

                const percentage = (total / savedReports.length) * 100;

                return (
                  <div className="bar-row" key={category}>
                    <div className="bar-label">
                      <span>{category}</span>
                      <strong>
                        {total} ({Math.round(percentage)}%)
                      </strong>
                    </div>

                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        );
      })()}
    </div>
  </>
)}


{page === "Admin Panel" && (
  roleLoading ? (
    <div className="info-strip">
      Checking admin permissions...
    </div>
  ) : !isAdmin ? (
    <div className="info-strip">
      Access denied. Only administrators can access this page.
    </div>
  ) : (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMIN WORKSPACE</span>
          <h1>Admin panel</h1>
          <p>Review and manage submitted civic reports.</p>
        </div>
        <span className="demo-pill">
          <span /> Admin access verified
        </span>
      </div>

      <div className="content-panel admin-table-panel">
        <div className="panel-heading">
          <div>
            <h2>Report management</h2>
            <p>{reports.length} reports</p>
          </div>
        </div>

        <div className="table-scroll">
          <table className="reports-table">
            <thead>
              <tr>
                <th>REPORT</th>
                <th>CATEGORY</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>VIEW</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <strong>{report.title}</strong>
                    <small>
                      {report.id} · {report.location}
                    </small>
                  </td>
                  <td>{report.category}</td>
                  <td>
                    <PriorityBadge priority={report.priority} />
                  </td>
                 <td>
  <select
    value={report.status}
    onChange={(event) =>
      handleStatusChange(report, event.target.value)
    }
    disabled={updatingReportId === report.id}
  >
    <option value="Reported">Reported</option>
    <option value="Under Review">Under Review</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
  </select>
</td>
                  <td>
                    <button
                      className="table-view"
                      onClick={() => openReport(report)}
                    >
                      View ↗
                    </button>
                  </td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td colSpan={5}>No reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
)}


          <footer className="page-footer">
            <span>© 2026 CivicFix AI · Built for better communities.</span>
            <span><i /> </span>
          </footer>
        </div>
      </main>

      {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmit={createReport} />}
      {selectedReport && <ReportDetail report={selectedReport} onClose={() => setSelectedReport(null)} />}
    </div>
  );
}

export default App;
