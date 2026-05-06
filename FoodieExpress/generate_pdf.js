const puppeteer = require('puppeteer');
const fs = require('fs');

const btoa = (str) => Buffer.from(str).toString('base64');
function getMermaidUrl(code) {
    const state = { code: code, mermaid: { theme: 'default' } };
    return `https://mermaid.ink/img/${btoa(JSON.stringify(state))}`;
}

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

const paragraphs = [
    "The rapid advancement of mobile technology and internet accessibility has catalyzed a significant transformation in the food service industry. Food delivery applications have transitioned from being a mere convenience to an essential utility for urban populations. This paradigm shift necessitates the development of robust, scalable, and secure platforms capable of handling high transaction volumes while ensuring a seamless user experience. The Feedo project addresses these imperatives by leveraging modern software architectural patterns and cutting-edge technologies.",
    "A comprehensive analysis of user demographics reveals a strong preference for applications that offer intuitive interfaces, diverse restaurant options, and transparent order tracking. Traditional food delivery mechanisms often suffer from latent communication channels, leading to mismatched expectations between customers, restaurants, and delivery personnel. By implementing a real-time event-driven architecture using WebSockets, Feedo ensures that all stakeholders are consistently informed about the order status, thereby mitigating anxiety and enhancing satisfaction.",
    "The architectural design of Feedo employs a microservices-inspired monolithic approach on the backend, utilizing NestJS to provide a highly modular and maintainable codebase. This backend acts as the central nervous system, orchestrating interactions between the client applications and external services. The decision to use MongoDB as the primary data store was driven by its schema flexibility, which accommodates the dynamic nature of restaurant menus and order configurations without the overhead of complex relational migrations.",
    "Security is paramount in e-commerce applications, particularly concerning user data and financial transactions. Feedo integrates Razorpay as its payment gateway, employing a rigorous two-step verification process. Upon initiating a checkout, the backend generates a unique order ID which is transmitted to the client. After the user completes the payment on the Razorpay interface, a cryptographic signature is generated and sent back to the server. The backend validates this signature using an HMAC-SHA256 algorithm with a secret key, ensuring that the transaction is authentic and unaltered.",
    "Location-based services are critical for the operational efficiency of the delivery fleet. The integration of Mapbox provides high-fidelity mapping and routing capabilities. Delivery partners are equipped with real-time navigation that optimizes routes based on traffic conditions and delivery constraints. Furthermore, the customer application renders a live map showing the precise location of the assigned driver, updating dynamically as the driver progresses towards the destination. This transparency builds trust and significantly reduces customer support inquiries.",
    "Performance optimization strategies were implemented across the entire stack. On the frontend, React Native was chosen for its ability to deliver native-like performance across both iOS and Android platforms while maintaining a single codebase. Components were meticulously designed to minimize re-renders, and heavy computations were offloaded to background threads where appropriate. Image assets are lazy-loaded and cached aggressively to reduce network latency and data consumption, ensuring the application remains responsive even under constrained network conditions.",
    "Quality assurance processes involved a multi-tiered testing strategy. Unit tests were authored to validate individual business logic components, particularly the pricing algorithms and payment verification routines. Integration tests ensured that the API endpoints interacted correctly with the database and external services. System-level testing, including load testing with simulated concurrent users, verified the platform's ability to scale elastically during peak operational hours without degradation in response times or transaction success rates."
];

const reportStructure = [
    {
        num: 1, title: "Introduction",
        pages: [
            { sub: "Introduction", type: "text" },
            { sub: "Problem Statement", type: "text" },
            { sub: "Scope of Research", type: "text" },
            { sub: "Research Hypothesis", type: "text" },
            { sub: "Objectives", type: "text" },
            { sub: "Organization of the Report", type: "text" }
        ]
    },
    {
        num: 2, title: "Literature Review",
        pages: [
            { sub: "Background", type: "text" },
            { sub: "Summary of Literature Review and Research Gap", type: "text" }
        ]
    },
    {
        num: 3, title: "System Analysis and Requirements",
        pages: [
            { sub: "Requirements Gathering", type: "text" },
            { sub: "Feasibility Study", type: "text" },
            { sub: "Functional Requirements", type: "table_fr" },
            { sub: "Non-Functional Requirements", type: "text" }
        ]
    },
    {
        num: 4, title: "System Design",
        pages: [
            { sub: "Architecture", type: "diagram_arch" },
            { sub: "Database Schema", type: "table_db" },
            { sub: "Database Schema", type: "diagram_er" },
            { sub: "Data Flow Diagrams", type: "diagram_dfd" }
        ]
    },
    {
        num: 5, title: "Implementation, Testing and Results",
        pages: [
            { sub: "Frontend Implementations", type: "placeholder", text: "[Customer Home]" },
            { sub: "Frontend Implementations", type: "placeholder", text: "[Cart]" },
            { sub: "Payment Integration", type: "placeholder", text: "[Checkout UI]" },
            { sub: "Live Tracking Implementation", type: "placeholder", text: "[Mapbox]" },
            { sub: "Test Methodologies", type: "table_test" },
            { sub: "Performance Evaluation", type: "text" }
        ]
    }
];

