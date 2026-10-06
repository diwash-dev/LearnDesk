import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Download,
  ExternalLink,
  GraduationCap,
  Landmark,
  Layers,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

/* ---------- Sample data ----------
   SAMPLE / DUMMY records for UI development. They are NOT the official TU BCA syllabus.
   Later: replace `subjects` with a fetch to the Express API (GET /api/syllabus).
   Each record keeps the same shape the Prisma Subject/Syllabus models can return:
   { semester, subject, subjectCode, creditHours, description, units: [{ title, topics }], fileUrl }
   fileUrl will point to the PDF stored on Cloudinary. */

// Compact authoring format: "Unit title:topic,topic,topic|Unit title:topic,topic"
const parseUnits = (str) =>
  str.split("|").map((u) => {
    const [title, topics] = u.split(":");
    return {
      title: title.trim(),
      topics: topics.split(",").map((t) => t.trim()),
    };
  });

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// [subject, subjectCode, creditHours, description, units]
const raw = {
  1: [
    [
      "Computer Fundamentals",
      "BCA-CF",
      3,
      "Basics of computers, number systems, hardware, software and the internet.",
      "Introduction to Computers:History,Generations,Types of computers|Number Systems:Binary and octal,Hexadecimal,Base conversions|Hardware and Memory:CPU and ALU,Primary memory,Storage devices|Software and Operating Systems:System software,Application software,Operating system basics|Networks and the Internet:LAN and WAN,Internet services,Cyber safety",
    ],
    [
      "Mathematics I",
      "BCA-M1",
      3,
      "Calculus and linear algebra foundations for computing students.",
      "Functions and Limits:Functions,Limits,Continuity|Differentiation:Rules of derivatives,Applications,Maxima and minima|Integration:Definite integrals,Techniques,Area under curves|Matrices and Determinants:Matrix operations,Determinants,Inverse|Linear Equations:Gaussian elimination,Consistency,Applications",
    ],
    [
      "Programming in C",
      "BCA-PC",
      4,
      "Structured programming concepts and problem solving using the C language.",
      "Programming Concepts:Algorithms,Flowcharts,Program structure|Data Types and Operators:Variables,Operators,Input and output|Control Structures:Decision making,Loops,Switch statements|Functions and Arrays:Function calls,Recursion,Arrays and strings|Pointers and Files:Pointers,Structures,File handling",
    ],
    [
      "Digital Logic",
      "BCA-DL",
      3,
      "Boolean algebra, logic gates and design of combinational and sequential circuits.",
      "Number Systems and Codes:Binary codes,Complements,Error detection|Boolean Algebra:Postulates,Logic gates,Simplification|Combinational Circuits:Adders,Multiplexers,Decoders|Sequential Circuits:Flip-flops,Registers,Counters|Memory and Programmable Logic:ROM and RAM,PLA,PAL",
    ],
    [
      "Technical English",
      "BCA-TE",
      3,
      "Communication skills for academic and professional technical writing.",
      "Communication Basics:Process of communication,Barriers,Listening skills|Grammar and Vocabulary:Sentence structure,Technical vocabulary,Common errors|Technical Writing:Reports,Proposals,Documentation|Business Correspondence:Letters,Emails,Resumes|Presentation Skills:Planning,Slide design,Delivery",
    ],
  ],
  2: [
    [
      "Object Oriented Programming",
      "BCA-OOP",
      4,
      "Core object oriented concepts: classes, inheritance, polymorphism and exception handling.",
      "Introduction to OOP:Objects and classes,Encapsulation,Abstraction|Classes and Objects:Constructors,Destructors,Static members|Inheritance:Types of inheritance,Overriding,Access control|Polymorphism:Function overloading,Operator overloading,Virtual functions|Exceptions and Files:Exception handling,Streams,Templates",
    ],
    [
      "Mathematics II",
      "BCA-M2",
      3,
      "Discrete structures and applied mathematics for computer science.",
      "Sets and Relations:Set operations,Relations,Functions|Logic and Proofs:Propositional logic,Quantifiers,Proof methods|Counting:Permutations,Combinations,Recurrence relations|Graph Theory:Graphs and trees,Traversal,Shortest paths|Algebraic Structures:Groups,Rings,Lattices",
    ],
    [
      "Data Structures and Algorithms",
      "BCA-DSA",
      4,
      "Fundamental data structures and algorithm analysis techniques.",
      "Algorithm Analysis:Complexity,Asymptotic notation,Recursion|Stacks and Queues:Array implementation,Linked implementation,Applications|Linked Lists:Singly linked,Doubly linked,Circular lists|Trees and Graphs:Binary trees,Search trees,Graph traversal|Sorting and Searching:Sorting algorithms,Binary search,Hashing",
    ],
    [
      "Computer Architecture",
      "BCA-CA",
      3,
      "Organization of processors, memory, input output and parallel systems.",
      "Basic Computer Organization:Instruction cycle,Registers,Bus structure|Central Processing Unit:ALU design,Control unit,Instruction formats|Memory Organization:Cache memory,Virtual memory,Memory hierarchy|Input Output Organization:Interrupts,DMA,I/O interfaces|Parallel Processing:Pipelining,Vector processing,Multiprocessors",
    ],
    [
      "Statistics",
      "BCA-ST",
      3,
      "Descriptive statistics, probability and inference for data analysis.",
      "Descriptive Statistics:Measures of central tendency,Dispersion,Graphical methods|Probability:Probability rules,Conditional probability,Bayes theorem|Random Variables:Discrete distributions,Continuous distributions,Expectation|Sampling and Estimation:Sampling methods,Estimation,Confidence intervals|Hypothesis Testing:Z and t tests,Chi-square test,Regression basics",
    ],
  ],
  3: [
    [
      "Database Management System",
      "BCA-DBMS",
      3,
      "Fundamentals of database systems, relational models and database design.",
      "Introduction to Database Systems:Database concepts,Architecture,Data models|Relational Model and SQL:Relational algebra,SQL queries,Views|Database Design and Normalization:ER modelling,Functional dependencies,Normal forms|Transaction Management:ACID properties,Concurrency control,Recovery|Database Security:Access control,Integrity,Backup strategies",
    ],
    [
      "Operating Systems",
      "BCA-OS",
      3,
      "Process, memory, file and device management in modern operating systems.",
      "Introduction to Operating Systems:OS functions,System calls,Structures|Process Management:Processes and threads,CPU scheduling,Synchronization|Deadlocks:Deadlock conditions,Prevention,Detection and recovery|Memory Management:Paging,Segmentation,Virtual memory|File and Disk Management:File systems,Disk scheduling,Protection",
    ],
    [
      "Web Technology",
      "BCA-WT",
      3,
      "Building static and dynamic websites with HTML, CSS and JavaScript.",
      "Web Fundamentals:Internet and HTTP,Web servers,Browsers|HTML and CSS:HTML elements,Forms,CSS layouts|JavaScript Basics:Syntax,DOM manipulation,Events|Server Side Scripting:Request handling,Sessions,Database access|Web Publishing:Hosting,Domain names,Web accessibility",
    ],
    [
      "Numerical Methods",
      "BCA-NM",
      3,
      "Computational techniques for solving mathematical problems numerically.",
      "Errors and Approximation:Types of errors,Floating point,Error propagation|Solution of Equations:Bisection method,Newton-Raphson,Secant method|Interpolation:Lagrange,Newton forms,Splines|Numerical Calculus:Differentiation,Trapezoidal rule,Simpson rule|Linear Systems:Gauss elimination,Iterative methods,Matrix inversion",
    ],
    [
      "Computer Graphics",
      "BCA-CG",
      3,
      "Principles of 2D and 3D graphics, transformations and rendering.",
      "Graphics Systems:Display devices,Raster and vector,Applications|Output Primitives:Line drawing,Circle drawing,Fill algorithms|2D Transformations:Translation and scaling,Rotation,Clipping|3D Concepts:3D transformations,Projections,Visible surface detection|Illumination and Color:Lighting models,Shading,Color models",
    ],
  ],
  4: [
    [
      "Software Engineering",
      "BCA-SE",
      3,
      "Software process models, requirements, design and testing practices.",
      "Software Process:Software crisis,Life cycle models,Agile methods|Requirements Engineering:Elicitation,Specification,Validation|Software Design:Design principles,Architectural design,UML modelling|Testing and Quality:Testing strategies,Test cases,Quality assurance|Maintenance and Management:Maintenance types,Configuration management,Cost estimation",
    ],
    [
      "Computer Networks",
      "BCA-CN",
      3,
      "Network models, protocols and data communication fundamentals.",
      "Network Fundamentals:Topologies,OSI model,TCP/IP model|Physical and Data Link Layers:Transmission media,Error control,MAC protocols|Network Layer:IP addressing,Routing algorithms,Subnetting|Transport Layer:TCP,UDP,Congestion control|Application Layer:DNS,HTTP and email,Network security basics",
    ],
    [
      "Java Programming",
      "BCA-JP",
      4,
      "Object oriented application development using Java.",
      "Java Basics:JVM and bytecode,Data types,Control flow|Classes and Interfaces:Packages,Interfaces,Abstract classes|Exception and Collections:Exceptions,Collection framework,Generics|GUI and Events:Swing components,Event handling,Layouts|Database and Networking:JDBC,Sockets,Multithreading",
    ],
    [
      "System Analysis and Design",
      "BCA-SAD",
      3,
      "Analysing business needs and designing information systems.",
      "Systems Concepts:System types,Life cycle,Stakeholders|Requirement Analysis:Fact finding,Feasibility,Use cases|Process and Data Modelling:Data flow diagrams,ER diagrams,Data dictionary|System Design:Input and output design,Database design,Prototyping|Implementation:Testing,Conversion,Maintenance",
    ],
    [
      "Artificial Intelligence",
      "BCA-AI",
      3,
      "Introductory concepts in search, knowledge representation and intelligent agents.",
      "Introduction to AI:History,Intelligent agents,Problem formulation|Search Techniques:Uninformed search,Heuristic search,Game playing|Knowledge Representation:Propositional logic,Predicate logic,Semantic networks|Reasoning under Uncertainty:Probability basics,Bayesian networks,Fuzzy logic|AI Applications:Expert systems,Natural language,Robotics overview",
    ],
  ],
  5: [
    [
      "Web Programming",
      "BCA-WP",
      4,
      "Full stack web application development with modern frameworks.",
      "Modern JavaScript:ES6 features,Modules,Asynchronous code|Front End Frameworks:Components,State management,Routing|Server Programming:Node and Express,REST APIs,Middleware|Data and Authentication:Database integration,Sessions and tokens,Validation|Deployment:Build tools,Hosting,Performance",
    ],
    [
      "Mobile Application Development",
      "BCA-MAD",
      3,
      "Designing and building applications for mobile platforms.",
      "Mobile Platforms:Android and iOS overview,App lifecycle,Tooling|User Interface Design:Layouts,Widgets,Navigation|Data Storage:Local storage,SQLite,Preferences|Networking and Services:REST calls,Background tasks,Notifications|Publishing:Testing,Packaging,Store guidelines",
    ],
    [
      "Computer Security",
      "BCA-CS",
      3,
      "Foundations of cryptography, authentication and system security.",
      "Security Basics:Threats and attacks,Security goals,Policies|Cryptography:Symmetric ciphers,Public key systems,Hash functions|Authentication:Passwords,Digital signatures,Certificates|Network Security:Firewalls,VPN,Intrusion detection|Secure Software:Common vulnerabilities,Secure coding,Incident response",
    ],
    [
      "Cloud Computing",
      "BCA-CC",
      3,
      "Cloud models, virtualization and deploying services on the cloud.",
      "Cloud Fundamentals:Service models,Deployment models,Benefits and risks|Virtualization:Hypervisors,Virtual machines,Containers|Cloud Services:Compute and storage,Networking,Databases|Cloud Security:Identity management,Data protection,Compliance|Cloud Applications:Scalability,Cost management,Case studies",
    ],
    [
      "E-Commerce",
      "BCA-EC",
      3,
      "Business models, payments and technology behind online commerce.",
      "Introduction to E-Commerce:Business models,Value chain,Trends|E-Commerce Technology:Web infrastructure,Shopping carts,Mobile commerce|Electronic Payment:Payment gateways,Digital wallets,Security|Marketing and Strategy:Digital marketing,Customer relationship,Analytics|Legal and Ethical Issues:Cyber law,Privacy,Consumer protection",
    ],
  ],
  6: [
    [
      "Advanced Database",
      "BCA-ADB",
      3,
      "Distributed, object relational and NoSQL database concepts.",
      "Query Processing:Query optimization,Cost estimation,Indexing|Distributed Databases:Fragmentation,Replication,Distributed transactions|Object Relational Databases:Object models,Complex types,Inheritance|NoSQL Systems:Document stores,Key value stores,Graph databases|Data Warehousing:OLAP,ETL,Star schema",
    ],
    [
      "Internet Technology",
      "BCA-IT",
      3,
      "Internet architecture, protocols and web services.",
      "Internet Architecture:History,Addressing,Protocols|Web Services:SOAP,REST,API design|Email and Messaging:SMTP and IMAP,Instant messaging,Spam control|Content Delivery:Caching,CDN,Load balancing|Emerging Technologies:IoT,Edge computing,Web3 overview",
    ],
    [
      "Software Project Management",
      "BCA-SPM",
      3,
      "Planning, scheduling and controlling software projects.",
      "Project Planning:Scope,Work breakdown,Estimation|Scheduling:Gantt charts,Critical path,Resource allocation|Risk Management:Risk identification,Analysis,Mitigation|Quality and Teams:Team structures,Quality plans,Reviews|Project Tools:Version control,Tracking tools,Reporting",
    ],
    [
      "Information Security",
      "BCA-IS",
      3,
      "Managing information security risks, policies and compliance.",
      "Security Management:Governance,Risk assessment,Policies|Access Control:Models,Identity management,Audit|Application Security:Web vulnerabilities,Testing,Secure deployment|Digital Forensics:Evidence handling,Tools,Reporting|Law and Compliance:Cyber law,Standards,Business continuity",
    ],
    [
      "Machine Learning",
      "BCA-ML",
      3,
      "Introductory supervised and unsupervised learning methods.",
      "Learning Basics:Types of learning,Data preparation,Model evaluation|Supervised Learning:Linear regression,Logistic regression,Decision trees|Unsupervised Learning:Clustering,Dimensionality reduction,Association rules|Neural Networks:Perceptron,Backpropagation,Deep learning overview|ML in Practice:Overfitting,Tools and libraries,Ethics",
    ],
  ],
  7: [
    [
      "Advanced Web Technology",
      "BCA-AWT",
      3,
      "Scalable and secure web architectures and modern web standards.",
      "Web Architecture:Client server patterns,Microservices,APIs|Progressive Web Apps:Service workers,Offline support,Manifests|Web Security:Authentication flows,XSS and CSRF,HTTPS|Performance Engineering:Caching,Optimization,Monitoring|Deployment Pipelines:CI and CD,Containers,Cloud hosting",
    ],
    [
      "Network Programming",
      "BCA-NP",
      3,
      "Developing networked applications using sockets and protocols.",
      "Socket Basics:TCP sockets,UDP sockets,Addressing|Client Server Design:Concurrent servers,Multithreading,I/O models|Application Protocols:HTTP clients,Email protocols,FTP|Secure Communication:TLS,Authentication,Encryption|Network Tools:Packet capture,Debugging,Diagnostics",
    ],
    [
      "Data Mining",
      "BCA-DM",
      3,
      "Techniques for discovering patterns in large datasets.",
      "Introduction to Data Mining:Knowledge discovery,Data types,Preprocessing|Association Rules:Frequent itemsets,Apriori,Evaluation|Classification:Decision trees,Naive Bayes,Model assessment|Clustering:K-means,Hierarchical methods,Density methods|Mining Applications:Text mining,Web mining,Ethical issues",
    ],
    [
      "Project Work",
      "BCA-PW",
      4,
      "Guided team project covering design, development and documentation.",
      "Project Proposal:Problem identification,Objectives,Feasibility|Requirement and Design:Requirement analysis,System design,Prototype|Implementation:Coding standards,Version control,Integration|Testing and Review:Test plans,Defect tracking,Peer review|Report and Presentation:Documentation,Defense preparation,Demonstration",
    ],
    [
      "Elective",
      "BCA-EL1",
      3,
      "Elective course chosen from the list offered by the department.",
      "Elective Overview:Course scope,Learning outcomes,Prerequisites|Core Concepts:Key theory,Terminology,Case examples|Tools and Techniques:Industry tools,Hands-on practice,Mini tasks|Applications:Real world uses,Case studies,Trends|Assessment and Review:Assignments,Presentation,Revision",
    ],
  ],
  8: [
    [
      "Internship / Project",
      "BCA-INT",
      6,
      "Industry internship or major project with a final report and defense.",
      "Placement and Planning:Organization selection,Work plan,Supervision|Work Experience:Daily log,Skill development,Mentor feedback|Project Development:Requirements,Implementation,Testing|Reporting:Report structure,Citations,Formatting|Final Defense:Presentation,Viva,Evaluation",
    ],
    [
      "Advanced Computing",
      "BCA-AC",
      3,
      "High performance, parallel and emerging computing paradigms.",
      "Parallel Computing:Parallel models,Multithreading,Speedup|High Performance Systems:Clusters,GPUs,Benchmarking|Big Data Basics:Storage,Batch processing,Stream processing|Emerging Paradigms:Edge computing,Quantum overview,Blockchain|Case Studies:Scientific computing,Industry systems,Trends",
    ],
    [
      "Cloud / Distributed Computing",
      "BCA-DC",
      3,
      "Principles of distributed systems and cloud native design.",
      "Distributed System Concepts:Characteristics,Architectures,Communication|Coordination:Clocks,Consensus,Leader election|Fault Tolerance:Replication,Recovery,Consistency models|Cloud Native Design:Containers,Orchestration,Serverless|Operations:Monitoring,Scaling,Cost optimization",
    ],
    [
      "Information Systems",
      "BCA-INFS",
      3,
      "Role of information systems in organizations and decision making.",
      "Information Systems Basics:Components,Types,Organizational role|Enterprise Systems:ERP,CRM,Supply chain|Decision Support:DSS,Business intelligence,Dashboards|Strategy and Governance:IT strategy,Governance,Ethics|System Acquisition:Outsourcing,Evaluation,Change management",
    ],
    [
      "Elective",
      "BCA-EL2",
      3,
      "Second elective course chosen from the list offered by the department.",
      "Elective Overview:Course scope,Learning outcomes,Prerequisites|Core Concepts:Key theory,Terminology,Case examples|Tools and Techniques:Industry tools,Hands-on practice,Mini tasks|Applications:Real world uses,Case studies,Trends|Assessment and Review:Assignments,Presentation,Revision",
    ],
  ],
};

