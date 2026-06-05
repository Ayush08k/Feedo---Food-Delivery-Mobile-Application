const puppeteer = require('puppeteer');
const fs = require('fs');

const btoa = (str) => Buffer.from(str).toString('base64');
function getMermaidUrl(code) {
    const state = { code: code, mermaid: { theme: 'default' } };
    return `https://mermaid.ink/img/${btoa(JSON.stringify(state))}`;
}

const paragraphs = [
    "The rapid advancement of mobile technology and internet accessibility has catalyzed a significant transformation in the food service industry. Food delivery applications have transitioned from being a mere convenience to an essential utility for urban populations. This paradigm shift necessitates the development of robust, scalable, and secure platforms capable of handling high transaction volumes while ensuring a seamless user experience. The Feedo project addresses these imperatives by leveraging modern software architectural patterns and cutting-edge technologies.",
    "A comprehensive analysis of user demographics reveals a strong preference for applications that offer intuitive interfaces, diverse restaurant options, and transparent order tracking. Traditional food delivery mechanisms often suffer from latent communication channels, leading to mismatched expectations between customers, restaurants, and delivery personnel. By implementing a real-time event-driven architecture using WebSockets, Feedo ensures that all stakeholders are consistently informed about the order status, thereby mitigating anxiety and enhancing satisfaction.",
    "The architectural design of Feedo employs a microservices-inspired monolithic approach on the backend, utilizing NestJS to provide a highly modular and maintainable codebase. This backend acts as the central nervous system, orchestrating interactions between the client applications and external services. The decision to use MongoDB as the primary data store was driven by its schema flexibility, which accommodates the dynamic nature of restaurant menus and order configurations without the overhead of complex relational migrations.",
    "Security is paramount in e-commerce applications, particularly concerning user data and financial transactions. Feedo integrates Razorpay as its payment gateway, employing a rigorous two-step verification process. Upon initiating a checkout, the backend generates a unique order ID which is transmitted to the client. After the user completes the payment on the Razorpay interface, a cryptographic signature is generated and sent back to the server. The backend validates this signature using an HMAC-SHA256 algorithm with a secret key, ensuring that the transaction is authentic and unaltered.",
    "Location-based services are critical for the operational efficiency of the delivery fleet. The integration of Mapbox provides high-fidelity mapping and routing capabilities. Delivery partners are equipped with real-time navigation that optimizes routes based on traffic conditions and delivery constraints. Furthermore, the customer application renders a live map showing the precise location of the assigned driver, updating dynamically as the driver progresses towards the destination. This transparency builds trust and significantly reduces customer support inquiries.",
    "Performance optimization strategies were implemented across the entire stack. On the frontend, React Native was chosen for its ability to deliver native-like performance across both iOS and Android platforms while maintaining a single codebase. Components were meticulously designed to minimize re-renders, and heavy computations were offloaded to background threads where appropriate. Image assets are lazy-loaded and cached aggressively to reduce network latency and data consumption, ensuring the application remains responsive even under constrained network conditions.",
    "Quality assurance processes involved a multi-tiered testing strategy. Unit tests were authored to validate individual business logic components, particularly the pricing algorithms and payment verification routines. Integration tests ensured that the API endpoints interacted correctly with the database and external services. System-level testing, including load testing with simulated concurrent users, verified the platform's ability to scale elastically during peak operational hours without degradation in response times or transaction success rates."
];

const archDiagram = `graph TD
    A[Mobile App - React Native] -->|REST API & WebSockets| B(API Gateway - NestJS)
    B --> C[Auth Module]
    B --> D[Order Module]
    B --> E[Payment Module]
    C --> F[(MongoDB)]
    D --> F
    E --> F
    E -->|API| G[Razorpay Integration]
    A -->|SDK| H[Mapbox Services]`;

const erDiagram = `erDiagram
    USER ||--o{ ORDER : places
    RESTAURANT ||--o{ ORDER : receives
    USER {
        string id PK
        string email
        string role
    }
    RESTAURANT {
        string id PK
        string name
        boolean isOpen
    }
    ORDER {
        string id PK
        string userId FK
        string restaurantId FK
        string status
    }`;

const dfdDiagram = `graph LR
    C[Customer App] -->|Place Order| S((Feedo Backend))
    S -->|Order Details| R[Restaurant Dashboard]
    S -->|Dispatch Route| D[Driver App]
    S -->|Process Transaction| P[Razorpay Gateway]`;

