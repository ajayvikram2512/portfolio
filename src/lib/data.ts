/**
 * Single source of truth for every piece of text on the site.
 * Everything here is taken from the résumé PDF (Ajay_Vikram_.pdf), including its
 * embedded hyperlinks. Nothing is invented: if the résumé doesn't say it, it isn't here.
 */

export const PROFILE = {
  name: "Ajay Vikram V",
  firstName: "Ajay",
  initials: "AV",
  // The résumé has no job title; this is its own wording for the headline.
  role: "Applied Data Science postgraduate",
  email: "ajayvikram2512@gmail.com",
  phone: "+91 74189 81302",
  phoneHref: "tel:+917418981302",
  // The résumé places the M.Sc. at SRM University, Chennai, India.
  location: "Chennai, India",
  resumeSummary:
    "Applied Data Science postgraduate with a strong foundation in Python, SQL, machine learning, deep learning, and data visualization. Experienced in developing AI-driven solutions through academic projects and internships, with a focus on delivering scalable, data-driven applications and business insights.",
  // second short line, taken from the résumé's internship entry
  currentLine: "Data Analyst Intern at Vektor Labs, Aug 2026 – Oct 2026.",
  github: "https://github.com/ajayvikram2512",
  linkedin: "https://www.linkedin.com/in/ajay-vikram-v-26763a24b/",
  portfolio: "https://ajayvikram2512.github.io/portfolio/",
  resume: "/resume.pdf",
  graduation: "May 2027",
} as const;

export type NavItem = { id: string; label: string };

export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export type SkillGroup = { family: string; skills: { name: string; symbol: string; usedIn: string[] }[] };

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages",
    skills: [
      { name: "Python", symbol: "Py", usedIn: ["Crop Suggestion Using API Integration"] },
      { name: "SQL", symbol: "Sq", usedIn: [] },
    ],
  },
  {
    family: "Libraries",
    skills: [
      { name: "Pandas", symbol: "Pd", usedIn: [] },
      { name: "NumPy", symbol: "Np", usedIn: [] },
      { name: "Matplotlib", symbol: "Mp", usedIn: [] },
      { name: "Seaborn", symbol: "Sb", usedIn: [] },
    ],
  },
  {
    family: "Tools",
    skills: [
      { name: "GitHub", symbol: "Gh", usedIn: [] },
      { name: "VS Code", symbol: "Vs", usedIn: [] },
      { name: "Power BI", symbol: "Pb", usedIn: [] },
      { name: "Excel", symbol: "Ex", usedIn: ["TN DMART Sample Data Analysis"] },
    ],
  },
  {
    family: "Machine Learning",
    skills: [
      { name: "Classification", symbol: "Cl", usedIn: ["Brain Tumor Detection & Explainable AI", "Crop Suggestion Using API Integration"] },
      { name: "Data Preprocessing", symbol: "Dp", usedIn: [] },
      { name: "Model Training", symbol: "Mt", usedIn: [] },
    ],
  },
  {
    family: "Other Technologies",
    skills: [
      { name: "Deep Learning", symbol: "Dl", usedIn: ["Brain Tumor Detection & Explainable AI"] },
      { name: "Explainable AI", symbol: "Xa", usedIn: ["Brain Tumor Detection & Explainable AI"] },
      { name: "RAG", symbol: "Rg", usedIn: ["Offline RAG Chatbot"] },
      { name: "Data Visualization", symbol: "Dv", usedIn: ["TN DMART Sample Data Analysis"] },
    ],
  },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  period: string;
  description: string;
  features: string[];
  tech: string[];
  github?: string;
  links?: { label: string; href: string }[];
};

