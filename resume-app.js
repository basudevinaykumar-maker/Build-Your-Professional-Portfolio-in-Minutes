/**
 * ResumeAI Pro — Master ATS Resume & LinkedIn Engine
 * Application logic integrated with PortfolioAI Dashboard
 */

// ==========================================
// 1. APPLICATION STATE & DATA MODEL
// ==========================================

const AppState = {
  currentStep: 1,
  currentView: 'resume',
  resumeMode: 'student', // 'student' | 'experienced'
  isEditing: false,
  data: {
    personal: {
      fullName: '',
      targetRole: '',
      studentYear: '3rd Year',
      email: '',
      phone: '',
      location: '',
      linkedinUrl: '',
      githubUrl: ''
    },
    summary: {
      careerObjective: '',
      coreValues: '',
      yearsExperience: '',
      interests: ''
    },
    skills: {
      techSkills: '',
      toolsTech: '',
      softSkills: '',
      languages: ''
    },
    experience: [],
    projects: [],
    certifications: {
      certs: '',
      awards: '',
      hackathons: '',
      publications: ''
    },
    education: []
  }
};

// 🎓 Track 1: College Student / Internship Applicant Profile (1st–4th Year)
const STUDENT_SAMPLE_PROFILE = {
  personal: {
    fullName: 'Aryan K. Sharma',
    targetRole: 'Software Engineering Intern (Flutter & Full Stack)',
    studentYear: '3rd Year',
    email: 'aryan.sharma@nitk.edu.in',
    phone: '+91 98765 43210',
    location: 'Bangalore, India (Open to Remote)',
    linkedinUrl: 'linkedin.com/in/aryan-sharma-tech',
    githubUrl: 'github.com/aryansharma-dev'
  },
  summary: {
    careerObjective: 'Motivated 3rd Year Computer Science undergraduate with strong technical skills in Flutter, Dart, Firebase, and React. Passionate about building scalable cross-platform mobile apps and responsive web services with clean architecture and intuitive user experiences. Seeking a Software Engineering Internship to contribute directly to product velocity and collaborative engineering sprints.',
    coreValues: 'Problem Solving • Continuous Learning • Team Collaboration • User-Centric Design • Clean Architecture',
    yearsExperience: 'Fresher / Internship Applicant',
    interests: 'Cross-Platform App Development, Cloud-Native Backends, Algorithmic Optimization, Open-Source Contributions'
  },
  skills: {
    techSkills: 'Flutter, Dart, React.js, JavaScript (ES6+), Python, C++, Java, Node.js, SQL, HTML5/CSS3',
    toolsTech: 'Git, GitHub, Firebase (Firestore, Auth, Cloud Functions), REST APIs, Postman, SQLite, Provider, VS Code, Linux',
    softSkills: 'Analytical Problem Solving, Fast Learner, Agile Sprint Participation, Technical Documentation, Peer Code Review',
    languages: 'English (Professional Working), Hindi (Native)'
  },
  education: [
    {
      id: 'edu-1',
      college: 'National Institute of Technology Karnataka (NITK), Surathkal',
      degree: 'B.Tech in Computer Science & Engineering (3rd Year)',
      cgpa: '8.82 / 10.00',
      startYear: '2023',
      endYear: '2027 (Expected)',
      coursework: 'Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems (DBMS), Operating Systems, Computer Networks, Software Engineering'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'CampusPulse — Student Collaboration & Attendance Mobile App',
      techStack: 'Flutter, Dart, Firebase Firestore, Cloud Messaging, Provider',
      description: 'Engineered a cross-platform mobile application enabling 1,200+ college students to track attendance percentages, browse course syllabi, and receive real-time campus event announcements.\nImplemented reactive state management using Provider and local offline caching via SQLite, reducing app startup latency by 45%.\nConfigured automated push notification triggers using Firebase Cloud Functions with 99.4% delivery reliability.',
      githubLink: 'github.com/aryansharma-dev/campuspulse-app',
      liveLink: 'play.google.com/store/apps/details?id=com.campus.pulse'
    },
    {
      id: 'proj-2',
      name: 'DevConnect — Real-Time Peer Code Review & Collaboration Suite',
      techStack: 'React, Node.js, Express, MongoDB, Socket.io, TailwindCSS',
      description: 'Developed full stack collaborative web application enabling 500+ student developers to share code snippets and perform synchronized pair-programming.\nIntegrated WebSocket bi-directional communication channels for instant collaborative code editing with zero-latency synchronization.\nArchitected modular RESTful backend services with JWT authentication, bcrypt encryption, and input sanitization.',
      githubLink: 'github.com/aryansharma-dev/devconnect-platform',
      liveLink: 'devconnect-collab.web.app'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Mobile Application Development Intern',
      company: 'InnovateX Labs',
      location: 'Bangalore, India',
      duration: 'May 2025 – Jul 2025',
      responsibilities: 'Collaborated with senior engineers to implement 12+ reusable UI components in Flutter conforming to Material Design 3 guidelines.\nIntegrated REST API endpoints for user authentication, profile management, and live activity feeds with robust error handling.',
      achievements: 'Optimized app memory footprint by 28% through lazy list rendering and efficient widget rebuilding lifecycles.\nAuthored automated widget and unit tests, increasing codebase test coverage from 42% to 78%.'
    }
  ],
  certifications: {
    certs: 'Google Cloud Computing Foundations Certificate (Google Cloud, 2024)\nMeta Front-End Developer Professional Certificate (Coursera, 2024)\nProblem Solving (Intermediate) Certificate — HackerRank',
    awards: 'Institute Merit Scholarship (Top 5% of CSE department, 2023–2025)\nDean’s Academic Honor Roll (All Semesters)',
    hackathons: 'Finalist (Top 10 out of 450+ teams) — Smart India Hackathon (SIH 2024)\n1st Place Winner — CodeQuest Inter-College Hackathon 2024',
    publications: ''
  }
};

// 💼 Track 2: Experienced Job Seeker Profile (7+ Years Industry History)
const EXPERIENCED_SAMPLE_PROFILE = {
  personal: {
    fullName: 'Alexander R. Morgan',
    targetRole: 'Senior Full Stack Engineer & AI Systems Architect',
    studentYear: '',
    email: 'alex.morgan@alumni.stanford.edu',
    phone: '+1 (415) 890-4122',
    location: 'San Francisco, CA',
    linkedinUrl: 'linkedin.com/in/alexander-morgan',
    githubUrl: 'github.com/alexandermorgan'
  },
  summary: {
    careerObjective: 'Results-driven Senior Full Stack Engineer & Systems Architect with 7+ years of experience engineering high-throughput distributed systems, event-driven microservices, and enterprise LLM applications. Track record of scaling cloud infrastructure to 15M+ active users, optimizing database latency by 42%, and driving $3.2M in annual operational efficiency. Passionate about fault-tolerant backend architectures, TypeScript/React ecosystems, and production AI orchestration.',
    coreValues: 'System Scalability • Fault Tolerance • Problem Solving • Team Leadership • Continuous Innovation',
    yearsExperience: '7+ Years',
    interests: 'Distributed Consensus, Large Language Model Pipelines, Cloud-Native Scalability, Real-Time Data Streaming'
  },
  skills: {
    techSkills: 'TypeScript, Python, Go, React, Next.js, Node.js, FastAPI, PostgreSQL, GraphQL, REST APIs, Redis, Kafka, WebSockets',
    toolsTech: 'Docker, Kubernetes, AWS (ECS, Lambda, S3, RDS), Terraform, GitHub Actions, Datadog, Prometheus, Elasticsearch',
    softSkills: 'Cross-Functional Leadership, System Architecture, Agile/Scrum, Mentorship, High-Impact Technical Roadmapping',
    languages: 'English (Native/Bilingual), Spanish (Professional Working)'
  },
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Staff Software Engineer',
      company: 'Stripe — Core Infrastructure',
      location: 'San Francisco, CA',
      duration: 'Jan 2022 – Present',
      responsibilities: 'Spearheaded architecture and implementation of distributed payment processing pipelines handling 8,500+ transactions per second.\nOrchestrated migration from legacy monolithic services to containerized Kubernetes microservices on AWS.',
      achievements: 'Reduced p99 API latency from 450ms to 65ms (85% reduction) through distributed Redis caching and query plan indexing.\nAuthored zero-downtime database partitioning strategy preserving 99.999% platform availability across Black Friday peak volumes.'
    },
    {
      id: 'exp-2',
      role: 'Full Stack Software Engineer',
      company: 'Palantir Technologies',
      location: 'Palo Alto, CA',
      duration: 'Aug 2019 – Dec 2021',
      responsibilities: 'Engineered end-to-end data exploration interfaces in React, TypeScript, and Python FastAPI for Fortune 500 defense and logistics clients.\nDesigned automated CI/CD deployment pipelines reducing release turnaround from 4 days to 25 minutes.',
      achievements: 'Delivered enterprise analytics module adopted by 40+ client organizations, generating $1.8M in net new ARR within the first two quarters of launch.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'NexusAI — Autonomous Agentic Workflow Orchestrator',
      techStack: 'Python, FastAPI, TypeScript, React, Pinecone, OpenAI / Gemini API, Redis',
      description: 'Architected open-source multi-agent collaboration framework with vector retrieval, asynchronous worker queues, and dynamic tool orchestration.\nSurpassed 3,800+ GitHub stars with 45,000+ monthly downloads and enterprise adoption.',
      githubLink: 'github.com/alexandermorgan/nexus-ai',
      liveLink: 'demo.nexusai.dev'
    },
    {
      id: 'proj-2',
      name: 'HyperScale Distributed Cache & Message Bus',
      techStack: 'Go, Raft Consensus, gRPC, Protobuf, Docker',
      description: 'Built distributed replicated in-memory key-value store implementing the Raft consensus protocol with snapshotting and dynamic log compaction.\nAchieved sub-2ms replication times across 5 global node clusters under simulated network partitions.',
      githubLink: 'github.com/alexandermorgan/hyperscale-bus',
      liveLink: ''
    }
  ],
  certifications: {
    certs: 'AWS Certified Solutions Architect – Professional (2024)\nGoogle Cloud Professional Data Engineer (2023)\nCertified Kubernetes Administrator (CKA, 2023)',
    awards: 'Engineering Excellence Award (Q3 2023) — Selected out of 400+ engineers for multi-region failover design\nDean’s List for Academic Distinction (All Quarters)',
    hackathons: '1st Place Winner — TechCrunch Disrupt Hackathon 2022 (Built voice-activated real-time code assistant)',
    publications: '“Optimizing Latency in High-Throughput Distributed Vector Databases” — ACM SIGMOD Systems Track, 2023'
  },
  education: [
    {
      id: 'edu-1',
      college: 'Stanford University',
      degree: 'B.S. in Computer Science (Systems & Artificial Intelligence)',
      cgpa: '3.92 / 4.00',
      startYear: '2015',
      endYear: '2019',
      coursework: 'Distributed Systems, Advanced Operating Systems, Artificial Intelligence, Machine Learning'
    }
  ]
};

