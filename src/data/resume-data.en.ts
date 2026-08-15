import type { ResumeData } from "./resume-data";

/**
 * CV en inglés.
 *
 * Traducción, no reescritura: la estructura tiene que coincidir campo a campo
 * con `resume-data.es.ts`, y hay pruebas que lo comprueban. Si añades un empleo
 * en un idioma y no en el otro, el CV en inglés se queda corto sin que nada
 * falle al compilar.
 *
 * Nombre, correo, teléfono y perfiles se repiten idénticos a propósito: son
 * datos, no texto, y las pruebas verifican que no se desvíen.
 */
export const resumeEn = {
  name: "Jorge Herminio",
  lastName: "López Vázquez",
  title:
    "Senior Full-Stack Engineer | Fintech · Proptech · Blockchain | 8+ Years of Experience",
  profile:
    "Software engineer with over 8 years building products across fintech and proptech, with hands-on blockchain experience. Proven track record of driving growth and technical value inside fast-scaling startups. Experienced in integrating bank payment systems (STP/SPEI, Bitso), implementing real estate tokenization, and taking products from idea to production. Cross-border operations between Mexico, Spain and Ukraine with an agile mindset and a focus on results.",
  contact: {
    email: "jorge.ipn.7@gmail.com",
    phone: {
      label: "+52 55 8617 0161",
      url: "https://wa.me/525586170161",
      note: "Available on WhatsApp",
    },
    location: "Mexico City",
    linkedin: {
      label: "linkedin.com/in/jorgeipn7",
      url: "https://linkedin.com/in/jorgeipn7",
    },
    github: {
      label: "github.com/JorgeIPN7",
      url: "https://github.com/JorgeIPN7",
    },
  },
  experience: [
    {
      title: "Tech Lead & Senior Full-Stack Engineer",
      company: "FitalMx — Fintech & Proptech Startup",
      location: "Mexico City",
      period: "Oct 2023 – Present",
      items: [
        {
          label: "Fintech Infrastructure",
          text: "Designed the full AWS architecture (VPC, EC2, S3, RDS) and established the P2P connection with STP/SPEI for real-time bank payments. Integration delivered from scratch in 3 weeks.",
        },
        {
          label: "Real Estate Tokenization",
          text: "Led the technical pivot, implementing smart contracts for NFTs and fungible tokens on Solana and Ethereum. Integrated the Bitso OTC API for real-time fiat-crypto conversion.",
        },
        {
          label: "Platforms in Production",
          text: "Built wallet.fitalmx.com with NestJS + Next.js + PostgreSQL + TypeORM following DDD. 1,000+ active users and 100+ bank transactions per month.",
        },
        {
          label: "Cost Reduction (~80%)",
          text: "Replaced a 5-person offshore team by rebuilding the crypto wallet in-house as the sole developer, without sacrificing quality or delivery speed.",
        },
        {
          label: "Technical Leadership",
          text: "Lead a team of 3 developers under Scrum. Coordinated a Ukrainian offshore team, managing cross-timezone delivery. Translate business requirements into technical specifications and MVPs.",
        },
      ],
    },
    {
      title: "Full-Stack Engineer & Founding Team",
      company: "Clikalia — Proptech Platform (backed by Scotiabank)",
      location: "Mexico City / Madrid, Spain",
      period: "Sep 2021 – Sep 2023",
      items: [
        {
          label: "Cross-Border Founding Team",
          text: "Key member of the founding IT team in Mexico (growth from 4 to 15 developers). Adapted the Spanish legacy codebase to Mexican regulations, migrating from React to Next.js and the backend to Express.js + Node.js.",
        },
        {
          label: "Backend Architecture",
          text: "Designed API services with Express.js and Azure Functions following Onion Architecture for geolocation, asset management and the real estate buy-sell flow.",
        },
        {
          label: "In-House CRM",
          text: "Worked with the global team in Spain to build an internal CRM with MongoDB + Express.js, removing costly Microsoft Dynamics and HubSpot licences.",
        },
        {
          label: "Sales Automation",
          text: "Integrated HubSpot CRM with internal APIs through Azure Functions, automating lead capture and data synchronisation across departments.",
        },
        {
          label: "Promoted on Performance",
          text: "Selected to work directly with the engineering team in Spain, acting as the technical bridge between the Mexican and European operations.",
        },
      ],
    },
    {
      title: "Backend Developer (.NET)",
      company: "SmartByte — Software Consultancy (Client: PwC Mexico)",
      location: "Mexico City",
      period: "Sep 2018 – Sep 2021",
      items: [
        {
          label: "Critical System Migration",
          text: "Took part in migrating the CFE system from ASP.NET Framework 4.5 to .NET Core 3.1, implementing DDD. Outcome formally recognised by the client.",
        },
        {
          label: "Database Optimisation",
          text: "Worked with the DBA on SQL Server stored procedure design, improving query performance in high-volume financial environments.",
        },
        {
          label: "Agile Methodologies",
          text: "Contributed to the adoption of Scrum/Kanban with Azure DevOps, shortening the consultancy team's delivery cycles.",
        },
      ],
    },
    {
      title: "Software Analyst",
      company: "SONDA — IT Consultancy (Client: Palacio de Hierro)",
      location: "Mexico City",
      period: "Sep 2017 – Sep 2018",
      items: [
        {
          label: "",
          text: "Monitored and resolved software incidents during high-traffic retail events (Noches Palacio), keeping the system available for one of Mexico's largest luxury retail chains.",
        },
        {
          label: "",
          text: "Wrote database query scripts that sped up incident resolution, contributing development work beyond the assigned role.",
        },
      ],
    },
    {
      title: "Web Developer (Sole developer)",
      company: "Regenersis Mexico — Device Repair",
      location: "Mexico City",
      period: "2016 – 2017",
      items: [
        {
          label: "E-Commerce From Scratch",
          text: "Designed and launched a complete web store with PHP (CodeIgniter), JavaScript, jQuery and MySQL, integrating PayPal payments. Opened a new B2C revenue channel.",
        },
        {
          label: "Automation",
          text: "Built internal payroll and attendance tools that replaced third-party software, producing direct savings.",
        },
      ],
    },
  ],
  education: [
    {
      degree: "BSc in Computer Systems Engineering",
      date: "",
      institution:
        "Instituto Politécnico Nacional (IPN) — Escuela Superior de Cómputo (ESCOM), Mexico City",
    },
  ],
  continuousLearning:
    "Ongoing training in software architecture, AWS, blockchain development, technical leadership and team management. Self-directed learning as a career backbone: every technology shift (PHP → .NET → Node.js → Blockchain) was driven by my own initiative.",
  technicalSkills: {
    "Backend & Architecture": [
      "Node.js",
      "NestJS",
      "Express.js",
      "TypeScript",
      ".NET Core (C#)",
      "REST APIs",
      "Clean Architecture",
      "DDD",
    ],
    Frontend: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Shadcn UI",
      "JavaScript (ES6+)",
    ],
    "Cloud & Infrastructure": [
      "AWS (EC2, S3, RDS, VPC, VPN)",
      "Azure (Functions, DevOps)",
    ],
    Databases: [
      "PostgreSQL",
      "SQL Server",
      "MongoDB",
      "CosmosDB",
      "TypeORM",
      "Entity Framework",
    ],
    "Blockchain & Fintech": [
      "Real estate tokenization",
      "NFTs",
      "Solana",
      "Ethereum",
      "Bitso API",
      "STP/SPEI",
      "Crypto Wallets",
    ],
  },
  softSkills: {
    "Leadership & Management": [
      "Team leadership",
      "Scrum",
      "Kanban",
      "Cross-border coordination",
      "Translating business requirements",
    ],
    Collaboration: [
      "Working with distributed teams",
      "Technical bridge between international operations",
      "Team mindset",
    ],
    Growth: [
      "Self-directed learning",
      "Building technology departments from scratch",
      "Results-driven",
    ],
  },
  languages: [
    { language: "Spanish", level: "Native" },
    { language: "English", level: "B2 — Professional working proficiency" },
  ],
  hobbies:
    "Active interest in the convergence of real estate, blockchain and financial technology applied to cross-border markets. A firm believer in the stoic mindset and in analytical, logical thinking. Passionate about physical training as a discipline that complements intellectual work.",
  quote:
    '"Exercise should be to the body what education is to the soul" — Plato',
  footer: {
    privacyNotice:
      "I authorise the processing of my personal data under Mexico's Federal Law on the Protection of Personal Data Held by Private Parties (LFPDPPP).",
    lastUpdated: "March 2026",
  },
} satisfies ResumeData;