export const PROJECTS: Project[] = [
  {
    id: "gmail-agent",
    index: "01",
    title: "AI-Powered Gmail Automation Agent",
    kicker: "Gmail Automation, AI Workflows, Knowledge Base",
    period: "May 2026 – Jun 2026",
    description:
      "Built an AI-powered email automation agent with a configured knowledge base and conditional workflows to read, understand, and respond to emails based on intent and content.",
    features: [
      "Configured knowledge base",
      "Conditional workflows",
      "Replies based on intent and content",
      "Automated end-to-end email processing, reducing manual effort and improving operational efficiency.",
    ],
    tech: ["Gmail Automation", "AI Workflows", "Knowledge Base"],
  },
  {
    id: "brain-tumor",
    index: "02",
    title: "Brain Tumor Detection & Explainable AI",
    kicker: "CNN, EfficientNet, Grad-CAM",
    period: "Feb 2026 – Mar 2026",
    description:
      "Built a multi-class brain tumor classifier from MRI images using EfficientNetB0 transfer learning, achieving ~88% accuracy and 0.97 AUC.",
    features: [
      "Multi-class classification of MRI images",
      "EfficientNetB0 transfer learning",
      "~88% accuracy and 0.97 AUC",
      "Applied Grad-CAM to visualize tumor regions and improve model interpretability.",
    ],
    tech: ["CNN", "EfficientNet", "Grad-CAM"],
    github: "https://github.com/ajayvikram2512/brain_tumor_pediction",
  },
  {
    id: "offline-rag",
    index: "03",
    title: "Offline RAG Chatbot",
    kicker: "LLMs, Vector Databases",
    period: "Aug 2025 – Sep 2025",
    description:
      "Developed a fully offline RAG chatbot with document ingestion, chunking, retrieval, and response pipeline, optimized using quantized GGUF models.",
    features: [
      "Document ingestion and chunking",
      "Retrieval and response pipeline",
      "Quantized GGUF models",
      "Fully offline",
    ],
    tech: ["LLMs", "Vector Databases"],
    github: "https://github.com/ajayvikram2512/RAG_OFFLINE_ACCURATE",
    links: [
      {
        label: "Book chapter ↗",
        href: "https://www.cambridgescholars.com/product/978-1-0364-7808-7/",
      },
    ],
  },
  {
    id: "crop-suggestion",
    index: "04",
    title: "Crop Suggestion Using API Integration",
    kicker: "Python, Machine Learning, Gemini API",
    period: "Sep 2024 – Dec 2024",
    description:
      "Built a Decision Tree classifier for soil quality prediction and integrated the Gemini API for climate-based crop recommendations via a CLI tool.",
    features: [
      "Decision Tree classifier for soil quality prediction",
      "Gemini API for climate-based crop recommendations",
      "Command-line (CLI) tool",
    ],
    tech: ["Python", "Machine Learning", "Gemini API"],
    github: "https://github.com/ajayvikram2512/Crop-Suggestion-Using-API-Integration",
  },
  {
    id: "dmart",
    index: "05",
    title: "TN DMART Sample Data Analysis",
    kicker: "Excel",
    period: "Jul 2024 – Aug 2024",
    description: "Analyzed retail sales data and built interactive dashboards.",
    features: [
      "Identified top-performing cities, payment modes, and product categories.",
      "Provided actionable insights for retail decision-making.",
    ],
    tech: ["Excel"],
    github: "https://github.com/ajayvikram2512/TN-DMART-Sample-Data-Analysis",
  },
];

export type Certification = {
  title: string;
  issuer: string;
  slug: string; // files: /certs/<slug>.webp + .pdf, logo: /logos/issuers/<slug>.png
  date: string;
};

export const CERTIFICATIONS: Certification[] = [
  { title: "Foundations of Data Analytics", issuer: "Google", slug: "google", date: "Apr 19, 2025" },
  { title: "Developing AI Applications with Python and Flask", issuer: "IBM", slug: "ibm", date: "Apr 3, 2025" },
  { title: "Data Analysis and Visualization with Power BI", issuer: "Microsoft", slug: "microsoft", date: "Aug 29, 2024" },
  { title: "AI For Everyone", issuer: "DeepLearning.AI", slug: "deeplearning", date: "Mar 15, 2025" },
  { title: "Predictive Modeling with Logistic Regression using SAS", issuer: "SAS", slug: "sas", date: "Sep 26, 2024" },
];

export type Stop = { kind: "Education" | "Internship"; when: string; title: string; place: string; detail: string };

// Chronological by start date.
export const EXPERIENCE: Stop[] = [
  {
    kind: "Education",
    when: "Aug 2022 – May 2025",
    title: "B.Sc. Data Science and Analytics",
    place: "Jain University · Bangalore, India",
    detail: "CGPA: 6.65",
  },
  {
    kind: "Internship",
    when: "Nov 2023 – Jan 2024",
    title: "Data Science Intern",
    place: "Intrainz Edutech",
    detail: "Assisted in data preprocessing, analysis, and machine learning model development.",
  },
  {
    kind: "Education",
    when: "Jul 2025 – May 2027",
    title: "M.Sc. Applied Data Science",
    place: "SRM University · Chennai, India",
    detail: "CGPA: 9.5",
  },
  {
    kind: "Internship",
    when: "Apr 2026",
    title: "Data Analytics Job Simulation",
    place: "Deloitte",
    detail: "Contributed to a simulated data analytics project by analyzing data and creating visualizations.",
  },
  {
    kind: "Internship",
    when: "Aug 2026 – Oct 2026",
    title: "Data Analyst Intern",
    place: "Vektor Labs",
    detail:
      "Analyzed real-world datasets to identify business trends, uncover performance gaps, and provide data-driven insights to support business decision-making.",
  },
];

// The résumé has no achievements / competitive-programming section, so the
// Achievements section (and its nav link) is intentionally not built.
export const ACHIEVEMENTS: never[] = [];