// Default Sample Profile reference
const SAMPLE_PROFILE = STUDENT_SAMPLE_PROFILE;

// ==========================================
// 2. SVG ICONS FOR RESUME & INTERFACE
// ==========================================

const ICONS = {
  email: `<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
  location: `<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v7.6h2.79v-7.6H6.46M7.86 6.8c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z"/></svg>`,
  github: `<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>`
};

// ==========================================
// 3. INITIALIZATION & EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initWizardNavigation();
  initViewTabs();
  initDynamicFormHandlers();
  initExportHandlers();
  initFormSync();

  // Initialize track to Student (default) and load student sample profile
  switchResumeTrack('student', false);
  loadProfile(STUDENT_SAMPLE_PROFILE);

  // If user is logged into PortfolioAI, prefill their details
  checkPortfolioUser();

  // Handle URL hash routing (e.g., #linkedin or #ats)
  checkUrlHash();
});

function checkPortfolioUser() {
  const loggedName = localStorage.getItem('userName');
  const loggedEmail = localStorage.getItem('userEmail');

  if (loggedName && loggedName !== 'User') {
    const fullNameInput = document.getElementById('fullName');
    if (fullNameInput && (!fullNameInput.value || fullNameInput.value === 'Aryan K. Sharma' || fullNameInput.value === 'Alexander R. Morgan')) {
      fullNameInput.value = loggedName;
      AppState.data.personal.fullName = loggedName;
    }
  }

  if (loggedEmail) {
    const emailInput = document.getElementById('email');
    if (emailInput && (!emailInput.value || emailInput.value === 'aryan.sharma@nitk.edu.in' || emailInput.value === 'alex.morgan@alumni.stanford.edu')) {
      emailInput.value = loggedEmail;
      AppState.data.personal.email = loggedEmail;
    }
  }

  renderAll();
}

function checkUrlHash() {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#linkedin') {
    switchView('linkedin');
  } else if (hash === '#ats') {
    switchView('ats');
  } else {
    switchView('resume');
  }
}

function switchView(viewName) {
  const tabs = document.querySelectorAll('.view-tab');
  const views = {
    resume: document.getElementById('viewResume'),
    linkedin: document.getElementById('viewLinkedin'),
    ats: document.getElementById('viewAts')
  };

  AppState.currentView = viewName;
  tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-view') === viewName));
  Object.keys(views).forEach(k => {
    if (views[k]) views[k].classList.toggle('active', k === viewName);
  });
}

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById('appToast');
  const msgEl = document.getElementById('toastMsg');
  if (!toast || !msgEl) return;

  msgEl.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Global copy helper
window.copyTextFromElement = function(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!');
  }).catch(() => {
    showToast('Selection copied!');
  });
};

// ==========================================
// 4. WIZARD STEP NAVIGATION
// ==========================================

function initWizardNavigation() {
  const tabs = document.querySelectorAll('.step-tab');
  const panels = document.querySelectorAll('.step-panel');
  const btnPrev = document.getElementById('btnPrevStep');
  const btnNext = document.getElementById('btnNextStep');

  function setStep(step) {
    if (step < 1 || step > 6) return;
    AppState.currentStep = step;

    tabs.forEach(tab => {
      const tabStep = parseInt(tab.getAttribute('data-step'), 10);
      tab.classList.toggle('active', tabStep === step);
      tab.classList.toggle('completed', tabStep < step);
    });

    panels.forEach((panel, idx) => {
      panel.classList.toggle('active', idx + 1 === step);
    });

    if (step === 2) {
      const objEl = document.getElementById('careerObjective');
      if (objEl && !objEl.value.trim() && AppState.data.personal.targetRole) {
        triggerAiSummaryGeneration(false);
      }
    }

    btnPrev.disabled = (step === 1);
    if (step === 6) {
      btnNext.innerHTML = `<span>Generate Resume</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
      btnNext.innerHTML = `<span>Next Step</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = parseInt(tab.getAttribute('data-step'), 10);
      setStep(step);
    });
  });

  btnPrev.addEventListener('click', () => {
    setStep(AppState.currentStep - 1);
  });

  btnNext.addEventListener('click', () => {
    if (AppState.currentStep === 6) {
      renderAll();
      showToast('Resume & LinkedIn Optimized!');
    } else {
      setStep(AppState.currentStep + 1);
    }
  });
}

// ==========================================
// 5. VIEW TAB NAVIGATION
// ==========================================

function initViewTabs() {
  const tabs = document.querySelectorAll('.view-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const viewName = tab.getAttribute('data-view');
      switchView(viewName);
    });
  });
}

// ==========================================
// 5.5. TRACK SWITCHER (STUDENT VS EXPERIENCED)
// ==========================================

function switchResumeTrack(mode, triggerRender = true) {
  AppState.resumeMode = mode;

  // 1. Toggle Tab Buttons
  const studentBtn = document.getElementById('trackStudentBtn');
  const expBtn = document.getElementById('trackExperiencedBtn');
  if (studentBtn) studentBtn.classList.toggle('active', mode === 'student');
  if (expBtn) expBtn.classList.toggle('active', mode === 'experienced');

  // 2. Update Header Badge
  const trackBadge = document.getElementById('activeTrackBadge');
  if (trackBadge) {
    if (mode === 'student') {
      trackBadge.innerText = '🎓 Student Track (Internships)';
      trackBadge.style.background = 'rgba(37,99,235,0.25)';
      trackBadge.style.borderColor = '#3b82f6';
      trackBadge.style.color = '#93c5fd';
    } else {
      trackBadge.innerText = '💼 Experienced Industry Track';
      trackBadge.style.background = 'rgba(16,185,129,0.2)';
      trackBadge.style.borderColor = '#10b981';
      trackBadge.style.color = '#6ee7b7';
    }
  }

  // 3. Toggle Year of Study dropdown in Step 1
  const groupYear = document.getElementById('groupStudentYear');
  if (groupYear) {
    groupYear.style.display = (mode === 'student') ? 'block' : 'none';
  }

  // 4. Update Target Role Label & Placeholder
  const lblRole = document.getElementById('lblTargetRole');
  const targetRoleInput = document.getElementById('targetRole');
  if (lblRole) {
    lblRole.innerText = (mode === 'student') 
      ? 'Target Job Role / Internship *' 
      : 'Target Job Role / Position *';
  }
  if (targetRoleInput) {
    if (mode === 'student' && (!targetRoleInput.value || targetRoleInput.value.includes('Senior'))) {
      targetRoleInput.placeholder = 'e.g. Flutter Developer Intern / Software Engineering Intern';
    } else if (mode === 'experienced' && (!targetRoleInput.value || targetRoleInput.value.includes('Intern'))) {
      targetRoleInput.placeholder = 'e.g. Senior Full Stack Engineer & AI Systems Architect';
    }
  }

  // 5. Update Headings & Button labels in Step 4
  const expHeading = document.getElementById('expHeading');
  const addExpLabel = document.getElementById('btnAddExpLabel');
  const projHeading = document.getElementById('projHeading');

  if (expHeading) {
    expHeading.innerText = (mode === 'student') 
      ? 'Internships & Work Experience (Optional for 1st/2nd Year)' 
      : 'Professional Work Experience';
  }
  if (addExpLabel) {
    addExpLabel.innerText = (mode === 'student') 
      ? 'Add Internship / Training' 
      : 'Add Work Experience';
  }
  if (projHeading) {
    projHeading.innerText = (mode === 'student') 
      ? 'Technical & Academic Projects (Priority for Students)' 
      : 'Key Architecture & Technical Projects';
  }

  if (triggerRender) {
    renderAll();
  }
}

// ==========================================
// 6. DYNAMIC FORM ENTRIES
// ==========================================

function initDynamicFormHandlers() {
  // Track selector buttons
  const btnTrackStudent = document.getElementById('trackStudentBtn');
  if (btnTrackStudent) {
    btnTrackStudent.addEventListener('click', () => {
      switchResumeTrack('student');
      showToast('Switched to Student / Internship Track (1st–4th Year)');
    });
  }

  const btnTrackExp = document.getElementById('trackExperiencedBtn');
  if (btnTrackExp) {
    btnTrackExp.addEventListener('click', () => {
      switchResumeTrack('experienced');
      showToast('Switched to Experienced Industry Track');
    });
  }

  // Sample profile loader buttons
  const btnLoadStudent = document.getElementById('btnLoadStudentSample');
  if (btnLoadStudent) {
    btnLoadStudent.addEventListener('click', () => {
      switchResumeTrack('student', false);
      loadProfile(STUDENT_SAMPLE_PROFILE);
      showToast('🎓 Loaded College Student Internship Profile (3rd Year)!');
    });
  }

  const btnLoadExp = document.getElementById('btnLoadExperiencedSample');
  if (btnLoadExp) {
    btnLoadExp.addEventListener('click', () => {
      switchResumeTrack('experienced', false);
      loadProfile(EXPERIENCED_SAMPLE_PROFILE);
      showToast('💼 Loaded Experienced Industry Profile (7+ Years)!');
    });
  }

  const oldLoadSample = document.getElementById('btnLoadSample');
  if (oldLoadSample) {
    oldLoadSample.addEventListener('click', () => {
      loadProfile(SAMPLE_PROFILE);
      showToast('Sample profile loaded!');
    });
  }

  // Dynamic add buttons
  document.getElementById('btnAddExperience').addEventListener('click', () => {
    addExperienceItem();
  });

  document.getElementById('btnAddProject').addEventListener('click', () => {
    addProjectItem();
  });

  document.getElementById('btnAddEducation').addEventListener('click', () => {
    addEducationItem();
  });

  document.getElementById('btnClearForm').addEventListener('click', () => {
    if (confirm('Clear all form fields?')) {
      clearForm();
      showToast('Form cleared');
    }
  });

  // AI Summary & Core Values Generation Handlers
  const btnAiGen = document.getElementById('btnAiGenerateSummary');
  if (btnAiGen) {
    btnAiGen.addEventListener('click', () => {
      triggerAiSummaryGeneration(true);
    });
  }

  const btnRegenObj = document.getElementById('btnRegenObjective');
  if (btnRegenObj) {
    btnRegenObj.addEventListener('click', () => {
      triggerAiSummaryGeneration(true);
    });
  }

  const btnRegenVal = document.getElementById('btnRegenValues');
  if (btnRegenVal) {
    btnRegenVal.addEventListener('click', () => {
      summaryVariationIndex++;
      const result = generateAiSummaryAndValues(AppState.data, summaryVariationIndex);
      const valInput = document.getElementById('coreValues');
      if (valInput) {
        valInput.value = result.coreValues;
        renderCoreValuesBadges(result.valuesList);
        syncFromForm();
        showToast('Core Values refreshed!');
      }
    });
  }
}