const reportStructure = [
    {
        num: 1, title: "INTRODUCTION",
        pages: [
            { sub: "Project Overview", type: "text" },
            { sub: "Purpose and Motivation", type: "text" },
            { sub: "Problem Statement", type: "text" },
            { sub: "Objectives and Goals", type: "text" },
            { sub: "Project Scope", type: "text" }
        ]
    },
    {
        num: 2, title: "LITERATURE SURVEY",
        pages: [
            { sub: "Evolution of Online Food Ordering", type: "text" },
            { sub: "Analysis of Current Market Leaders", type: "text" },
            { sub: "Identification of Technological Gaps", type: "text" }
        ]
    },
    {
        num: 3, title: "SYSTEM ANALYSIS",
        pages: [
            { sub: "Software Development Methodologies", type: "text" },
            { sub: "Requirement Elicitation", type: "table_fr" },
            { sub: "Feasibility Study", type: "text" }
        ]
    },
    {
        num: 4, title: "SYSTEM DESIGN",
        pages: [
            { sub: "Modular Architecture", type: "diagram_arch" },
            { sub: "Database Design (ER Model)", type: "diagram_er" },
            { sub: "Data Flow Diagrams", type: "diagram_dfd" }
        ]
    },
    {
        num: 5, title: "IMPLEMENTATION",
        pages: [
            { sub: "Backend Development with NestJS", type: "text" },
            { sub: "Mobile App Development with React Native", type: "text" },
            { sub: "Integration of Razorpay Payment Gateway", type: "text" },
            { sub: "Implementation of Mapbox for Live Tracking", type: "text" }
        ]
    }
];

const styles = `
    @page { 
        size: A4; 
        margin: 25mm 12.5mm 12.5mm 35mm; 
    }
    body { 
        font-family: 'Times New Roman', Times, serif; 
        font-size: 12pt; 
        line-height: 2.0; 
        margin: 0; 
        padding: 0;
        color: black;
    }
    .page {
        page-break-after: always;
        position: relative;
        min-height: 100%;
    }
    .cover-page {
        background-color: #800000; /* Maroon */
        color: #FFD700; /* Golden */
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 50px;
        height: 100vh;
        box-sizing: border-box;
    }
    .cover-page h1 { font-size: 28pt; margin-top: 50px; }
    .cover-page h2 { font-size: 20pt; }
    .cover-page .details { font-size: 16pt; margin-bottom: 50px; }

    .title-page {
        text-align: center;
        padding: 50px;
    }
    .chapter-title {
        font-size: 16pt;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        margin-top: 50px;
        margin-bottom: 30px;
    }
    .heading {
        font-size: 14pt;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .sub-heading {
        font-size: 12pt;
        font-weight: bold;
        margin-top: 15px;
        margin-bottom: 5px;
    }
    p {
        margin-bottom: 15px;
        text-align: justify;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 10pt;
        line-height: 1.0;
    }
    th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
    }
    .caption-table {
        text-align: center;
        font-size: 10pt;
        font-style: italic;
        margin-bottom: 5px;
    }
    .caption-figure {
        text-align: center;
        font-size: 10pt;
        font-style: italic;
        margin-top: 5px;
        margin-bottom: 20px;
    }
    .img-container {
        text-align: center;
        margin: 20px 0;
    }
    img {
        max-width: 100%;
        max-height: 400px;
    }
    .footer {
        position: fixed;
        bottom: 10mm;
        right: 10mm;
        font-size: 10pt;
    }
`;

