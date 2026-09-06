export type ProjectCategory = 
  | "Featured Platform"
  | "Autonomous AI Agent"
  | "Full-Stack System"
  | "Career Milestone"
  | "Hackathon Participant"
  | "Side Project"
  | "Data Science & ML";

export interface ITimelineGalleryItem {
  url: string;
  caption: string;
}

export interface ITimelineItem {
  id: string;
  title: string;
  category: string;
  description: string;
  gradient: [string, string];
  githubUrl?: string;
  liveUrl?: string;
  tech: string[];
  status: "Completed" | "Side Project" | "Hackathon Participant" | "Milestone";
  image?: string;
  gallery?: ITimelineGalleryItem[];
}

export interface ISkill {
  name: string;
  category: "Language" | "Framework" | "AI/ML" | "Database" | "Tool";
  iconName: string;
  color: string;
}

export const PERSONAL_INFO = {
  name: "Mohammed Suhail",
  shortName: "suhail",
  role: "AI/ML Engineer & Full-Stack Developer",
  headline: "Hello, I'm Mohammed Suhail.",
  statusBadge: "Available for work",
  bio: "Information Technology undergrad (Class of 2028) specializing in Data Science & Google Virtual Intern (AI/ML). Focused on engineering intelligent systems, robust machine learning pipelines, and aesthetic full-stack web applications; based in Hyderabad, India!",
  email: "mdsuhailtab.1@gmail.com",
  secondaryEmail: "mdsuhailtab.1@outlook.com",
  phone: "+916301633463",
  phoneDisplay: "+91 63016 33463",
  resumeUrl: "/Mohammed_Suhail_Resume.pdf",
  location: "Hyderabad, India",
  locationFull: "Riyasat Nagar, Hyderabad, India",
  stats: [
    { label: "Completed", value: "14+", sublabel: "Projects & Repos" },
    { label: "Tracked", value: "500+", sublabel: "Git Contributions" },
    { label: "Specialized", value: "AI/ML", sublabel: "Data Science" },
  ],
  socials: {
    github: "https://github.com/mohammedsuhail0",
    linkedin: "https://www.linkedin.com/in/mohammed-suhail-b39883274/",
    email: "mailto:mdsuhailtab.1@gmail.com",
    outlook: "mailto:mdsuhailtab.1@outlook.com",
    phone: "tel:+916301633463",
    whatsapp: "https://wa.me/916301633463",
  },
};

export const SKILLS: ISkill[] = [
  { name: "Python", category: "Language", iconName: "SiPython", color: "#3776AB" },
  { name: "TypeScript", category: "Language", iconName: "SiTypescript", color: "#3178C6" },
  { name: "JavaScript", category: "Language", iconName: "SiJavascript", color: "#F7DF1E" },
  { name: "React.js", category: "Framework", iconName: "SiReact", color: "#61DAFB" },
  { name: "Next.js", category: "Framework", iconName: "SiNextdotjs", color: "#FFFFFF" },
  { name: "Tailwind CSS", category: "Framework", iconName: "SiTailwindcss", color: "#06B6D4" },
  { name: "PyTorch", category: "AI/ML", iconName: "SiPytorch", color: "#EE4C2C" },
  { name: "TensorFlow", category: "AI/ML", iconName: "SiTensorflow", color: "#FF6F00" },
  { name: "Scikit-Learn", category: "AI/ML", iconName: "SiScikitlearn", color: "#F7931E" },
  { name: "FastAPI", category: "Framework", iconName: "SiFastapi", color: "#009688" },
  { name: "Node.js", category: "Framework", iconName: "SiNodedotjs", color: "#339933" },
  { name: "PostgreSQL", category: "Database", iconName: "SiPostgresql", color: "#4169E1" },
  { name: "MongoDB", category: "Database", iconName: "SiMongodb", color: "#47A248" },
  { name: "Docker", category: "Tool", iconName: "SiDocker", color: "#2496ED" },
  { name: "Git & GitHub", category: "Tool", iconName: "SiGithub", color: "#FFFFFF" },
  { name: "Figma", category: "Tool", iconName: "SiFigma", color: "#F24E1E" },
];