function addExperienceItem(data = null) {
  const container = document.getElementById('experienceContainer');
  const id = data?.id || 'exp_' + Date.now();
  
  const card = document.createElement('div');
  card.className = 'item-card';
  card.id = id;
  card.innerHTML = `
    <div class="item-card-header">
      <span class="item-card-title">Experience Position</span>
      <button type="button" class="btn-remove-item" onclick="removeDynamicItem('${id}')">Remove</button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Job Title / Role *</label>
        <input type="text" class="form-control exp-role" placeholder="e.g. Senior Software Engineer" value="${data?.role || ''}">
      </div>
      <div class="form-group">
        <label>Company *</label>
        <input type="text" class="form-control exp-company" placeholder="e.g. Stripe" value="${data?.company || ''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Duration *</label>
        <input type="text" class="form-control exp-duration" placeholder="e.g. Jan 2022 – Present" value="${data?.duration || ''}">
      </div>
      <div class="form-group">
        <label>Location</label>
        <input type="text" class="form-control exp-location" placeholder="e.g. San Francisco, CA" value="${data?.location || ''}">
      </div>
    </div>
    <div class="form-group">
      <label>Core Responsibilities *</label>
      <textarea class="form-control exp-resp" rows="2" placeholder="Spearheaded architecture of high-throughput payment services...">${data?.responsibilities || ''}</textarea>
    </div>
    <div class="form-group">
      <label>Quantifiable Achievements *</label>
      <textarea class="form-control exp-achieve" rows="2" placeholder="Reduced p99 latency by 85%; scaled to 15M+ active users...">${data?.achievements || ''}</textarea>
      <p class="input-hint">Include numbers, percentages (%), dollar amounts ($), or latency metrics.</p>
    </div>
  `;

  container.appendChild(card);
  attachInputListeners(card);
}

function addProjectItem(data = null) {
  const container = document.getElementById('projectsContainer');
  const id = data?.id || 'proj_' + Date.now();

  const card = document.createElement('div');
  card.className = 'item-card';
  card.id = id;
  card.innerHTML = `
    <div class="item-card-header">
      <span class="item-card-title">Technical Project</span>
      <button type="button" class="btn-remove-item" onclick="removeDynamicItem('${id}')">Remove</button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Project Name *</label>
        <input type="text" class="form-control proj-name" placeholder="e.g. NexusAI Orchestrator" value="${data?.name || ''}">
      </div>
      <div class="form-group">
        <label>Tech Stack *</label>
        <input type="text" class="form-control proj-tech" placeholder="e.g. Python, FastAPI, React, Redis" value="${data?.techStack || ''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>GitHub Link <span class="opt">(optional)</span></label>
        <input type="text" class="form-control proj-github" placeholder="github.com/username/project" value="${data?.githubLink || ''}">
      </div>
      <div class="form-group">
        <label>Live Demo URL <span class="opt">(optional)</span></label>
        <input type="text" class="form-control proj-live" placeholder="demo.project.dev" value="${data?.liveLink || ''}">
      </div>
    </div>
    <div class="form-group">
      <label>Project Description & Impact *</label>
      <textarea class="form-control proj-desc" rows="2" placeholder="Architected distributed agentic workflow framework...">${data?.description || ''}</textarea>
    </div>
  `;

  container.appendChild(card);
  attachInputListeners(card);
}

function addEducationItem(data = null) {
  const container = document.getElementById('educationContainer');
  const id = data?.id || 'edu_' + Date.now();

  const card = document.createElement('div');
  card.className = 'item-card';
  card.id = id;
  card.innerHTML = `
    <div class="item-card-header">
      <span class="item-card-title">Education Institution</span>
      <button type="button" class="btn-remove-item" onclick="removeDynamicItem('${id}')">Remove</button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>College / University *</label>
        <input type="text" class="form-control edu-college" placeholder="e.g. Stanford University / NITK Surathkal" value="${data?.college || ''}">
      </div>
      <div class="form-group">
        <label>Degree & Major *</label>
        <input type="text" class="form-control edu-degree" placeholder="e.g. B.Tech in Computer Science & Engineering" value="${data?.degree || ''}">
      </div>
    </div>
    <div class="form-row-3">
      <div class="form-group">
        <label>CGPA / GPA</label>
        <input type="text" class="form-control edu-cgpa" placeholder="e.g. 8.82 / 10.00 or 3.92 / 4.00" value="${data?.cgpa || ''}">
      </div>
      <div class="form-group">
        <label>Start Year</label>
        <input type="text" class="form-control edu-start" placeholder="e.g. 2023" value="${data?.startYear || ''}">
      </div>
      <div class="form-group">
        <label>End Year (or Expected)</label>
        <input type="text" class="form-control edu-end" placeholder="e.g. 2027 (Expected)" value="${data?.endYear || ''}">
      </div>
    </div>
    <div class="form-group" style="margin-top: 0.5rem;">
      <label>Relevant Coursework <span class="opt">(Crucial for Student & Internship ATS)</span></label>
      <input type="text" class="form-control edu-coursework" placeholder="e.g. Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks" value="${data?.coursework || ''}">
      <p class="input-hint">Recruiters and ATS scanners match coursework against internship job prerequisites.</p>
    </div>
  `;

  container.appendChild(card);
  attachInputListeners(card);
}

window.removeDynamicItem = function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.remove();
    syncFromForm();
  }
};

function attachInputListeners(container) {
  const inputs = container.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      syncFromForm();
    });
  });
}

// ==========================================
// 6.5. AI RESUME SYNTHESIZER (CAREER OBJECTIVE & CORE VALUES)
// ==========================================

let summaryVariationIndex = 0;

/**
 * Generate AI-Powered Career Objective and Core Values based on:
 * - Target Job Role (Primary Driver)
 * - Skills (Personalizes technical competencies)
 * - Education (Grounds academic background for students/freshers)
 * - Projects (Demonstrates practical engineering ability)
 * - Experience (If present, highlights professional track record; never invents fake companies)
 * - Domain archetype & recruiter work principles
 */