export const subjects = Object.entries(raw).flatMap(([sem, list]) =>
  list.map(([subject, subjectCode, creditHours, description, units]) => ({
    semester: Number(sem),
    subject,
    slug: slugify(subject),
    subjectCode,
    creditHours,
    description,
    units: parseUnits(units),
    fileUrl: "#",
  })),
);

const ordinal = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
export const semesterNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-3 text-[15px] font-semibold text-white shadow-soft transition-colors hover:bg-brand-800";
const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50";

/* ---------- Page ---------- */

export default function Syllabus() {
  const { semester, slug } = useParams();
  const sem = semester === undefined ? 0 : Number(semester);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [semester, slug]);

  if (
    semester !== undefined &&
    !(Number.isInteger(sem) && sem >= 1 && sem <= 8)
  ) {
    return <Navigate to="/syllabus" replace />;
  }

  const subject = slug
    ? subjects.find((s) => s.semester === sem && s.slug === slug)
    : null;
  if (slug && !subject) return <Navigate to={`/syllabus/${sem}`} replace />;

  return (
    <>
      <Navbar />
      <main>{subject ? <Detail subject={subject} /> : <List sem={sem} />}</main>
      <Footer />
    </>
  );
}

function Crumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="text-slate-400" />}
            {c.to ? (
              <Link
                to={c.to}
                className="transition-colors hover:text-brand-700"
              >
                {c.label}
              </Link>
            ) : (
              <span className="font-medium text-ink">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- List view ---------- */

function List({ sem }) {
  const groups = sem === 0 ? [1, 2, 3, 4, 5, 6, 7, 8] : [sem];
  const gridCols = "md:grid-cols-[2.5rem_minmax(0,1fr)_6.5rem_5.5rem_9rem]";

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-10 sm:py-12">
          <Crumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Syllabus", to: "/syllabus" },
              { label: "BCA" },
            ]}
          />
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            BCA Syllabus
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">
            Browse the Bachelor of Computer Applications syllabus semester by
            semester.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5 text-sm font-medium text-slate-600">
            {[
              [GraduationCap, "Bachelor of Computer Applications (BCA)"],
              [Landmark, "Tribhuvan University"],
              [Layers, "8 Semesters"],
            ].map(([Icon, t]) => (
              <li
                key={t}
                className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-1.5"
              >
                <Icon size={15} className="text-brand-600" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="wrap space-y-12">
          {groups.map((n) => {
            const list = subjects.filter((s) => s.semester === n);
            const credits = list.reduce((sum, s) => sum + s.creditHours, 0);
            return (
              <div key={n}>
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <h2 className="text-2xl font-bold text-ink">
                    {ordinal[n]} Semester
                  </h2>
                  <p className="text-sm text-slate-500">
                    {list.length} subjects, {credits} credit hours
                  </p>
                </div>

                <div className="mt-5 overflow-hidden rounded-xl border border-line bg-white shadow-soft">
                  <div
                    className={`hidden gap-4 border-b border-line bg-surface/70 px-5 py-3 text-xs font-medium text-slate-500 md:grid ${gridCols}`}
                  >
                    <span />
                    <span>Subject</span>
                    <span>Semester</span>
                    <span>Units</span>
                    <span />
                  </div>
                  <div className="divide-y divide-line">
                    {list.map((s) => (
                      <div
                        key={s.slug + s.subjectCode}
                        className={`grid gap-3 px-4 py-4 transition-colors hover:bg-brand-50/50 sm:px-5 md:items-center md:gap-4 ${gridCols}`}
                      >
                        <span className="hidden h-10 w-10 items-center justify-center rounded-lg border border-line text-brand-600 md:flex">
                          <BookOpen size={18} />
                        </span>
                        <div className="min-w-0">
                          <Link
                            to={`/syllabus/${s.semester}/${s.slug}`}
                            className="text-[15px] font-semibold text-ink transition-colors hover:text-brand-700"
                          >
                            {s.subject}
                          </Link>
                          <p className="mt-0.5 text-sm font-medium text-brand-600">
                            {s.subjectCode} · {s.creditHours} Credits
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                            {s.description}
                          </p>
                        </div>
                        <div className="flex gap-3 text-sm text-slate-600 md:contents">
                          <p>Semester {s.semester}</p>
                          <p>
                            <span className="md:hidden">· </span>
                            {s.units.length} Units
                          </p>
                        </div>
                        <Link
                          to={`/syllabus/${s.semester}/${s.slug}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 md:justify-self-end"
                        >
                          View Syllabus
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </section>
    </>
  );
}

/* ---------- Detail view ---------- */

function Detail({ subject: s }) {
  const facts = [
    ["Subject code", s.subjectCode],
    ["Semester", `${ordinal[s.semester]} Semester`],
    ["Credit hours", `${s.creditHours} Credits`],
    ["Course units", `${s.units.length} Units`],
  ];

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-10 sm:py-12">
          <Crumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Syllabus", to: "/syllabus" },
              {
                label: `Semester ${s.semester}`,
                to: `/syllabus/${s.semester}`,
              },
              { label: s.subject },
            ]}
          />
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-ink sm:text-5xl">
            {s.subject}
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            {s.subjectCode} · {s.creditHours} Credits · Semester {s.semester}
          </p>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-12">
          <aside className="order-first lg:order-last lg:col-span-4">
            <div className="rounded-xl border border-line bg-white p-5 shadow-soft lg:sticky lg:top-28">
              <dl className="divide-y divide-line">
                {facts.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-4 py-3 text-sm first:pt-0"
                  >
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-right font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-2 flex flex-col gap-3">
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={btnPrimary}
                >
                  <ExternalLink size={17} />
                  View PDF
                </a>
                <a href={s.fileUrl} download className={btnSecondary}>
                  <Download size={17} className="text-brand-600" />
                  Download PDF
                </a>
              </div>
            </div>
          </aside>

          <div className="min-w-0 lg:col-span-8">
            <h2 className="text-2xl font-bold text-ink">Course Description</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
              {s.description}
            </p>

            <h2 className="mt-12 text-2xl font-bold text-ink">Course Units</h2>
            <ol className="mt-5 divide-y divide-line overflow-hidden rounded-xl border border-line">
              {s.units.map((u, i) => (
                <li key={u.title} className="flex gap-4 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.14em] text-brand-600">
                      UNIT {i + 1}
                    </p>
                    <h3 className="mt-1 font-semibold text-ink">{u.title}</h3>
                    <ul className="mt-3 grid gap-1.5 text-sm text-slate-600 sm:grid-cols-2">
                      {u.topics.map((t) => (
                        <li key={t} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              to={`/syllabus/${s.semester}`}
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              <ArrowLeft size={15} />
              Back to {ordinal[s.semester]} Semester syllabus
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