export const TIMELINE_DATA: ITimelineItem[] = [
  {
    id: "attendance-system",
    title: "Smart Attendance System",
    category: "Full-Stack System",
    description: "Automated organizational roll-call tracking with administrative management, real-time logs, and exportable reports.",
    gradient: ["#7C2D12", "#F97316"],
    githubUrl: "https://github.com/mohammedsuhail0/attendence",
    liveUrl: "https://smart-attendance-ecru-nu.vercel.app",
    image: "/projects/smart-attendance.png",
    tech: ["TypeScript", "React", "Node.js", "SQL"],
    status: "Completed",
  },
  {
    id: "seamless-platform",
    title: "Seamless (BroSync)",
    category: "Full-Stack Platform",
    description: "Engineered fluid UI state management and lightning-fast cross-client real-time synchronization.",
    gradient: ["#064E3B", "#10B981"],
    githubUrl: "https://github.com/mohammedsuhail0/seamless",
    liveUrl: "https://brosync.vercel.app/",
    image: "/projects/seamless-brosync.png",
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
    status: "Completed",
  },
  {
    id: "ai-agent",
    title: "AI Email Agent (AI-AGENT-)",
    category: "Autonomous AI Agent",
    description: "Automated multi-step reasoning, external tool execution, and smart email drafting with LLMs.",
    gradient: ["#581C87", "#A855F7"],
    githubUrl: "https://github.com/mohammedsuhail0/AI-AGENT-",
    liveUrl: "https://personal-email-agent.vercel.app",
    image: "/projects/ai-agent.png",
    tech: ["Python", "LLMs", "LangChain", "FastAPI"],
    status: "Completed",
  },
  {
    id: "shield-sense",
    title: "ShieldSense",
    category: "Security AI Agent",
    description: "Monitors system audit logs to detect security anomalies and automate threat incident response.",
    gradient: ["#0F172A", "#334155"],
    githubUrl: "https://github.com/mohammedsuhail0/PUNK-RECORDS-SPIH168-",
    liveUrl: "https://shieldsense-security-agent.vercel.app",
    image: "/projects/shield-sense.png",
    gallery: [
      { url: "/projects/shield-sense.png", caption: "ShieldSense — Autonomous AI Security Guardian Landing Page" },
      { url: "/projects/shield-sense-mobile.png", caption: "ShieldSense — Cyber Sentinel Interactive In-App Agent" },
    ],
    tech: ["Python", "FastAPI", "Security Analytics", "Tailwind CSS"],
    status: "Completed",
  },
  {
    id: "hackathon-sih",
    title: "ArogyaMitr (Smart India Hackathon)",
    category: "Hackathon Innovation",
    description: "Vernacular voice & pictorial kiosk and assisted clinical risk triage platform engineered for SIH PS 26133 with Team Punk Records.",
    gradient: ["#C2410C", "#FB923C"],
    githubUrl: "https://github.com/mohammedsuhail0/SIH-PUNK-RECORDS-",
    liveUrl: "https://mahahealthconnect.vercel.app",
    image: "/projects/sih-arogyamitr.png",
    gallery: [
      { url: "/projects/sih-arogyamitr.png", caption: "ArogyaMitr — Vernacular Voice & Pictorial Health Kiosk Dashboard" },
    ],
    tech: ["TypeScript", "Next.js", "Voice AI", "FHIR R4", "Offline SQLite"],
    status: "Hackathon Participant",
  },
  {
    id: "hackathon-industry-stpeters",
    title: "SPEC's Industry Hack 2026",
    category: "Hackathon Participant",
    description: "24-Hour National Level Hackathon at St. Peter's Engineering College solving industry challenges with Team Punk Records.",
    gradient: ["#7C3AED", "#A78BFA"],
    githubUrl: "https://github.com/mohammedsuhail0",
    tech: ["24-Hour Hackathon", "Team Punk Records", "Full-Stack AI"],
    status: "Hackathon Participant",
    image: "/hackathons/industry-hack-stpeters-team.png",
    gallery: [
      { url: "/hackathons/industry-hack-stpeters-team.png", caption: "Team Punk Records at St. Peter's Engineering College" },
      { url: "/certificates/industry-hack-stpeters-certificate.png", caption: "Official Participation Certificate" },
    ],
  },
  {
    id: "hackathon-hackforge-isl",
    title: "HackForge 2.0 — ISL",
    category: "Hackathon Participant",
    description: "12-Hour rapid innovation team hackathon at ISL Engineering College building agile software prototypes.",
    gradient: ["#0284C7", "#38BDF8"],
    githubUrl: "https://github.com/mohammedsuhail0",
    tech: ["12-Hour Sprint", "ISL Engineering College", "UI Prototyping"],
    status: "Hackathon Participant",
    image: "/hackathons/hackforge-isl-team.jpg",
    gallery: [
      { url: "/hackathons/hackforge-isl-team.jpg", caption: "HackForge 2.0 Team Sprint at ISL Engineering College" },
      { url: "/certificates/hackforge-isl-certificate.jpg", caption: "HackForge 2.0 Certificate of Participation" },
    ],
  },
  {
    id: "hackathon-fsa",
    title: "FSA Hackathon — Full Stack Academy",
    category: "Hackathon Participant",
    description: "Designed and shipped an interactive web prototype under competitive hackathon time constraints.",
    gradient: ["#B45309", "#FBBF24"],
    githubUrl: "https://github.com/mohammedsuhail0/FSA-HACKATON",
    tech: ["Full Stack Academy", "Web Prototyping", "JavaScript"],
    status: "Hackathon Participant",
    image: "/hackathons/fsa-hackathon-award.png",
    gallery: [
      { url: "/hackathons/fsa-hackathon-award.png", caption: "FSA Hackathon Certificate of Participation Stage Presentation" },
      { url: "/hackathons/fsa-hackathon-working.png", caption: "Mohammed Suhail at FSA Hackathon Sprint" },
    ],
  },
  {
    id: "eureka-iit-bombay",
    title: "Eureka! Pitching — E-Cell IIT Bombay",
    category: "Career Milestone",
    description: "Participated in the prestigious National Entrepreneurship Challenge pitching competition organized by E-Cell IIT Bombay at ISL.",
    gradient: ["#1E3A8A", "#60A5FA"],
    githubUrl: "https://github.com/mohammedsuhail0",
    tech: ["E-Cell IIT Bombay", "Pitching Competition", "Entrepreneurship"],
    status: "Milestone",
    image: "/certificates/eureka-iit-bombay-certificate.jpg",
    gallery: [
      { url: "/certificates/eureka-iit-bombay-certificate.jpg", caption: "E-Cell IIT Bombay National Entrepreneurship Challenge Certificate" },
    ],
  },
  {
    id: "fsa-data-science",
    title: "Data Science Specialization",
    category: "Career Milestone",
    description: "Awarded Certificate of Excellence for completing comprehensive Data Science & ML training at Full Stack Academy Center of Excellence (Oct 2025 – Jan 2026).",
    gradient: ["#047857", "#10B981"],
    githubUrl: "https://github.com/mohammedsuhail0",
    tech: ["Data Science", "Machine Learning", "Full Stack Academy", "Certificate of Excellence"],
    status: "Milestone",
    image: "/certificates/fsa-award-ceremony.jpg",
    gallery: [
      { url: "/certificates/fsa-award-ceremony.jpg", caption: "Award Presentation Ceremony — Full Stack Academy Center of Excellence" },
      { url: "/certificates/fsa-certificate-holding.png", caption: "Certificate of Excellence — Data Science Specialization" },
      { url: "/certificates/fsa-data-science-certificate.jpg", caption: "Official Certificate of Excellence (Oct 2025 – Jan 2026)" },
    ],
  },
  {
    id: "google-internship",
    title: "Google Virtual Internship (AI/ML)",
    category: "Career Milestone",
    description: "10-week AI-ML Virtual Internship supported by Google for Developers (India Edu Program), AICTE & EduSkills — completed with Grade O (Outstanding).",
    gradient: ["#1E1B4B", "#6366F1"],
    githubUrl: "https://github.com/mohammedsuhail0",
    tech: ["Google for Developers", "AI/ML", "Grade O (Outstanding)", "AICTE & EduSkills"],
    status: "Milestone",
    image: "/certificates/google-aiml-virtual-internship-certificate.png",
    gallery: [
      { url: "/certificates/google-aiml-virtual-internship-certificate.png", caption: "Google for Developers AI-ML Virtual Internship Certificate (Grade O - Outstanding)" },
    ],
  },
  {
    id: "secure-exam-portal",
    title: "Secure Online Exam Portal",
    category: "Full-Stack System",
    description: "Prevented examination malpractice with synchronized sessions, question shuffling, and anti-tab detection.",
    gradient: ["#1E293B", "#475569"],
    githubUrl: "https://github.com/mohammedsuhail0/exam",
    liveUrl: "https://secure-online-exam-portal-zt.vercel.app",
    image: "/projects/secure-exam-portal.png",
    tech: ["HTML5", "JavaScript", "CSS3", "Vercel"],
    status: "Completed",
  },
  {
    id: "fitness-tracker",
    title: "Exercise & Fitness Tracker (VitaForge)",
    category: "Health Tech Platform",
    description: "Helps users track daily workout routines, monitor caloric burn, and visualize personal health trends.",
    gradient: ["#047857", "#34D399"],
    githubUrl: "https://github.com/mohammedsuhail0/excersise",
    liveUrl: "https://excersise-iota.vercel.app",
    image: "/projects/fitness-tracker.png",
    tech: ["TypeScript", "React", "Tailwind CSS"],
    status: "Completed",
  },
  {
    id: "ai-maternity-nanny",
    title: "MaternaGuard (AI Maternity Nanny)",
    category: "Health Tech Platform",
    description: "Personalized 24/7 maternal wellness guidance, nutrition timelines, and smart symptom analysis.",
    gradient: ["#831843", "#EC4899"],
    githubUrl: "https://github.com/mohammedsuhail0/AI-mternity-nanny-",
    liveUrl: "https://frontend-pied-pi-riv3w4y14c.vercel.app",
    image: "/projects/ai-maternity-nanny.png",
    tech: ["TypeScript", "React", "Tailwind CSS", "AI APIs"],
    status: "Completed",
  },
  {
    id: "builder-app",
    title: "BUILDR (Collegiate Builder Playground)",
    category: "Full-Stack Platform",
    description: "Visual collegiate developer workspace to compose, prototype, and ship responsive applications.",
    gradient: ["#164E63", "#06B6D4"],
    githubUrl: "https://github.com/mohammedsuhail0/builder",
    liveUrl: "https://buildr-liart.vercel.app",
    image: "/projects/builder-app.png",
    tech: ["TypeScript", "Next.js", "React", "Supabase Auth", "Tailwind CSS"],
    status: "Completed",
  },
  {
    id: "house-rental-analytics",
    title: "Hyderabad House Rental Analytics",
    category: "Data Science & ML",
    description: "Analyzed urban real estate rental patterns using multivariate regression and Power BI dashboards.",
    gradient: ["#065F46", "#34D399"],
    githubUrl: "https://github.com/mohammedsuhail0/house-rental-analytics",
    image: "/projects/house-rental-analytics.png",
    tech: ["Python", "Pandas", "Scikit-Learn", "Power BI"],
    status: "Completed",
  },
  {
    id: "nrchs-wordpress-theme",
    title: "NRCHS Custom Theme",
    category: "Side Project",
    description: "Engineered a custom responsive CMS architecture with tailored post types and dynamic template logic.",
    gradient: ["#312E81", "#818CF8"],
    githubUrl: "https://github.com/mohammedsuhail0/nrchs-wordpress-theme",
    tech: ["PHP", "WordPress API", "JavaScript", "CSS"],
    status: "Side Project",
  },
];

export const WORKING_STEPS = [
  {
    stepNumber: "Step 1",
    title: "Planning & Strategy",
    description:
      "We collaborate to map out project goals, data requirements, and key functionalities. We determine system architecture, user workflows, and tech stack over an aligned plan.",
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    stepNumber: "Step 2",
    title: "Development & Progress Update",
    description:
      "Once aligned, I dive into engineering the AI pipelines, algorithms, and frontend interfaces. From data models to polished interactive code, I keep you updated at every milestone.",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    stepNumber: "Step 3",
    title: "Testing & Production Launch",
    description:
      "This is where the magic comes alive! Rigorous testing, speed optimization, and responsive design verification ensure your application launches smoothly with exceptional performance.",
    gradient: "from-emerald-600 to-teal-600",
  },
];