function generateAiSummaryAndValues(profileData = null, variation = 0) {
  const data = profileData || AppState.data;
  const isStudentTrack = (AppState.resumeMode === 'student');
  const studentYear = (data.personal?.studentYear || document.getElementById('studentYear')?.value || '3rd Year').trim();
  const role = (data.personal?.targetRole || '').trim();
  const skillsStr = (data.skills?.techSkills || '').trim();
  const toolsStr = (data.skills?.toolsTech || '').trim();
  const softStr = (data.skills?.softSkills || '').trim();
  const interestsStr = (data.summary?.interests || '').trim();
  const experience = data.experience || [];
  const projects = data.projects || [];
  const education = data.education || [];
  const yearsExp = (data.summary?.yearsExperience || '').trim();

  // Primary Role
  const displayRole = role || (isStudentTrack ? 'Software Engineering Intern' : 'Software & Technology Professional');

  // Extract skills
  const allSkills = [
    ...skillsStr.split(','),
    ...toolsStr.split(',')
  ].map(s => s.trim()).filter(Boolean);

  const topSkills = allSkills.slice(0, 4);
  const skillsPhrase = topSkills.length > 0 
    ? (topSkills.length === 1 ? topSkills[0] : `${topSkills.slice(0, -1).join(', ')}, and ${topSkills[topSkills.length - 1]}`)
    : 'modern programming languages and software engineering principles';

  // Extract projects
  const projectNames = projects.map(p => p.name?.trim()).filter(Boolean);
  const topProjectsPhrase = projectNames.length > 0
    ? (projectNames.length === 1 ? `including ${projectNames[0]}` : `including ${projectNames.slice(0, 2).join(' and ')}`)
    : '';

  // Extract education
  const topEdu = education[0];
  const eduDegree = topEdu?.degree?.trim() || '';
  const eduCollege = topEdu?.college?.trim() || '';
  const hasEdu = Boolean(eduDegree || eduCollege);

  // Check if experienced or student
  const validExp = experience.filter(e => e.role && e.company);
  const isStudentOrFresher = isStudentTrack || (validExp.length === 0 && (!yearsExp || /^(0|none|fresher|student|intern|aspiring)$/i.test(yearsExp)));

  // Determine domain archetype
  const lowerRole = role.toLowerCase();
  const lowerContext = (role + ' ' + skillsStr + ' ' + interestsStr).toLowerCase();
  let domainFocus = 'general';
  let defaultValues = [];

  if (/flutter|react native|ios|android|swift|kotlin|mobile/i.test(lowerRole || lowerContext)) {
    domainFocus = 'mobile';
    defaultValues = isStudentTrack
      ? ['Problem Solving', 'Continuous Learning', 'Team Collaboration', 'User-Centric Design', 'Clean Code']
      : ['System Scalability', 'Fault Tolerance', 'Problem Solving', 'Team Leadership', 'Clean Architecture'];
  } else if (/data|analyst|analytics|business intelligence|machine learning|ai|deep learning|data science/i.test(lowerRole || lowerContext)) {
    domainFocus = 'data_ai';
    defaultValues = ['Data-Driven Decision Making', 'Analytical Problem Solving', 'Continuous Learning', 'Algorithmic Precision', 'Team Collaboration'];
  } else if (/devops|cloud|infrastructure|sre|aws|kubernetes|docker|terraform|site reliability/i.test(lowerRole || lowerContext)) {
    domainFocus = 'devops';
    defaultValues = ['High Availability', 'Automation Mindset', 'System Reliability', 'Continuous Improvement', 'Collaborative Operations'];
  } else if (/frontend|ui|ux|web developer/i.test(lowerRole || lowerContext)) {
    domainFocus = 'frontend';
    defaultValues = ['User-Centric Design', 'Problem Solving', 'Continuous Learning', 'Modern Web Standards', 'Cross-Functional Teamwork'];
  } else if (/backend|full stack|systems|api|distributed|golang|java|c\+\+|microservice|database/i.test(lowerRole || lowerContext)) {
    domainFocus = 'backend';
    defaultValues = isStudentTrack
      ? ['Problem Solving', 'Continuous Learning', 'Data Integrity', 'Modular Design', 'Team Collaboration']
      : ['System Scalability', 'Problem Solving', 'Data Integrity', 'Fault Tolerance', 'High Throughput'];
  } else if (/qa|test|quality|automation test/i.test(lowerRole || lowerContext)) {
    domainFocus = 'qa';
    defaultValues = ['Quality Driven', 'Attention to Detail', 'Problem Solving', 'Continuous Learning', 'Agile Collaboration'];
  } else {
    domainFocus = 'general';
    defaultValues = ['Problem Solving', 'Continuous Learning', 'Team Collaboration', 'Innovation', 'Results-Driven Execution'];
  }

  let objective = '';

  if (isStudentOrFresher) {
    // --- 🎓 COLLEGE STUDENT INTERNSHIP TRACK (1st to 4th Year) ---
    let yearPrefix = '';
    let yearContext = '';

    if (/1st\s*year/i.test(studentYear)) {
      yearPrefix = `High-achieving 1st Year ${eduDegree ? eduDegree.split('(')[0].trim() : 'Computer Science'} undergraduate`;
      yearContext = `with strong foundational knowledge in ${skillsPhrase} and core algorithmic problem solving.`;
    } else if (/2nd\s*year/i.test(studentYear)) {
      yearPrefix = `Motivated 2nd Year ${eduDegree ? eduDegree.split('(')[0].trim() : 'Computer Science'} undergraduate`;
      yearContext = `equipped with practical competencies in ${skillsPhrase}${topProjectsPhrase ? `, hands-on project experience ${topProjectsPhrase},` : ''} and solid coursework in Data Structures.`;
    } else if (/4th\s*year/i.test(studentYear)) {
      yearPrefix = `Results-oriented 4th Year ${eduDegree ? eduDegree.split('(')[0].trim() : 'Computer Science'} student preparing for graduation`;
      yearContext = `with comprehensive expertise in ${skillsPhrase} and full lifecycle development experience${topProjectsPhrase ? ` across capstone projects ${topProjectsPhrase}` : ''}.`;
    } else if (/master|postgrad/i.test(studentYear)) {
      yearPrefix = `Dedicated Master's student in ${eduDegree ? eduDegree.split('(')[0].trim() : 'Computer Science'}`;
      yearContext = `with advanced competencies in ${skillsPhrase}${hasEdu && eduCollege ? ` at ${eduCollege}` : ''}.`;
    } else {
      // Default / 3rd Year
      yearPrefix = `Driven 3rd Year ${eduDegree ? eduDegree.split('(')[0].trim() : 'Computer Science'} undergraduate`;
      yearContext = `with proven technical skills in ${skillsPhrase}${topProjectsPhrase ? ` demonstrated across practical projects ${topProjectsPhrase}` : ''}${hasEdu && eduCollege ? ` at ${eduCollege}` : ''}.`;
    }

    const valueContributions = [
      domainFocus === 'mobile'
        ? `Passionate about building scalable mobile applications and delivering intuitive user experiences while continuously improving technical expertise.`
        : domainFocus === 'frontend'
        ? `Passionate about crafting responsive, performant user interfaces and building seamless client experiences adhering to modern clean-code principles.`
        : domainFocus === 'backend'
        ? `Dedicated to engineering scalable backend APIs, modular microservices, and efficient database solutions that support robust platform operations.`
        : domainFocus === 'data_ai'
        ? `Eager to apply data analytics and predictive modeling to solve complex problems and extract meaningful, data-backed business insights.`
        : domainFocus === 'devops'
        ? `Focused on automating cloud deployments, optimizing CI/CD workflows, and enhancing infrastructure uptime and resilience.`
        : `Committed to solving real-world challenges through clean code, proactive technical problem-solving, and cross-functional team collaboration.`
    ];

    const internshipGoals = [
      `Seeking a ${displayRole} opportunity to contribute directly to engineering sprints while expanding professional software development capabilities.`,
      `Eager to leverage core technical competencies to deliver high-quality solutions and accelerate team goals in an agile engineering environment.`,
      `Aimed at delivering reliable, well-tested code and contributing meaningfully to production releases in a collaborative internship program.`
    ];

    const gIdx = variation % internshipGoals.length;
    objective = `${yearPrefix} ${yearContext} ${valueContributions[0]} ${internshipGoals[gIdx]}`;

  } else {
    // --- 💼 EXPERIENCED INDUSTRY TRACK ---
    const expText = yearsExp ? `${yearsExp} of` : `${validExp.length}+ years of`;
    const topCompany = validExp[0]?.company ? ` at ${validExp[0].company}` : '';

    const openings = [
      `Results-driven ${displayRole} with ${expText} hands-on experience engineering scalable solutions in ${skillsPhrase}${topCompany}.`,
      `Accomplished ${displayRole} with a proven background in ${skillsPhrase}${topProjectsPhrase ? `, delivering end-to-end technical initiatives ${topProjectsPhrase}` : ''}.`,
      `High-performing ${displayRole} with ${expText} track record of architecting and deploying resilient systems with ${skillsPhrase}.`
    ];

    const valueContributions = [
      domainFocus === 'mobile'
        ? `Demonstrated expertise in architecting performant cross-platform mobile systems, reducing crash rates, and elevating client interface responsiveness.`
        : domainFocus === 'frontend'
        ? `Proven ability to optimize rendering lifecycles, lead modern UI component architectures, and engineer accessible digital products.`
        : domainFocus === 'backend'
        ? `Track record of scaling distributed microservices, optimizing database latencies, and ensuring zero-downtime production availability.`
        : domainFocus === 'data_ai'
        ? `Proven history of architecting end-to-end data pipelines, operationalizing machine learning models, and driving business decision agility.`
        : domainFocus === 'devops'
        ? `Specialized in building infrastructure-as-code pipelines, orchestrating multi-region container clusters, and securing cloud environments.`
        : `Track record of translating complex product roadmaps into maintainable architectures and delivering measurable business results.`
    ];

    const contributions = [
      `Passionate about fostering cross-functional excellence, mentoring talent, and driving high-impact technical innovation.`,
      `Dedicated to engineering reliability, operational excellence, and delivering strategic value for high-growth teams.`,
      `Committed to delivering scalable software architectures, operational resilience, and quantifiable bottom-line outcomes.`
    ];

    const oIdx = variation % openings.length;
    const cIdx = variation % contributions.length;
    objective = `${openings[oIdx]} ${valueContributions[0]} ${contributions[cIdx]}`;
  }

  // Rotate / customize core values based on variation
  let coreValuesList = [...defaultValues];
  if (variation > 0) {
    const rotated = coreValuesList.slice(1).concat(coreValuesList.slice(0, 1));
    coreValuesList = rotated;
  }

  return {
    objective: objective.trim(),
    coreValues: coreValuesList.join(' • '),
    valuesList: coreValuesList
  };
}

/**
 * Trigger AI Summary and Core Values Generation
 */
function triggerAiSummaryGeneration(showToastMsg = true) {
  summaryVariationIndex++;
  const result = generateAiSummaryAndValues(AppState.data, summaryVariationIndex);

  const objInput = document.getElementById('careerObjective');
  const valuesInput = document.getElementById('coreValues');

  if (objInput) objInput.value = result.objective;
  if (valuesInput) valuesInput.value = result.coreValues;

  renderCoreValuesBadges(result.valuesList);
  syncFromForm();

  if (showToastMsg) {
    showToast('✨ Career Objective & Core Values auto-generated!');
  }
}

/**
 * Render Interactive Core Value Badges in Step 2
 */
function renderCoreValuesBadges(suggestedValues = []) {
  const container = document.getElementById('coreValuesBadges');
  if (!container) return;

  const currentValStr = document.getElementById('coreValues')?.value || '';
  const currentItems = currentValStr.split(/[•,|]/).map(s => s.trim()).filter(Boolean);

  const bank = Array.from(new Set([
    ...suggestedValues,
    'Problem Solving', 'Continuous Learning', 'Team Collaboration', 
    'User-Centric Design', 'Clean Architecture', 'System Scalability',
    'Analytical Rigor', 'High Availability', 'Innovation Mindset'
  ])).slice(0, 8);

  container.innerHTML = bank.map(val => {
    const isActive = currentItems.some(item => item.toLowerCase() === val.toLowerCase());
    return `<button type="button" class="core-val-pill ${isActive ? 'active' : ''}" onclick="toggleCoreValuePill('${val}')">${isActive ? '✓' : '+'} ${val}</button>`;
  }).join('');
}

/**
 * Toggle Core Value Pill in or out of the input
 */
window.toggleCoreValuePill = function(valueName) {
  const input = document.getElementById('coreValues');
  if (!input) return;

  let items = input.value.split(/[•,|]/).map(s => s.trim()).filter(Boolean);
  const existingIdx = items.findIndex(s => s.toLowerCase() === valueName.toLowerCase());

  if (existingIdx >= 0) {
    items.splice(existingIdx, 1);
  } else {
    items.push(valueName);
  }

  input.value = items.join(' • ');
  renderCoreValuesBadges(items);
  syncFromForm();
};

// ==========================================
// 7. FORM DATA SYNC & EXTRACTION
// ==========================================

function initFormSync() {
  const staticInputs = [
    'fullName', 'targetRole', 'studentYear', 'email', 'phone', 'location', 'linkedinUrl', 'githubUrl',
    'careerObjective', 'coreValues', 'yearsExperience', 'interests',
    'techSkills', 'toolsTech', 'softSkills', 'languages',
    'certifications', 'awards', 'hackathons', 'publications'
  ];

  staticInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const eventType = (el.tagName === 'SELECT') ? 'change' : 'input';
      el.addEventListener(eventType, () => {
        syncFromForm();
        if (id === 'targetRole' || id === 'techSkills' || id === 'studentYear') {
          const objInput = document.getElementById('careerObjective');
          if (objInput && !objInput.value.trim() && el.value.trim()) {
            triggerAiSummaryGeneration(false);
          }
        }
      });
    }
  });
}

function syncFromForm() {
  AppState.data.personal = {
    fullName: document.getElementById('fullName').value.trim(),
    targetRole: document.getElementById('targetRole').value.trim(),
    studentYear: document.getElementById('studentYear')?.value.trim() || '3rd Year',
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    location: document.getElementById('location').value.trim(),
    linkedinUrl: document.getElementById('linkedinUrl').value.trim(),
    githubUrl: document.getElementById('githubUrl').value.trim()
  };

  AppState.data.summary = {
    careerObjective: document.getElementById('careerObjective').value.trim(),
    coreValues: document.getElementById('coreValues')?.value.trim() || '',
    yearsExperience: document.getElementById('yearsExperience').value.trim(),
    interests: document.getElementById('interests').value.trim()
  };

  AppState.data.skills = {
    techSkills: document.getElementById('techSkills').value.trim(),
    toolsTech: document.getElementById('toolsTech').value.trim(),
    softSkills: document.getElementById('softSkills').value.trim(),
    languages: document.getElementById('languages').value.trim()
  };

  // Experience
  AppState.data.experience = [];
  document.querySelectorAll('#experienceContainer .item-card').forEach(card => {
    AppState.data.experience.push({
      id: card.id,
      role: card.querySelector('.exp-role')?.value.trim() || '',
      company: card.querySelector('.exp-company')?.value.trim() || '',
      duration: card.querySelector('.exp-duration')?.value.trim() || '',
      location: card.querySelector('.exp-location')?.value.trim() || '',
      responsibilities: card.querySelector('.exp-resp')?.value.trim() || '',
      achievements: card.querySelector('.exp-achieve')?.value.trim() || ''
    });
  });

  // Projects
  AppState.data.projects = [];
  document.querySelectorAll('#projectsContainer .item-card').forEach(card => {
    AppState.data.projects.push({
      id: card.id,
      name: card.querySelector('.proj-name')?.value.trim() || '',
      techStack: card.querySelector('.proj-tech')?.value.trim() || '',
      githubLink: card.querySelector('.proj-github')?.value.trim() || '',
      liveLink: card.querySelector('.proj-live')?.value.trim() || '',
      description: card.querySelector('.proj-desc')?.value.trim() || ''
    });
  });

  // Certifications
  AppState.data.certifications = {
    certs: document.getElementById('certifications').value.trim(),
    awards: document.getElementById('awards').value.trim(),
    hackathons: document.getElementById('hackathons').value.trim(),
    publications: document.getElementById('publications').value.trim()
  };

  // Education (with Coursework for Student & Internship ATS)
  AppState.data.education = [];
  document.querySelectorAll('#educationContainer .item-card').forEach(card => {
    AppState.data.education.push({
      id: card.id,
      college: card.querySelector('.edu-college')?.value.trim() || '',
      degree: card.querySelector('.edu-degree')?.value.trim() || '',
      cgpa: card.querySelector('.edu-cgpa')?.value.trim() || '',
      startYear: card.querySelector('.edu-start')?.value.trim() || '',
      endYear: card.querySelector('.edu-end')?.value.trim() || '',
      coursework: card.querySelector('.edu-coursework')?.value.trim() || ''
    });
  });

  renderAll();
}