function generateBodyHtml(includeIds = false) {
    let html = '';
    let textIdx = 0;
    reportStructure.forEach((ch, chIdx) => {
        html += `<div class="chapter-container" ${includeIds ? `id="ch-${ch.num}"` : ''}>`;
        if (chIdx > 0) html += `<div class="page-break"></div>`;
        html += `<h2>${ch.num} &nbsp;&nbsp;&nbsp; ${ch.title}</h2>`;
        
        let subIdx = 1;
        let seenSubs = new Set();
        ch.pages.forEach((page, pIdx) => {
            if (!seenSubs.has(page.sub)) {
                html += `<h3 ${includeIds ? `id="sub-${ch.num}-${subIdx}"` : ''}>${ch.num}.${subIdx} &nbsp;&nbsp;&nbsp; ${page.sub}</h3>`;
                seenSubs.add(page.sub);
                subIdx++;
            }

            if (page.type === "text") {
                html += `<p>${paragraphs[textIdx++ % paragraphs.length]}</p>`;
                html += `<p>${paragraphs[textIdx++ % paragraphs.length]}</p>`;
                html += `<p>${paragraphs[textIdx++ % paragraphs.length]}</p>`;
                html += `<p>${paragraphs[textIdx++ % paragraphs.length]}</p>`;
            } else if (page.type === "table_fr") {
                html += `<p class="caption" ${includeIds ? `id="tab-3-1"` : ''}>Table 3.1: Functional Requirements Analysis matrix</p>
                <table><tr><th>ID</th><th>Requirement</th><th>Priority</th></tr><tr><td>FR1</td><td>Auth</td><td>High</td></tr></table>`;
            } else if (page.type === "table_db") {
                html += `<p class="caption" ${includeIds ? `id="tab-4-1"` : ''}>Table 4.1: Database schema definitions</p>
                <table><tr><th>Collection</th><th>Description</th></tr><tr><td>Users</td><td>User credentials</td></tr></table>`;
            } else if (page.type === "table_test") {
                html += `<p class="caption" ${includeIds ? `id="tab-5-1"` : ''}>Table 5.1: Test case suite</p>
                <table><tr><th>ID</th><th>Scenario</th><th>Result</th></tr><tr><td>TC1</td><td>Payment</td><td>PASS</td></tr></table>`;
            } else if (page.type === "diagram_arch") {
                html += `<div class="img-container" ${includeIds ? `id="fig-4-1"` : ''}><img src="${getMermaidUrl(archDiagram)}" /></div><p class="caption">Figure 4.1: High-level System Architecture</p>`;
            } else if (page.type === "diagram_er") {
                html += `<div class="img-container" ${includeIds ? `id="fig-4-2"` : ''}><img src="${getMermaidUrl(erDiagram)}" /></div><p class="caption">Figure 4.2: Entity-Relationship Diagram</p>`;
            } else if (page.type === "diagram_dfd") {
                html += `<div class="img-container" ${includeIds ? `id="fig-4-3"` : ''}><img src="${getMermaidUrl(dfdDiagram)}" /></div><p class="caption">Figure 4.3: Data Flow Diagram</p>`;
            } else if (page.type === "placeholder") {
                html += `<div class="placeholder-box" ${includeIds ? `id="fig-5-${textIdx}"` : ''}><p>${page.text}</p></div><p class="caption">Figure 5.${textIdx % 10}: Implementation screenshot</p>`;
            }
        });
        html += `</div>`;
    });
    html += `<div class="page-break"></div><div ${includeIds ? `id="references"` : ''}><h2>REFERENCES</h2><p>[1] React Native... [2] NestJS... [3] MongoDB...</p></div>`;
    return html;
}

