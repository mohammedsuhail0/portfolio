export const config = {
    developer: {
        name: "Suhail",
        fullName: "Mohammed Suhail",
        title: "Full-Stack Engineer",
        description: "Specialising in AI-assisted development, rapid prototyping, and end-to-end application delivery. IT Undergraduate at ISL Engineering College & Certified in Data Science by Fullstack Academy."
    },
    social: {
        github: "mohammedsuhail0",
        email: "mdsuhailtab.1@gmail.com",
        location: "Hyderabad, India"
    },
    about: {
        title: "About Me",
        description: "I am a Full-Stack Engineer and Information Technology undergraduate at ISL Engineering College, Hyderabad (Class of 2028), certified in Data Science from Fullstack Academy. I engineer robust, end-to-end web architectures, high-performance APIs, and AI-assisted simulation and analytics platforms. Driven by rapid prototyping and systematic software engineering, I bridge intelligent systems with intuitive user experiences."
    },
    experiences: [
        {
            position: "Full-Stack Engineer & Prototyping",
            company: "Independent Projects & Client Delivery",
            period: "2024 - Present",
            location: "Hyderabad, India",
            description: "Designing and shipping production-ready web platforms, collaborative apps, and AI-assisted tooling across Next.js, React, Node.js, and cloud ecosystems.",
            responsibilities: [
                "Architecting end-to-end full-stack applications with Next.js, React, and TypeScript",
                "Building resilient REST APIs, real-time WebSockets, and database schemas with PostgreSQL and MongoDB",
                "Integrating AI workflows, evaluation pipelines, and simulation tools into web interfaces",
                "Managing cloud deployments on Vercel and Docker with performance optimization"
            ],
            technologies: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "TailwindCSS"]
        },
        {
            position: "Data Science Specialization",
            company: "Fullstack Academy Center of Excellence",
            period: "2025 - 2026",
            location: "Hyderabad, India",
            description: "Intensive advanced data science program covering statistical modeling, predictive analytics, exploratory data analysis, and machine learning pipelines. Awarded Certificate of Excellence.",
            responsibilities: [
                "Mastered predictive modeling, supervised and unsupervised machine learning workflows",
                "Implemented end-to-end data pipelines using Python, Pandas, NumPy, and Scikit-learn",
                "Conducted real-world data analysis, hypothesis testing, and interactive dashboarding",
                "Earned Certificate of Excellence in Data Science (Oct 2025 – Jan 2026)"
            ],
            technologies: ["Python", "Data Science", "Scikit-Learn", "Pandas", "NumPy", "EDA"]
        },
        {
            position: "Google AI/ML Virtual Intern",
            company: "Google for Developers / AICTE EduSkills",
            period: "2025",
            location: "Virtual",
            description: "Comprehensive AI/ML virtual internship sponsored by Google for Developers and AICTE. Completed hands-on training in machine learning concepts, computer vision, and neural networks with Grade O (Outstanding).",
            responsibilities: [
                "Trained and evaluated deep learning models with TensorFlow and Keras",
                "Explored computer vision techniques, CNNs, and classification algorithms",
                "Completed production-grade assignments with Grade O (Outstanding performance)",
                "Applied modern ML practices to real-world datasets"
            ],
            technologies: ["TensorFlow", "Python", "Computer Vision", "Deep Learning", "AICTE"]
        },
        {
            position: "Hackathon Finalist & Builder",
            company: "Smart India Hackathon & HackForge ISL",
            period: "2024 - 2025",
            location: "Hyderabad, India",
            description: "Led development and prototyping for high-stakes hackathons with Team Punk Records, including ArogyaMitr (SIH PS 26133) and HackForge ISL.",
            responsibilities: [
                "Spearheaded technical architecture and rapid feature deployment under strict 24-48h deadlines",
                "Built healthcare resource aggregation platform ArogyaMitr for SIH PS 26133",
                "Secured top ranks across institutional hackathons with Team Punk Records",
                "Coordinated cross-functional teamwork, pitch decks, and live interactive demos"
            ],
            technologies: ["Rapid Prototyping", "Next.js", "WebSockets", "SIH", "HackForge"]
        },
        {
            position: "B.Tech in Information Technology",
            company: "ISL Engineering College",
            period: "2024 - 2028",
            location: "Hyderabad, India",
            description: "Pursuing Bachelor of Technology in Information Technology. Focusing on data structures, algorithms, operating systems, database management systems, and modern software architecture.",
            responsibilities: [
                "Deep study of core computer science fundamentals and system design",
                "Active contributor to technical clubs, workshops, and hackathons",
                "Applied academic theories directly into production-grade personal projects"
            ],
            technologies: ["Information Technology", "DSA", "DBMS", "Software Engineering"]
        }
    ],
    projects: [
        {
            id: 1,
            title: "NextPatient",
            category: "Clinical AI / Simulation",
            technologies: "Next.js, TypeScript, AI OSCE Engine, TailwindCSS, Vercel",
            image: "/projects/nextpatient.png",
            description: "Clinical AI OSCE Simulation Station delivering realistic patient dialogue, diagnostic evaluation checklists, and real-time medical simulation for clinical trainees.",
            link: "https://nextpatient-app.vercel.app/"
        },
        {
            id: 2,
            title: "BroSync (Seamless)",
            category: "Real-Time Collaboration",
            technologies: "Next.js, WebSockets, Node.js, Canvas API, TailwindCSS",
            image: "/projects/seamless-brosync.png",
            description: "High-performance real-time collaboration canvas with zero-latency synchronized state, multiplayer interactions, and instant workspace sharing.",
            link: "https://brosync.vercel.app/"
        },
        {
            id: 3,
            title: "Smart Attendance System",
            category: "Full-Stack Web App",
            technologies: "React, Node.js, Express, MongoDB, TailwindCSS",
            image: "/projects/smart-attendance.png",
            description: "Automated institutional attendance platform with real-time analytics dashboards, role-based access control, and comprehensive student tracking reports.",
            link: "https://smart-attendance-ecru-nu.vercel.app"
        },
        {
            id: 4,
            title: "ShieldSense",
            category: "Cybersecurity / Agent",
            technologies: "Next.js, TypeScript, Threat Intelligence API, TailwindCSS",
            image: "/projects/shield-sense.png",
            description: "Intelligent security monitoring dashboard and threat intelligence agent built for SPEC's Industry Hack 2026, providing proactive vulnerability scanning and system posture metrics.",
            link: "https://shieldsense-security-agent.vercel.app",
            certificateUrl: "/certificates/industry-hack-stpeters-certificate.png"
        },
        {
            id: 5,
            title: "ArogyaMitr (SIH PS 26133)",
            category: "Healthcare / SIH",
            technologies: "Next.js, TypeScript, GeoLocation, REST APIs, TailwindCSS",
            image: "/projects/sih-arogyamitr.png",
            description: "Built for Smart India Hackathon PS 26133: Centralized healthcare access and emergency bed tracking platform connecting patients with regional hospitals in real time.",
            link: "https://mahahealthconnect.vercel.app"
        },
        {
            id: 6,
            title: "Secure Online Exam Portal",
            category: "EdTech / Security",
            technologies: "React, Node.js, Express, Proctoring, MongoDB",
            image: "/projects/secure-exam-portal.png",
            description: "Secure, tamper-resistant online examination portal with automated anti-cheat detection, timer enforcement, and instantaneous test result computation.",
            link: "https://secure-online-exam-portal-zt.vercel.app"
        },
        {
            id: 7,
            title: "VitaForge",
            category: "Health & Fitness",
            technologies: "React, TypeScript, Nutrition & Workout API, TailwindCSS",
            image: "/projects/fitness-tracker.png",
            description: "Comprehensive fitness tracking and workout companion application with custom routine planners, caloric tracking, and progress charts.",
            link: "https://excersise-iota.vercel.app"
        },
        {
            id: 8,
            title: "MaternaGuard",
            category: "Healthcare / AI",
            technologies: "React, TypeScript, Health Analytics, TailwindCSS",
            image: "/projects/ai-maternity-nanny.png",
            description: "AI-assisted maternal and infant care health monitor providing scheduled vitals tracking, symptom guidance, and pediatric milestones.",
            link: "https://frontend-pied-pi-riv3w4y14c.vercel.app"
        },
        {
            id: 9,
            title: "BUILDR",
            category: "Developer Tools",
            technologies: "Next.js, TypeScript, UI Components, TailwindCSS",
            image: "/projects/builder-app.png",
            description: "Modular application builder and UI scaffolding workspace enabling creators to assemble and preview web components rapidly.",
            link: "https://buildr-liart.vercel.app"
        },
        {
            id: 10,
            title: "Hyderabad House Rental Analytics",
            category: "Data Science & EDA",
            technologies: "Python, Pandas, NumPy, Matplotlib, Scikit-learn, EDA",
            image: "/projects/house-rental-analytics.png",
            description: "In-depth exploratory data analysis and price prediction modeling on Hyderabad real-estate rental trends across key metropolitan localities.",
            link: "https://github.com/mohammedsuhail0"
        },
        {
            id: 11,
            title: "New Rosary Convent High School",
            category: "Web Development",
            technologies: "HTML5, CSS3, JavaScript, Responsive Web Architecture",
            image: "/projects/nrchs-custom-theme.png",
            description: "Custom digital presence and institutional portal for New Rosary Convent High School featuring notice boards, admissions flow, and curriculum overviews.",
            link: "https://newrosaryconvent.in"
        }
    ],
    contact: {
        email: "mdsuhailtab.1@gmail.com",
        github: "https://github.com/mohammedsuhail0",
        linkedin: "https://linkedin.com/in/mohammed-suhail-b39883274",
        twitter: "https://x.com",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com"
    },
    skills: {
        develop: {
            title: "FULL-STACK ENGINEER",
            description: "End-to-end application delivery & rapid prototyping",
            details: "Architecting resilient, production-ready web applications using Next.js, React, TypeScript, Node.js, and modern databases. Skilled in clean code, rapid iterative delivery, and scalable API design.",
            tools: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "MongoDB", "TailwindCSS", "REST APIs", "WebSockets", "Docker", "Git"]
        },
        design: {
            title: "AI-ASSISTED SYSTEMS",
            description: "Intelligent workflows, simulations & data science",
            details: "Integrating AI assistance, clinical simulation engines, predictive modeling, and data pipelines into modern web architectures. Certified in Data Science by Fullstack Academy.",
            tools: ["Python", "Data Science", "Scikit-Learn", "Pandas", "NumPy", "TensorFlow", "EDA", "AI Workflows", "Vercel", "FastAPI"]
        }
    }
};