function loadProfile(profile) {
  // Sync track based on profile
  if (profile.personal.studentYear || profile.personal.fullName === 'Aryan K. Sharma') {
    switchResumeTrack('student', false);
  } else {
    switchResumeTrack('experienced', false);
  }

  document.getElementById('fullName').value = profile.personal.fullName;
  document.getElementById('targetRole').value = profile.personal.targetRole;
  if (document.getElementById('studentYear')) {
    document.getElementById('studentYear').value = profile.personal.studentYear || '3rd Year';
  }
  document.getElementById('email').value = profile.personal.email;
  document.getElementById('phone').value = profile.personal.phone;
  document.getElementById('location').value = profile.personal.location;
  document.getElementById('linkedinUrl').value = profile.personal.linkedinUrl;
  document.getElementById('githubUrl').value = profile.personal.githubUrl;

  document.getElementById('careerObjective').value = profile.summary.careerObjective;
  if (document.getElementById('coreValues')) {
    document.getElementById('coreValues').value = profile.summary.coreValues || '';
    renderCoreValuesBadges(profile.summary.coreValues ? profile.summary.coreValues.split(/[•,|]/).map(s => s.trim()) : []);
  }
  document.getElementById('yearsExperience').value = profile.summary.yearsExperience;
  document.getElementById('interests').value = profile.summary.interests;

  document.getElementById('techSkills').value = profile.skills.techSkills;
  document.getElementById('toolsTech').value = profile.skills.toolsTech;
  document.getElementById('softSkills').value = profile.skills.softSkills;
  document.getElementById('languages').value = profile.skills.languages;

  document.getElementById('certifications').value = profile.certifications.certs;
  document.getElementById('awards').value = profile.certifications.awards;
  document.getElementById('hackathons').value = profile.certifications.hackathons;
  document.getElementById('publications').value = profile.certifications.publications;

  // Clear & populate dynamic containers
  document.getElementById('experienceContainer').innerHTML = '';
  profile.experience.forEach(exp => addExperienceItem(exp));

  document.getElementById('projectsContainer').innerHTML = '';
  profile.projects.forEach(proj => addProjectItem(proj));

  document.getElementById('educationContainer').innerHTML = '';
  profile.education.forEach(edu => addEducationItem(edu));

  syncFromForm();
}

function clearForm() {
  const inputs = document.querySelectorAll('.form-pane input, .form-pane textarea');
  inputs.forEach(i => i.value = '');
  document.getElementById('experienceContainer').innerHTML = '';
  document.getElementById('projectsContainer').innerHTML = '';
  document.getElementById('educationContainer').innerHTML = '';
  const badgesContainer = document.getElementById('coreValuesBadges');
  if (badgesContainer) badgesContainer.innerHTML = '';

  const selYear = document.getElementById('studentYear');
  if (selYear) selYear.value = '3rd Year';

  AppState.data = {
    personal: { fullName: '', targetRole: '', studentYear: '3rd Year', email: '', phone: '', location: '', linkedinUrl: '', githubUrl: '' },
    summary: { careerObjective: '', coreValues: '', yearsExperience: '', interests: '' },
    skills: { techSkills: '', toolsTech: '', softSkills: '', languages: '' },
    experience: [],
    projects: [],
    certifications: { certs: '', awards: '', hackathons: '', publications: '' },
    education: []
  };

  syncFromForm();
}

// ==========================================
// 8. RENDER ENGINES (RESUME, LINKEDIN, ATS)
// ==========================================

function renderAll() {
  renderResumePreview();
  renderLinkedInOptimization();
  renderAtsScoreAnalysis();
}

/**
 * Render Resume Preview in exact specified order:
 * 1. Centered Full Name
 * 2. Contact Row with Icons
 * 3. Career Summary
 * 4. Skills
 * 5. Experience
 * 6. Projects
 * 7. Awards & Certifications
 * 8. Education
 */