function generateHtml() {
    let html = `<html><head><style>${styles}</style></head><body>`;

    // 1. Cover Page
    html += `
    <div class="page cover-page">
        <div>
            <h1>FEEDO</h1>
            <h2>Food Delivery Mobile Application</h2>
        </div>
        <div class="details">
            <p>Submitted by:</p>
            <p><strong>AYUSH KUMAR</strong></p>
            <p>Degree: Bachelor of Technology</p>
            <p>Session: 2023-2026</p>
            <p>College: Engineering College of Excellence</p>
        </div>
    </div>`;

    // 2. Title Page (Simple white version)
    html += `
    <div class="page title-page">
        <h1 style="margin-top: 100px;">A PROJECT REPORT ON</h1>
        <h2>FEEDO - FOOD DELIVERY MOBILE APPLICATION</h2>
        <div style="margin-top: 100px;">
            <p>Submitted in partial fulfillment of the requirements for the degree of</p>
            <p><strong>Bachelor of Technology</strong></p>
        </div>
        <div style="margin-top: 100px;">
            <p>By:</p>
            <p><strong>AYUSH KUMAR</strong></p>
        </div>
    </div>`;

    // 3. Abstract
    html += `
    <div class="page">
        <div class="chapter-title">ABSTRACT</div>
        <p>${paragraphs[0]}</p>
        <p>${paragraphs[1]}</p>
    </div>`;

    // 4. Certificate
    html += `
    <div class="page">
        <div class="chapter-title">CERTIFICATE BY SUPERVISOR</div>
        <p>This is to certify that the project report entitled "Feedo - Food Delivery Mobile Application" submitted by Ayush Kumar is a record of bona fide work carried out by him under my supervision.</p>
        <div style="margin-top: 100px; display: flex; justify-content: space-between;">
            <div>Date: __________</div>
            <div>Signature of Supervisor</div>
        </div>
    </div>`;

    // 5. Declaration
    html += `
    <div class="page">
        <div class="chapter-title">CANDIDATE'S DECLARATION</div>
        <p>I hereby declare that the work presented in this project report is my own and has been carried out under the guidance of my supervisor. I have not submitted this work elsewhere for any other degree or diploma.</p>
        <div style="margin-top: 100px; text-align: right;">
            <div>Signature of Candidate</div>
            <div><strong>AYUSH KUMAR</strong></div>
        </div>
    </div>`;

    // 6. Acknowledgement
    html += `
    <div class="page">
        <div class="chapter-title">ACKNOWLEDGEMENT</div>
        <p>I would like to express my sincere gratitude to my supervisor for their valuable guidance and support throughout the project. I also thank my college and department for providing the necessary resources.</p>
    </div>`;

    // 7. Chapters
    let textIdx = 0;
    reportStructure.forEach(ch => {
        html += `<div class="page"><div class="chapter-title">CHAPTER ${ch.num}: ${ch.title}</div>`;
        ch.pages.forEach((page, pIdx) => {
            html += `<div class="heading">${ch.num}.${pIdx + 1} ${page.sub}</div>`;
            
            if (page.type === "text") {
                html += `<p>${paragraphs[textIdx++ % paragraphs.length]}</p>`;
                html += `<p>${paragraphs[textIdx++ % paragraphs.length]}</p>`;
            } else if (page.type === "table_fr") {
                html += `<div class="caption-table">Table ${ch.num}.1: Functional Requirements Analysis</div>
                <table>
                    <tr><th>ID</th><th>Requirement</th><th>Priority</th></tr>
                    <tr><td>FR01</td><td>User Authentication</td><td>High</td></tr>
                    <tr><td>FR02</td><td>Order Management</td><td>High</td></tr>
                    <tr><td>FR03</td><td>Real-time Tracking</td><td>High</td></tr>
                </table>`;
            } else if (page.type === "diagram_arch") {
                html += `<div class="img-container"><img src="${getMermaidUrl(archDiagram)}" /></div><div class="caption-figure">Figure ${ch.num}.1: System Architecture</div>`;
            } else if (page.type === "diagram_er") {
                html += `<div class="img-container"><img src="${getMermaidUrl(erDiagram)}" /></div><div class="caption-figure">Figure ${ch.num}.1: ER Diagram</div>`;
            } else if (page.type === "diagram_dfd") {
                html += `<div class="img-container"><img src="${getMermaidUrl(dfdDiagram)}" /></div><div class="caption-figure">Figure ${ch.num}.1: Data Flow Diagram</div>`;
            }
        });
        html += `</div>`;
    });

    html += `</body></html>`;
    return html;
}

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const content = generateHtml();
    await page.setContent(content, { waitUntil: 'networkidle0' });
    
    await page.pdf({
        path: 'project check.pdf',
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: '<div style="font-size: 10pt; width: 100%; text-align: center; font-family: serif;"> <span class="pageNumber"></span></div>',
        margin: {
            top: '25mm',
            bottom: '12.5mm',
            right: '12.5mm',
            left: '35mm'
        }
    });

    await browser.close();
    console.log('PDF generated successfully: project check.pdf');
})();