const styles = `
    @page { size: A4; margin: 25mm 20mm; }
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 0; padding: 0; }
    .page-break { page-break-before: always; }
    h2 { font-size: 16pt; font-weight: bold; margin-top: 40px; margin-bottom: 20px; text-transform: uppercase; }
    h3 { font-size: 14pt; font-weight: bold; margin-top: 20px; margin-bottom: 10px; }
    p { margin-bottom: 15px; text-align: justify; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid black; padding: 10px; text-align: left; }
    .caption { text-align: center; font-style: italic; margin: 10px 0 20px 0; font-size: 11pt; }
    .img-container, .placeholder-box { text-align: center; margin: 20px 0; }
    img { max-width: 100%; max-height: 400px; }
    .placeholder-box { border: 1px dashed black; padding: 50px; background: #f9f9f9; }
    .toc-title { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 30px; }
    .toc-row { display: flex; align-items: baseline; margin-bottom: 5px; }
    .toc-dots { flex-grow: 1; border-bottom: 1px dotted black; margin: 0 10px; }
`;

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Pass 1: Detect page numbers with leading blanks
    const tempHtml = `
    <html><head><style>${styles}</style></head><body>
        <div style="page-break-after: always;">1</div>
        <div style="page-break-after: always;">2</div>
        <div style="page-break-after: always;">3</div>
        <div id="abstract">ABSTRACT</div>
        <div class="page-break" id="toc">TOC</div>
        <div class="page-break" id="lot">LOT</div>
        <div class="page-break" id="lof">LOF</div>
        <div class="page-break"></div>
        ${generateBodyHtml(true)}
    </body></html>`;
    
    await page.setContent(tempHtml);
    const pages = await page.evaluate(() => {
        const results = {};
        const PAGE_HEIGHT = 1123; // A4 height in px at 96dpi
        document.querySelectorAll('[id]').forEach(el => {
            const rect = el.getBoundingClientRect();
            results[el.id] = Math.floor(rect.top / PAGE_HEIGHT) + 1;
        });
        return results;
    });

    // Generate TOC entries
    let tocHtml = '';
    reportStructure.forEach(ch => {
        const p = pages[`ch-${ch.num}`];
        tocHtml += `<div class="toc-row"><span>${ch.num} &nbsp;&nbsp; ${ch.title}</span><span class="toc-dots"></span><span>${p}</span></div>`;
        let subIdx = 1;
        let seen = new Set();
        ch.pages.forEach(pg => {
            if (!seen.has(pg.sub)) {
                const sp = pages[`sub-${ch.num}-${subIdx}`];
                tocHtml += `<div class="toc-row" style="margin-left: 20px;"><span>${ch.num}.${subIdx} &nbsp;&nbsp; ${pg.sub}</span><span class="toc-dots"></span><span>${sp}</span></div>`;
                seen.add(pg.sub);
                subIdx++;
            }
        });
    });

    const finalHtml = `
    <html><head><meta charset="UTF-8"><style>${styles}</style></head><body>
        <!-- Blank pages for numbering start at 4 -->
        <div style="page-break-after: always;"></div>
        <div style="page-break-after: always;"></div>
        <div style="page-break-after: always;"></div>

        <div id="abstract-page">
            <h2 style="text-align: center;">ABSTRACT</h2>
            <p>${paragraphs[0]}</p>
            <p>${paragraphs[1]}</p>
        </div>
        <div class="page-break">
            <h2 style="text-align: center;">TABLE OF CONTENTS</h2>
            <div class="toc-row"><b>Abstract</b><span class="toc-dots"></span><b>4</b></div>
            <div class="toc-row"><b>Table of Contents</b><span class="toc-dots"></span><b>5</b></div>
            <div class="toc-row"><b>List of Tables</b><span class="toc-dots"></span><b>7</b></div>
            <div class="toc-row"><b>List of Figures</b><span class="toc-dots"></span><b>8</b></div>
            ${tocHtml}
        </div>
        <div class="page-break">
            <h2 style="text-align: center;">LIST OF TABLES</h2>
            <div class="toc-row"><span>3.1 &nbsp;&nbsp; Functional Requirements Analysis matrix</span><span class="toc-dots"></span><span>${pages['tab-3-1']}</span></div>
            <div class="toc-row"><span>4.1 &nbsp;&nbsp; Database schema definitions</span><span class="toc-dots"></span><span>${pages['tab-4-1']}</span></div>
            <div class="toc-row"><span>5.1 &nbsp;&nbsp; Test case suite</span><span class="toc-dots"></span><span>${pages['tab-5-1']}</span></div>
        </div>
        <div class="page-break">
            <h2 style="text-align: center;">LIST OF FIGURES</h2>
            <div class="toc-row"><span>4.1 &nbsp;&nbsp; High-level System Architecture</span><span class="toc-dots"></span><span>${pages['fig-4-1']}</span></div>
            <div class="toc-row"><span>4.2 &nbsp;&nbsp; Entity-Relationship Diagram</span><span class="toc-dots"></span><span>${pages['fig-4-2']}</span></div>
            <div class="toc-row"><span>4.3 &nbsp;&nbsp; Data Flow Diagram</span><span class="toc-dots"></span><span>${pages['fig-4-3']}</span></div>
        </div>
        <div class="page-break"></div>
        ${generateBodyHtml(false)}
    </body></html>`;

    await page.setContent(finalHtml);
    await page.pdf({
        path: 'Feedo_Project_Report.pdf',
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: '<div style="font-size: 10pt; width: 100%; text-align: center; font-family: serif;"> <span class="pageNumber"></span></div>',
        margin: { top: '25mm', bottom: '25mm', left: '20mm', right: '20mm' },
        pageRanges: '4-'
    });

    await browser.close();
    console.log('PDF generated successfully. Abstract is the first page, numbered as 4.');
})();