function renderResumePreview() {
  const { personal, summary, skills, experience, projects, certifications, education } = AppState.data;

  // Reorder and re-title sections dynamically based on Active Track (Student vs Experienced)
  const sheet = document.getElementById('resumeSheet');
  const header = sheet ? sheet.querySelector('.resume-header') : null;
  const secSummary = document.getElementById('sectionSummary');
  const secSkills = document.getElementById('sectionSkills');
  const secExperience = document.getElementById('sectionExperience');
  const secProjects = document.getElementById('sectionProjects');
  const secCertifications = document.getElementById('sectionCertifications');
  const secEducation = document.getElementById('sectionEducation');

  if (sheet) {
    if (AppState.resumeMode === 'student') {
      // 🎓 STUDENT ATS ORDER:
      // 1. Header & Contact
      // 2. Career/Internship Objective
      // 3. Education & Relevant Coursework (Crucial: Placed right after objective!)
      // 4. Technical Skills & Competencies
      // 5. Technical & Academic Projects (Priority for Students!)
      // 6. Internships & Work Experience (if any)
      // 7. Honors & Certifications
      if (header) sheet.appendChild(header);
      if (secSummary) sheet.appendChild(secSummary);
      if (secEducation) sheet.appendChild(secEducation);
      if (secSkills) sheet.appendChild(secSkills);
      if (secProjects) sheet.appendChild(secProjects);
      if (secExperience) sheet.appendChild(secExperience);
      if (secCertifications) sheet.appendChild(secCertifications);

      if (secSummary) secSummary.querySelector('.section-title').innerText = 'CAREER OBJECTIVE';
      if (secEducation) secEducation.querySelector('.section-title').innerText = 'EDUCATION & RELEVANT COURSEWORK';
      if (secSkills) secSkills.querySelector('.section-title').innerText = 'TECHNICAL SKILLS & COMPETENCIES';
      if (secProjects) secProjects.querySelector('.section-title').innerText = 'TECHNICAL & ACADEMIC PROJECTS';
      if (secExperience) secExperience.querySelector('.section-title').innerText = 'INTERNSHIPS & WORK EXPERIENCE';
      if (secCertifications) secCertifications.querySelector('.section-title').innerText = 'HONORS, CERTIFICATIONS & HACKATHONS';
    } else {
      // 💼 EXPERIENCED INDUSTRY ATS ORDER:
      // 1. Header & Contact
      // 2. Executive / Professional Summary
      // 3. Core Competencies & Technical Skills
      // 4. Professional Work Experience (Metrics driven)
      // 5. Key Technical Projects
      // 6. Awards & Certifications
      // 7. Education (At the bottom)
      if (header) sheet.appendChild(header);
      if (secSummary) sheet.appendChild(secSummary);
      if (secSkills) sheet.appendChild(secSkills);
      if (secExperience) sheet.appendChild(secExperience);
      if (secProjects) sheet.appendChild(secProjects);
      if (secCertifications) sheet.appendChild(secCertifications);
      if (secEducation) sheet.appendChild(secEducation);

      if (secSummary) secSummary.querySelector('.section-title').innerText = 'PROFESSIONAL SUMMARY';
      if (secSkills) secSkills.querySelector('.section-title').innerText = 'CORE COMPETENCIES & TECHNICAL SKILLS';
      if (secExperience) secExperience.querySelector('.section-title').innerText = 'PROFESSIONAL EXPERIENCE';
      if (secProjects) secProjects.querySelector('.section-title').innerText = 'KEY TECHNICAL PROJECTS';
      if (secCertifications) secCertifications.querySelector('.section-title').innerText = 'AWARDS & CERTIFICATIONS';
      if (secEducation) secEducation.querySelector('.section-title').innerText = 'EDUCATION';
    }
  }

  // 1. Centered Full Name
  const nameEl = document.getElementById('previewName');
  nameEl.innerText = (personal.fullName || 'YOUR NAME HERE').toUpperCase();

  // 2. Contact Row with Icons
  const contactRow = document.getElementById('previewContactRow');
  const contactParts = [];

  if (personal.email) {
    contactParts.push(`<span class="contact-item">${ICONS.email} <a href="mailto:${personal.email}">${personal.email}</a></span>`);
  }
  if (personal.phone) {
    contactParts.push(`<span class="contact-item">${ICONS.phone} <span>${personal.phone}</span></span>`);
  }
  if (personal.location) {
    contactParts.push(`<span class="contact-item">${ICONS.location} <span>${personal.location}</span></span>`);
  }
  if (personal.linkedinUrl) {
    const cleanLi = personal.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '');
    contactParts.push(`<span class="contact-item">${ICONS.linkedin} <a href="https://${cleanLi}" target="_blank">${cleanLi}</a></span>`);
  }
  if (personal.githubUrl) {
    const cleanGh = personal.githubUrl.replace(/^https?:\/\/(www\.)?/, '');
    contactParts.push(`<span class="contact-item">${ICONS.github} <a href="https://${cleanGh}" target="_blank">${cleanGh}</a></span>`);
  }

  contactRow.innerHTML = contactParts.join('<span class="contact-sep">|</span>');

  // 3. Career Summary & Core Values
  const summaryEl = document.getElementById('previewSummary');
  const coreValuesEl = document.getElementById('previewCoreValues');
  const summarySection = document.getElementById('sectionSummary');
  if (summary.careerObjective || summary.coreValues) {
    summarySection.style.display = 'block';
    summaryEl.innerText = summary.careerObjective || '';
    if (summary.coreValues) {
      coreValuesEl.style.display = 'block';
      coreValuesEl.innerHTML = `<span class="skills-label">Core Values & Principles:</span> ${summary.coreValues}`;
    } else {
      coreValuesEl.style.display = 'none';
      coreValuesEl.innerHTML = '';
    }
  } else {
    summarySection.style.display = 'none';
  }

  // 4. Skills
  const skillsEl = document.getElementById('previewSkills');
  const skillsSection = document.getElementById('sectionSkills');
  const skillRows = [];

  if (skills.techSkills) {
    skillRows.push(`<div class="skills-row"><span class="skills-label">Technical Skills:</span> ${skills.techSkills}</div>`);
  }
  if (skills.toolsTech) {
    skillRows.push(`<div class="skills-row"><span class="skills-label">Tools & Technologies:</span> ${skills.toolsTech}</div>`);
  }
  if (skills.softSkills) {
    skillRows.push(`<div class="skills-row"><span class="skills-label">Soft Skills:</span> ${skills.softSkills}</div>`);
  }
  if (skills.languages) {
    skillRows.push(`<div class="skills-row"><span class="skills-label">Languages:</span> ${skills.languages}</div>`);
  }

  if (skillRows.length > 0) {
    skillsSection.style.display = 'block';
    skillsEl.innerHTML = skillRows.join('');
  } else {
    skillsSection.style.display = 'none';
  }

  // 5. Experience
  const expEl = document.getElementById('previewExperience');
  const expSection = document.getElementById('sectionExperience');
  if (experience.length > 0) {
    expSection.style.display = 'block';
    expEl.innerHTML = experience.map(exp => {
      const respBullets = splitIntoBullets(exp.responsibilities);
      const achBullets = splitIntoBullets(exp.achievements);
      const allBullets = [...respBullets, ...achBullets];

      return `
        <div class="exp-entry">
          <div class="entry-header-row">
            <span class="entry-title-bold">${exp.role || 'Role Title'}</span>
            <span class="entry-duration">${exp.duration || ''}</span>
          </div>
          <div class="entry-sub-row">
            <span class="entry-company">${exp.company || ''}</span>
            <span class="entry-location">${exp.location || ''}</span>
          </div>
          ${allBullets.length ? `<ul class="resume-bullets">${allBullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </div>
      `;
    }).join('');
  } else {
    expSection.style.display = 'none';
  }

  // 6. Projects
  const projEl = document.getElementById('previewProjects');
  const projSection = document.getElementById('sectionProjects');
  if (projects.length > 0) {
    projSection.style.display = 'block';
    projEl.innerHTML = projects.map(proj => {
      const bullets = splitIntoBullets(proj.description);
      const links = [];
      if (proj.githubLink) links.push(proj.githubLink.replace(/^https?:\/\//, ''));
      if (proj.liveLink) links.push(proj.liveLink.replace(/^https?:\/\//, ''));
      const linkText = links.length ? ` [${links.join(' | ')}]` : '';

      return `
        <div class="proj-entry">
          <div class="entry-header-row">
            <span class="entry-title-bold">${proj.name || 'Project Name'}</span>
            <span class="entry-duration">${proj.techStack ? `${proj.techStack}` : ''}</span>
          </div>
          ${linkText ? `<div style="font-size: 9pt; font-style: italic; margin-bottom: 2pt;">${linkText}</div>` : ''}
          ${bullets.length ? `<ul class="resume-bullets">${bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </div>
      `;
    }).join('');
  } else {
    projSection.style.display = 'none';
  }

  // 7. Awards & Certifications
  const certEl = document.getElementById('previewCertifications');
  const certSection = document.getElementById('sectionCertifications');
  const certItems = [];

  if (certifications.certs) {
    certifications.certs.split('\n').filter(Boolean).forEach(c => certItems.push(`<strong>Certification:</strong> ${c.trim()}`));
  }
  if (certifications.awards) {
    certifications.awards.split('\n').filter(Boolean).forEach(a => certItems.push(`<strong>Award:</strong> ${a.trim()}`));
  }
  if (certifications.hackathons) {
    certifications.hackathons.split('\n').filter(Boolean).forEach(h => certItems.push(`<strong>Hackathon / Honor:</strong> ${h.trim()}`));
  }
  if (certifications.publications) {
    certifications.publications.split('\n').filter(Boolean).forEach(p => certItems.push(`<strong>Publication:</strong> ${p.trim()}`));
  }

  if (certItems.length > 0) {
    certSection.style.display = 'block';
    certEl.innerHTML = certItems.map(i => `<li>${i}</li>`).join('');
  } else {
    certSection.style.display = 'none';
  }

  // 8. Education (Includes Coursework for Student ATS)
  const eduEl = document.getElementById('previewEducation');
  const eduSection = document.getElementById('sectionEducation');
  if (education.length > 0) {
    eduSection.style.display = 'block';
    eduEl.innerHTML = education.map(edu => {
      const yearRange = [edu.startYear, edu.endYear].filter(Boolean).join(' – ');
      const cgpaText = edu.cgpa ? ` | Cumulative GPA: ${edu.cgpa}` : '';
      const courseworkHtml = edu.coursework ? `
        <div class="edu-coursework" style="font-size: 9.3pt; line-height: 1.25; margin-top: 2pt;">
          <strong>Relevant Coursework:</strong> ${edu.coursework}
        </div>
      ` : '';

      return `
        <div class="edu-entry">
          <div class="entry-header-row">
            <span class="entry-title-bold">${edu.degree || 'Degree'}</span>
            <span class="entry-duration">${yearRange}</span>
          </div>
          <div class="entry-sub-row">
            <span class="entry-company">${edu.college || 'University'}${cgpaText}</span>
          </div>
          ${courseworkHtml}
        </div>
      `;
    }).join('');
  } else {
    eduSection.style.display = 'none';
  }
}

function splitIntoBullets(text) {
  if (!text) return [];
  return text.split(/(?:\r?\n|•|\. )/)
    .map(t => t.replace(/^[•\-\s]+/, '').trim())
    .filter(t => t.length > 10)
    .map(t => t.endsWith('.') ? t : t + '.');
}

/**
 * Render LinkedIn Optimization
 */
function renderLinkedInOptimization() {
  const { personal, summary, skills, experience, projects, education } = AppState.data;
  const role = personal.targetRole || '';
  const name = personal.fullName || '';
  const years = summary.yearsExperience || '';

  // Primary Skills Slice
  const skillList = (skills.techSkills ? skills.techSkills.split(',') : [])
    .map(s => s.trim()).filter(Boolean);
  const top3Skills = skillList.slice(0, 3).join(' | ') || '';
  const top5Skills = skillList.slice(0, 5).join(' • ') || '';

  // Extract top company
  const topCompany = experience[0]?.company || '';

  // Check if user has entered data
  const hasData = Boolean(personal.fullName || personal.targetRole || summary.careerObjective || skills.techSkills || experience.length);

  // --- LIVE LINKEDIN SCORES (0 - 100%) ---
  let headlineScore = 0;
  if (personal.targetRole) headlineScore += 50;
  if (skills.techSkills) headlineScore += 30;
  if (summary.interests || top3Skills) headlineScore += 20;

  let aboutScore = 0;
  const objLen = (summary.careerObjective || '').length;
  if (objLen > 20) aboutScore += 30;
  if (objLen > 100) aboutScore += 35;
  if (objLen > 200) aboutScore += 25;
  if (summary.yearsExperience) aboutScore += 10;

  let expScore = 0;
  if (experience.length > 0) {
    const validExp = experience.filter(e => e.role && e.company);
    if (validExp.length >= 1) expScore += 50;
    if (validExp.length >= 2) expScore += 30;
    const hasMetrics = experience.some(e => /\d+|%|\$/.test(e.achievements || ''));
    if (hasMetrics) expScore += 20;
  }

  let skillsScore = 0;
  if (skills.techSkills) skillsScore += 35;
  if (skills.toolsTech) skillsScore += 25;
  if (skills.softSkills) skillsScore += 25;
  if (skills.languages) skillsScore += 15;

  let kwScore = 0;
  const presentKeywords = Array.from(new Set([
    role,
    ...skillList.slice(0, 10),
    skills.toolsTech ? 'System Design' : '',
    experience.length ? 'Performance Optimization' : ''
  ])).filter(Boolean);

  if (presentKeywords.length > 0) {
    kwScore = Math.min(100, Math.round(presentKeywords.length * 12.5));
  }

  const liOverall = hasData ? Math.round(
    headlineScore * 0.20 +
    aboutScore * 0.25 +
    expScore * 0.25 +
    skillsScore * 0.15 +
    kwScore * 0.15
  ) : 0;

  // Live Score Updates to DOM
  const elOverall = document.getElementById('liOverallScore');
  const elHead = document.getElementById('scoreHeadline');
  const elAbout = document.getElementById('scoreAbout');
  const elExp = document.getElementById('scoreExp');
  const elSkills = document.getElementById('scoreSkills');
  const elKw = document.getElementById('scoreKw');

  if (elOverall) elOverall.innerText = liOverall;
  if (elHead) elHead.innerText = `${headlineScore}%`;
  if (elAbout) elAbout.innerText = `${aboutScore}%`;
  if (elExp) elExp.innerText = `${expScore}%`;
  if (elSkills) elSkills.innerText = `${skillsScore}%`;
  if (elKw) elKw.innerText = `${kwScore}%`;

  const elStrength = document.getElementById('liStrengthText');
  if (elStrength) {
    if (liOverall >= 90) {
      elStrength.innerText = 'Ranked in top 2% for recruiter discoverability';
    } else if (liOverall >= 75) {
      elStrength.innerText = 'Strong profile — ranked in top 15% of candidates';
    } else if (liOverall >= 50) {
      elStrength.innerText = 'Moderate strength — add more keywords and metrics';
    } else if (liOverall > 0) {
      elStrength.innerText = 'Profile in progress — complete sections to boost ranking';
    } else {
      elStrength.innerText = 'No profile data entered yet — complete form to calculate score';
    }
  }

  const scoreCircle = document.querySelector('.score-circle');
  if (scoreCircle) {
    if (liOverall >= 85) scoreCircle.style.borderColor = '#10b981';
    else if (liOverall >= 50) scoreCircle.style.borderColor = '#60a5fa';
    else if (liOverall > 0) scoreCircle.style.borderColor = '#f59e0b';
    else scoreCircle.style.borderColor = 'rgba(255, 255, 255, 0.2)';
  }

  // 3 LinkedIn Headlines
  if (!hasData || (!role && !top3Skills)) {
    document.getElementById('liHeadline1').innerText = 'Enter your Target Role and Skills in Step 1 & Step 3 to generate search-optimized headlines.';
    document.getElementById('liHeadline2').innerText = 'Value-proposition headlines will generate live as you type.';
    document.getElementById('liHeadline3').innerText = 'Specialized domain authority headlines will display here.';
  } else {
    const h1 = `${role || 'Professional'} | ${top3Skills || 'Specialist'} | Scaling High-Impact Systems`;
    const h2 = `Helping organizations achieve technical excellence with ${skillList[0] || 'Modern Architecture'} & ${skillList[1] || 'Engineering Best Practices'}${topCompany ? ` | Ex-${topCompany}` : ''}${years ? ` | ${years} Experience` : ''}`;
    const h3 = `Specialist in ${summary.interests ? summary.interests.split(',')[0].trim() : (role || 'Cloud Architecture')} | Building Resilient Systems & Measurable Business Impact`;

    document.getElementById('liHeadline1').innerText = h1;
    document.getElementById('liHeadline2').innerText = h2;
    document.getElementById('liHeadline3').innerText = h3;
  }

  // SEO Optimized About Section
  if (!summary.careerObjective && experience.length === 0) {
    document.getElementById('liAboutText').innerText = 'Enter your Professional Summary in Step 2 and Work Experience in Step 4 to generate an SEO-optimized LinkedIn About section.';
  } else {
    const aboutText = `I am a ${role || 'results-driven professional'}${years ? ` with ${years} of experience` : ''} specializing in ${summary.interests || top3Skills || 'delivering impactful technical solutions'}.

Throughout my career, I have focused on translating complex business and technical requirements into scalable, robust outcomes with measurable impact.

CORE COMPETENCIES & WORK PRINCIPLES:
• Core Focus: ${role || 'Software Engineering & System Architecture'}
${summary.coreValues ? `• Core Values: ${summary.coreValues}\n` : ''}• Technologies & Skills: ${top5Skills || skills.techSkills || 'Modern Technologies'}
• Tools & Methodologies: ${skills.toolsTech || skills.softSkills || 'Agile Development & Leadership'}

HIGHLIGHTED ACCOMPLISHMENTS:
${experience.length > 0 ? experience.map(e => `• At ${e.company || 'Previous Team'}: ${e.achievements || e.responsibilities || 'Delivered key initiatives'}`).slice(0, 2).join('\n') : (summary.careerObjective || 'Track record of high-performance delivery.')}

Feel free to connect or reach out directly: ${personal.email || 'via LinkedIn'}.`;

    document.getElementById('liAboutText').innerText = aboutText;
  }

  // STAR Format Experience
  const starContainer = document.getElementById('liStarContainer');
  if (experience.length > 0) {
    starContainer.innerHTML = experience.map((exp, idx) => {
      const star = generateStarBreakdown(exp, role || 'Target Role');
      const starId = `star_text_${idx}`;
      return `
        <div class="star-card">
          <div class="star-card-header">
            <span>${exp.role || 'Position'} at ${exp.company || 'Company'}</span>
            <button class="copy-mini-btn" style="position:static;" onclick="copyTextFromElement('${starId}')">Copy STAR</button>
          </div>
          <div id="${starId}">
            <div class="star-row"><span class="star-label">Situation:</span> ${star.situation}</div>
            <div class="star-row"><span class="star-label">Task:</span> ${star.task}</div>
            <div class="star-row"><span class="star-label">Action:</span> ${star.action}</div>
            <div class="star-row"><span class="star-label">Result:</span> ${star.result}</div>
          </div>
        </div>
      `;
    }).join('');
  } else {
    starContainer.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted);">Add work experience in Step 4 to generate STAR format bullet points.</p>`;
  }

  // Top Recruiter Keywords & Missing Keywords
  const topKwEl = document.getElementById('liTopKeywords');
  const missingKwEl = document.getElementById('liMissingKeywords');

  const roleKeywordsBank = [
    'System Design', 'CI/CD Automation', 'Cloud Native', 'Distributed Caching', 
    'Zero-Downtime Migration', 'Observability & Metrics', 'Agile Leadership', 
    'Kubernetes Cluster Management', 'Terraform IaC', 'Event-Driven Architecture'
  ];

  const missingKeywords = role ? roleKeywordsBank.filter(k => 
    !presentKeywords.some(p => p.toLowerCase().includes(k.toLowerCase()))
  ).slice(0, 6) : [];

  if (presentKeywords.length > 0) {
    topKwEl.innerHTML = presentKeywords.map(k => `<span class="keyword-pill">${k}</span>`).join('');
  } else {
    topKwEl.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">No keywords detected yet. Add skills in Step 3.</span>`;
  }

  if (missingKeywords.length > 0) {
    missingKwEl.innerHTML = missingKeywords.map(k => `<span class="missing-pill">+ ${k}</span>`).join('');
  } else {
    missingKwEl.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">Enter your target job role in Step 1 to see missing recruiter keywords.</span>`;
  }

  // Banner Recommendation
  document.getElementById('liBannerTitle').innerText = name || role ? `${name || 'Your Name'} | ${role || 'Target Role'}` : 'Your Name | Target Role';
  document.getElementById('liBannerSubtitle').innerText = top3Skills ? `${top3Skills} • High-Impact Engineering` : 'Your Core Competencies & Value Statement';

  // Custom Profile URL suggestions
  const cleanName = (name || 'yourname').toLowerCase().replace(/[^a-z0-9]/g, '');
  const urlSuggestions = [
    `linkedin.com/in/${cleanName}`,
    `linkedin.com/in/${cleanName}-tech`,
    `linkedin.com/in/${cleanName}-${(role || 'pro').toLowerCase().split(' ')[0]}`
  ];
  document.getElementById('liUrlSuggestions').innerHTML = urlSuggestions.map(u => `<li><a href="#" style="color:#60a5fa; text-decoration:none;" onclick="navigator.clipboard.writeText('${u}'); showToast('Copied URL suggestion!'); return false;">${u}</a> (Click to copy)</li>`).join('');

  // Setup Master Copy Button
  document.getElementById('btnCopyAllLi').onclick = () => {
    const fullLiText = `=== 3 LINKEDIN HEADLINES ===\nOption 1: ${document.getElementById('liHeadline1').innerText}\nOption 2: ${document.getElementById('liHeadline2').innerText}\nOption 3: ${document.getElementById('liHeadline3').innerText}\n\n=== ABOUT SECTION ===\n${document.getElementById('liAboutText').innerText}\n\n=== RECRUITER KEYWORDS ===\n${presentKeywords.join(', ')}`;
    navigator.clipboard.writeText(fullLiText).then(() => {
      showToast('Complete LinkedIn content copied to clipboard!');
    });
  };
}

function generateStarBreakdown(exp, targetRole) {
  return {
    situation: `Operating within ${exp.company || 'high-velocity team'} managing critical services required for scalability and reliability.`,
    task: `Tasked with driving end-to-end delivery of ${exp.role || targetRole} initiatives while maintaining high availability.`,
    action: exp.responsibilities || `Architected robust modular services and automated deployment workflows utilizing modern industry best practices.`,
    result: exp.achievements || `Delivered measurable efficiency gains and enhanced core operational throughput.`
  };
}

/**
 * Render ATS Score Analysis
 */
function renderAtsScoreAnalysis() {
  const { personal, summary, skills, experience, projects, education } = AppState.data;

  // Detect Action Verbs
  const actionVerbsList = [
    'spearhead', 'spearheaded', 'architect', 'architected', 'engineer', 'engineered', 
    'optimize', 'optimized', 'accelerate', 'accelerated', 'orchestrate', 'orchestrated', 
    'deploy', 'deployed', 'reduce', 'reduced', 'deliver', 'delivered', 'author', 'authored', 
    'design', 'designed', 'scale', 'scaled', 'implement', 'implemented', 'transform', 'transformed',
    'lead', 'led', 'manage', 'managed', 'created', 'built', 'developed'
  ];

  const fullText = [
    summary.careerObjective || '',
    ...experience.map(e => `${e.responsibilities || ''} ${e.achievements || ''}`),
    ...projects.map(p => p.description || '')
  ].join(' ').toLowerCase();

  let verbsFound = 0;
  if (fullText.trim().length > 0) {
    actionVerbsList.forEach(v => {
      const regex = new RegExp(`\\b${v}\\b`, 'gi');
      const matches = fullText.match(regex);
      if (matches) verbsFound += matches.length;
    });
  }

  // Detect Quantifiable Metrics (numbers, %, $, ms, k, m)
  let metricsFound = 0;
  if (fullText.trim().length > 0) {
    const metricsRegex = /\b\d+(?:\.\d+)?%|\$\d+(?:\.\d+)?[MBKmbk]?|\b\d+ms\b|\b\d+[KkMm]\+?\b|\b\d{2,}\b/g;
    metricsFound = (fullText.match(metricsRegex) || []).length;
  }

  // --- LIVE ATS SCORING (0 to 100) ---
  let score = 0;

  // Contact Info (20 pts)
  if (personal.fullName) score += 5;
  if (personal.email) score += 5;
  if (personal.phone) score += 5;
  if (personal.location) score += 5;

  // Summary (15 pts)
  const objLen = (summary.careerObjective || '').length;
  if (objLen > 150) score += 15;
  else if (objLen > 50) score += 10;
  else if (objLen > 10) score += 5;

  // Skills (15 pts)
  if (skills.techSkills) score += 6;
  if (skills.toolsTech) score += 5;
  if (skills.softSkills) score += 4;

  // Experience (25 pts)
  const validExp = experience.filter(e => e.role && e.company);
  if (validExp.length >= 2) score += 25;
  else if (validExp.length === 1) score += 15;

  // Projects (10 pts)
  const validProj = projects.filter(p => p.name && (p.description || p.techStack));
  if (validProj.length >= 2) score += 10;
  else if (validProj.length === 1) score += 6;

  // Education (10 pts)
  const validEdu = education.filter(e => e.college && e.degree);
  if (validEdu.length >= 1) score += 10;

  // Action Verbs (up to 3 pts)
  score += Math.min(3, verbsFound);

  // Metrics Bonus (up to 2 pts)
  score += Math.min(2, metricsFound);

  const hasAnyData = Boolean(personal.fullName || personal.targetRole || summary.careerObjective || skills.techSkills || experience.length || projects.length);
  if (!hasAnyData) {
    score = 0;
  }

  score = Math.min(100, score);

  document.getElementById('atsVerbCount').innerText = verbsFound;
  document.getElementById('atsMetricsCount').innerText = metricsFound;
  document.getElementById('atsScoreNum').innerText = score;
  const gauge = document.getElementById('atsGauge');
  if (gauge) {
    gauge.style.background = score > 0 
      ? `conic-gradient(#10b981 0% ${score}%, #1f2937 ${score}% 100%)`
      : `conic-gradient(#1f2937 0% 100%, #1f2937 100% 100%)`;
  }

  const atsTitle = document.getElementById('atsHeroTitle');
  const atsDesc = document.getElementById('atsHeroDesc');
  if (atsTitle && atsDesc) {
    if (score >= 85) {
      atsTitle.innerText = 'Exceptional ATS Compatibility Rating';
      atsDesc.innerText = 'Your resume satisfies top Applicant Tracking Systems (Workday, Taleo, Greenhouse, Lever, iCIMS). Clean Times New Roman typography, zero tables, standard section naming, strong action verbs, and quantifiable metrics.';
    } else if (score >= 50) {
      atsTitle.innerText = `Moderate ATS Rating (${score}%) — Optimization Recommended`;
      atsDesc.innerText = 'Your resume has good foundational structure. Add more quantifiable metrics, action verbs, and complete your experience section to achieve 90%+ pass rate.';
    } else if (score > 0) {
      atsTitle.innerText = `Preliminary ATS Rating (${score}%)`;
      atsDesc.innerText = 'Keep filling in your education, skills, and work experience to satisfy all ATS parser criteria.';
    } else {
      atsTitle.innerText = 'ATS Rating: 0% — No Resume Content';
      atsDesc.innerText = 'Enter your professional details in the form or click "Load Sample Profile" to generate ATS score and recommendations.';
    }
  }
}

// ==========================================
// 9. EXPORT FEATURES (DOCX, PDF, PRINT, EDIT)
// ==========================================

function initExportHandlers() {
  // 1. Download PDF
  document.getElementById('btnDownloadPdf').addEventListener('click', () => {
    downloadPdf();
  });

  // 2. Download DOCX
  document.getElementById('btnDownloadDocx').addEventListener('click', () => {
    downloadDocx();
  });

  // 3. Print Resume
  document.getElementById('btnPrintResume').addEventListener('click', () => {
    window.print();
  });

  // 4. In-Place Edit Toggle
  document.getElementById('btnToggleEdit').addEventListener('click', () => {
    toggleInPlaceEdit();
  });
}

/**
 * Export exact A4 PDF using html2pdf.js preserving layout and icons
 */
function downloadPdf() {
  const element = document.getElementById('resumeSheet');
  const name = AppState.data.personal.fullName || 'Candidate';
  const filename = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_ATS_Resume.pdf`;

  showToast('Generating high-resolution ATS PDF...');

  const opt = {
    margin: [0, 0, 0, 0],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(element).save().then(() => {
      showToast('PDF downloaded successfully!');
    }).catch(err => {
      console.error('PDF generation error, triggering browser print fallback:', err);
      window.print();
    });
  } else {
    window.print();
  }
}

/**
 * Export authentic Microsoft Word .docx document using docx.umd.js
 * Strictly Times New Roman, bold headings with underline borders, table-free
 */
function downloadDocx() {
  if (!window.docx) {
    showToast('DOCX engine initializing...');
    return;
  }

  showToast('Generating Microsoft Word DOCX...');

  const { Document, Paragraph, TextRun, AlignmentType, BorderStyle } = window.docx;
  const { personal, summary, skills, experience, projects, certifications, education } = AppState.data;

  const font = 'Times New Roman';
  const docChildren = [];

  // 1. Centered Full Name (22pt, Bold)
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: (personal.fullName || 'ALEXANDER R. MORGAN').toUpperCase(),
          bold: true,
          size: 38,
          font: font,
          color: '000000'
        })
      ]
    })
  );

  // 2. Contact Row
  const contactText = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedinUrl,
    personal.githubUrl
  ].filter(Boolean).join('   |   ');

  if (contactText) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactText,
            size: 19,
            font: font,
            color: '000000'
          })
        ]
      })
    );
  }

  // Section Heading Helper
  function addSectionHeading(title) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 180, after: 80 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: '000000'
          }
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 21,
            font: font,
            color: '000000'
          })
        ]
      })
    );
  }

  // Helper 1: Summary / Objective Section
  function buildSummarySection(title) {
    if (!summary.careerObjective && !summary.coreValues) return;
    addSectionHeading(title);
    if (summary.careerObjective) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: summary.careerObjective,
              size: 20,
              font: font
            })
          ]
        })
      );
    }
    if (summary.coreValues) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [
            new TextRun({ text: "Core Values: ", bold: true, size: 19, font: font }),
            new TextRun({ text: summary.coreValues, size: 19, font: font })
          ]
        })
      );
    }
  }

  // Helper 2: Skills Section
  function buildSkillsSection(title) {
    if (!skills.techSkills && !skills.toolsTech && !skills.softSkills && !skills.languages) return;
    addSectionHeading(title);
    if (skills.techSkills) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'Technical Skills: ', bold: true, size: 20, font: font }),
            new TextRun({ text: skills.techSkills, size: 20, font: font })
          ]
        })
      );
    }
    if (skills.toolsTech) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'Tools & Technologies: ', bold: true, size: 20, font: font }),
            new TextRun({ text: skills.toolsTech, size: 20, font: font })
          ]
        })
      );
    }
    if (skills.softSkills) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: 'Soft Skills: ', bold: true, size: 20, font: font }),
            new TextRun({ text: skills.softSkills, size: 20, font: font })
          ]
        })
      );
    }
    if (skills.languages) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: 'Languages: ', bold: true, size: 20, font: font }),
            new TextRun({ text: skills.languages, size: 20, font: font })
          ]
        })
      );
    }
  }

  // Helper 3: Experience Section
  function buildExperienceSection(title) {
    if (experience.length === 0) return;
    addSectionHeading(title);
    experience.forEach(exp => {
      docChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 30 },
          children: [
            new TextRun({ text: exp.role || 'Role', bold: true, size: 21, font: font }),
            new TextRun({ text: `\t${exp.duration || ''}`, italics: true, size: 19, font: font })
          ]
        })
      );
      docChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: exp.company || 'Company', italics: true, size: 20, font: font }),
            new TextRun({ text: exp.location ? ` — ${exp.location}` : '', italics: true, size: 19, font: font })
          ]
        })
      );

      const allBullets = [...splitIntoBullets(exp.responsibilities), ...splitIntoBullets(exp.achievements)];
      allBullets.forEach(b => {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({ text: b, size: 19, font: font })
            ]
          })
        );
      });
    });
  }

  // Helper 4: Projects Section
  function buildProjectsSection(title) {
    if (projects.length === 0) return;
    addSectionHeading(title);
    projects.forEach(proj => {
      docChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 30 },
          children: [
            new TextRun({ text: proj.name || 'Project Name', bold: true, size: 21, font: font }),
            new TextRun({ text: proj.techStack ? ` (${proj.techStack})` : '', italics: true, size: 19, font: font })
          ]
        })
      );

      const bullets = splitIntoBullets(proj.description);
      bullets.forEach(b => {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({ text: b, size: 19, font: font })
            ]
          })
        );
      });
    });
  }

  // Helper 5: Certifications Section
  function buildCertificationsSection(title) {
    if (!certifications.certs && !certifications.awards && !certifications.hackathons && !certifications.publications) return;
    addSectionHeading(title);
    const items = [];
    if (certifications.certs) certifications.certs.split('\n').filter(Boolean).forEach(c => items.push(`Certification: ${c.trim()}`));
    if (certifications.awards) certifications.awards.split('\n').filter(Boolean).forEach(a => items.push(`Award: ${a.trim()}`));
    if (certifications.hackathons) certifications.hackathons.split('\n').filter(Boolean).forEach(h => items.push(`Hackathon / Honor: ${h.trim()}`));
    if (certifications.publications) certifications.publications.split('\n').filter(Boolean).forEach(p => items.push(`Publication: ${p.trim()}`));

    items.forEach(item => {
      docChildren.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30 },
          children: [
            new TextRun({ text: item, size: 19, font: font })
          ]
        })
      );
    });
  }

  // Helper 6: Education Section (with Coursework for Student ATS)
  function buildEducationSection(title) {
    if (education.length === 0) return;
    addSectionHeading(title);
    education.forEach(edu => {
      const yearRange = [edu.startYear, edu.endYear].filter(Boolean).join(' – ');
      docChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({ text: edu.degree || 'Degree', bold: true, size: 21, font: font }),
            new TextRun({ text: `\t${yearRange}`, italics: true, size: 19, font: font })
          ]
        })
      );
      docChildren.push(
        new Paragraph({
          spacing: { after: edu.coursework ? 30 : 60 },
          children: [
            new TextRun({ text: edu.college || 'University', italics: true, size: 20, font: font }),
            new TextRun({ text: edu.cgpa ? ` | GPA: ${edu.cgpa}` : '', italics: true, size: 19, font: font })
          ]
        })
      );
      if (edu.coursework) {
        docChildren.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Relevant Coursework: ', bold: true, size: 19, font: font }),
              new TextRun({ text: edu.coursework, size: 19, font: font })
            ]
          })
        );
      }
    });
  }

  // Assemble DOCX Sections strictly ordered by Track (Student vs Experienced)
  if (AppState.resumeMode === 'student') {
    // 🎓 Student ATS Order:
    // 1. Career Objective
    buildSummarySection('Career Objective');
    // 2. Education & Relevant Coursework (Priority for Students!)
    buildEducationSection('Education & Relevant Coursework');
    // 3. Technical Skills & Competencies
    buildSkillsSection('Technical Skills & Competencies');
    // 4. Academic & Technical Projects (Priority!)
    buildProjectsSection('Technical & Academic Projects');
    // 5. Internships & Work Experience (if any)
    buildExperienceSection('Internships & Work Experience');
    // 6. Honors, Certifications & Hackathons
    buildCertificationsSection('Honors, Certifications & Hackathons');
  } else {
    // 💼 Experienced Industry ATS Order:
    // 1. Professional Summary
    buildSummarySection('Professional Summary');
    // 2. Core Competencies & Technical Skills
    buildSkillsSection('Core Competencies & Technical Skills');
    // 3. Professional Experience (Quantifiable impact first)
    buildExperienceSection('Professional Experience');
    // 4. Key Technical Projects
    buildProjectsSection('Key Technical Projects');
    // 5. Awards & Certifications
    buildCertificationsSection('Awards & Certifications');
    // 6. Education (At the bottom)
    buildEducationSection('Education');
  }

  // Construct Document with 12.7mm (720 dxa) margins
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 720,
            right: 720,
            bottom: 720,
            left: 720
          }
        }
      },
      children: docChildren
    }]
  });

  const name = personal.fullName || 'Candidate';
  const filename = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_ATS_Resume.docx`;

  window.docx.Packer.toBlob(doc).then(blob => {
    if (window.saveAs) {
      window.saveAs(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
    showToast('DOCX downloaded successfully!');
  }).catch(err => {
    console.error('Error generating DOCX:', err);
    showToast('Failed to generate DOCX');
  });
}

/**
 * Toggle In-Place Edit Mode
 */
function toggleInPlaceEdit() {
  const sheet = document.getElementById('resumeSheet');
  const banner = document.getElementById('editBadgeBanner');
  const btnText = document.getElementById('btnEditText');

  AppState.isEditing = !AppState.isEditing;

  if (AppState.isEditing) {
    sheet.contentEditable = 'true';
    sheet.classList.add('editing');
    banner.classList.add('show');
    btnText.innerText = 'Lock & Save Edits';
    showToast('In-place edit mode enabled. Click on text to edit!');
  } else {
    sheet.contentEditable = 'false';
    sheet.classList.remove('editing');
    banner.classList.remove('show');
    btnText.innerText = 'Edit Resume';
    showToast('Edits saved to current view!');
  }
}
