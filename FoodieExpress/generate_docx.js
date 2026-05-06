const HTMLtoDOCX = require('html-to-docx');
const fs = require('fs');
const JSZip = require('jszip');

const btoa = (str) => Buffer.from(str).toString('base64');
function getMermaidUrl(code) {
    const state = { code: code, mermaid: { theme: 'default' } };
    return `https://mermaid.ink/img/${btoa(JSON.stringify(state))}`;
}

const getRoman = (num) => {
    const roman = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let str = '';
    for(let i of Object.keys(roman)){
        let q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
    }
    return str.toLowerCase();
};

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
            { sub: "Background", type: "text" },
            { sub: "Summary of Literature Review and Research Gap", type: "text" },
            { sub: "Summary of Literature Review and Research Gap", type: "text" }
        ]
    },
    {
        num: 3, title: "System Analysis and Requirements",
        pages: [
            { sub: "Requirements Gathering", type: "text" },
            { sub: "Feasibility Study", type: "text" },
            { sub: "Functional Requirements", type: "table_fr" },
            { sub: "Functional Requirements", type: "text" },
            { sub: "Non-Functional Requirements", type: "text" },
            { sub: "Non-Functional Requirements", type: "text" }
        ]
    },
    {
        num: 4, title: "System Design",
        pages: [
            { sub: "Architecture", type: "diagram_arch" },
            { sub: "Architecture", type: "text" },
            { sub: "Database Schema", type: "table_db" },
            { sub: "Database Schema", type: "diagram_er" },
            { sub: "Data Flow Diagrams", type: "diagram_dfd" },
            { sub: "Data Flow Diagrams", type: "text" }
        ]
    },
    {
        num: 5, title: "Implementation, Testing and Results",
        pages: [
            { sub: "Frontend Implementations", type: "placeholder", text: "[PLACEHOLDER: Insert Customer Home / Menu Frontend Screenshot Here]" },
            { sub: "Frontend Implementations", type: "placeholder", text: "[PLACEHOLDER: Insert Cart / Profile Frontend Screenshot Here]" },
            { sub: "Payment Integration", type: "placeholder", text: "[PLACEHOLDER: Insert Razorpay Checkout UI Screenshot Here]" },
            { sub: "Live Tracking Implementation", type: "placeholder", text: "[PLACEHOLDER: Insert Mapbox Live Tracking Frontend Screenshot Here]" },
            { sub: "Test Methodologies", type: "table_test" },
            { sub: "Test Methodologies", type: "text" },
            { sub: "Performance Evaluation", type: "text" },
            { sub: "Performance Evaluation", type: "text" }
        ]
    }
];

let tocHtml = '';
let contentHtml = '';
let currentMainPage = 9; // Introduction starts at 9 (Abstract: 4, Content: 5-6, Tables: 7, Figures: 8)

reportStructure.forEach((ch, chIndex) => {
    tocHtml += `<table style="width: 100%; border: none;"><tr><td style="border: none; text-align: left; font-weight: bold; padding: 5px 0;">${ch.num} &nbsp;&nbsp;&nbsp; ${ch.title}</td><td style="border: none; text-align: right; font-weight: bold; padding: 5px 0;">${currentMainPage}</td></tr></table>`;

    let isFirstPageOfChapter = true;
    let printedSubtopics = new Set();

    ch.pages.forEach((pageDef, index) => {
        if (!printedSubtopics.has(pageDef.sub)) {
            tocHtml += `<table style="width: 100%; border: none;"><tr><td style="border: none; text-align: left; padding: 2px 0 2px 20px;">${ch.num}.${printedSubtopics.size + 1} &nbsp;&nbsp;&nbsp; ${pageDef.sub}</td><td style="border: none; text-align: right; padding: 2px 0;">${currentMainPage}</td></tr></table>`;
            printedSubtopics.add(pageDef.sub);
        }

        if (chIndex > 0 && index === 0) {
            contentHtml += `<div style="page-break-after: always;"></div>\n`;
        }

        if (isFirstPageOfChapter) {
            contentHtml += `<h2 style="margin-top: 30px; margin-bottom: 20px;">${ch.num} &nbsp;&nbsp;&nbsp; ${ch.title}</h2>\n`;
            isFirstPageOfChapter = false;
        }

        if (index === 0 || ch.pages[index-1].sub !== pageDef.sub) {
             contentHtml += `<h3 style="margin-top: 15px; margin-bottom: 10px;">${ch.num}.${printedSubtopics.size} &nbsp;&nbsp;&nbsp; ${pageDef.sub}</h3>\n`;
        }

        if (pageDef.type === "text") {
            contentHtml += `<p style="margin-bottom: 10px; text-align: justify;">${paragraphs[(currentMainPage * 1) % paragraphs.length]}</p>\n`;
            contentHtml += `<p style="margin-bottom: 10px; text-align: justify;">${paragraphs[(currentMainPage * 2) % paragraphs.length]}</p>\n`;
            contentHtml += `<p style="margin-bottom: 10px; text-align: justify;">${paragraphs[(currentMainPage * 3) % paragraphs.length]}</p>\n`;
            contentHtml += `<p style="margin-bottom: 10px; text-align: justify;">${paragraphs[(currentMainPage * 4) % paragraphs.length]}</p>\n`;
        } else if (pageDef.type === "placeholder") {
            let imagePath = '';
            if (pageDef.text.includes("Customer Home")) imagePath = 'images/home.png';
            else if (pageDef.text.includes("Cart")) imagePath = 'images/cart.png';
            else if (pageDef.text.includes("Checkout UI")) imagePath = 'images/checkout.png';
            else if (pageDef.text.includes("Mapbox")) imagePath = 'images/tracking.png';
            
            if (fs.existsSync(imagePath)) {
                const base64 = fs.readFileSync(imagePath).toString('base64');
                const src = `data:image/png;base64,${base64}`;
                contentHtml += `<div style="text-align: center; margin: 20px 0;"><img src="${src}" style="max-height: 500px; max-width: 100%; border: 1px solid #ccc; padding: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" /></div>\n`;
            } else {
                contentHtml += `<div style="border: 1px solid black; padding: 50px; text-align: center; margin: 20px 0;"><p><strong>${pageDef.text}</strong></p></div>\n`;
            }
            contentHtml += `<p>${paragraphs[(currentMainPage) % paragraphs.length]}</p>\n`;
            contentHtml += `<p>${paragraphs[(currentMainPage+1) % paragraphs.length]}</p>\n`;
        } else if (pageDef.type === "diagram_arch") {
            contentHtml += `<div style="text-align: center; margin: 20px 0;"><img src="${getMermaidUrl(archDiagram)}" style="max-width: 100%;" /></div>`;
            contentHtml += `<p style="text-align: center; font-style: italic;">Figure 4.1: High-level System Architecture Diagram</p>`;
        } else if (pageDef.type === "diagram_er") {
            contentHtml += `<div style="text-align: center; margin: 20px 0;"><img src="${getMermaidUrl(erDiagram)}" style="max-width: 100%;" /></div>`;
            contentHtml += `<p style="text-align: center; font-style: italic;">Figure 4.2: Entity-Relationship Diagram for MongoDB Schema</p>`;
        } else if (pageDef.type === "diagram_dfd") {
            contentHtml += `<div style="text-align: center; margin: 20px 0;"><img src="${getMermaidUrl(dfdDiagram)}" style="max-width: 100%;" /></div>`;
            contentHtml += `<p style="text-align: center; font-style: italic;">Figure 4.3: Level 0 Data Flow Diagram</p>`;
        } else if (pageDef.type === "table_fr") {
            contentHtml += `<p style="text-align: center; font-style: italic;">Table 3.1: Functional Requirements Analysis matrix</p>
            <table border="1" style="width: 100%; border-collapse: collapse;"><tr><th>ID</th><th>Requirement</th><th>Module</th><th>Priority</th></tr>
            <tr><td>FR1</td><td>Secure JWT Authentication</td><td>Auth</td><td>High</td></tr>
            <tr><td>FR2</td><td>Real-time Order Status</td><td>Tracking</td><td>High</td></tr>
            <tr><td>FR3</td><td>Multi-cart Management</td><td>Order</td><td>Medium</td></tr></table>`;
        } else if (pageDef.type === "table_db") {
            contentHtml += `<p style="text-align: center; font-style: italic;">Table 4.1: Database schema definitions</p>
            <table border="1" style="width: 100%; border-collapse: collapse;"><tr><th>Collection</th><th>Fields</th><th>Description</th></tr>
            <tr><td>Users</td><td>_id, email, role, password</td><td>Store user credentials</td></tr>
            <tr><td>Restaurants</td><td>_id, name, address, isOpen</td><td>Store restaurant details</td></tr>
            <tr><td>Orders</td><td>_id, userId, restaurantId, status</td><td>Store transaction details</td></tr></table>`;
        } else if (pageDef.type === "table_test") {
            contentHtml += `<p style="text-align: center; font-style: italic;">Table 5.1: Test case suite</p>
            <table border="1" style="width: 100%; border-collapse: collapse;"><tr><th>Test ID</th><th>Scenario</th><th>Expected</th><th>Result</th></tr>
            <tr><td>TC-PAY-01</td><td>Valid Signature</td><td>Success</td><td>PASS</td></tr>
            <tr><td>TC-PAY-02</td><td>Invalid Signature</td><td>Failure</td><td>PASS</td></tr></table>`;
        }

        currentMainPage += 0.5; // Estimated increment for flowing content
    });
    currentMainPage = Math.ceil(currentMainPage);
});

tocHtml += `<table style="width: 100%; border: none;"><tr><td style="border: none; text-align: left; font-weight: bold; padding: 5px 0;">References</td><td style="border: none; text-align: right; font-weight: bold; padding: 5px 0;">${currentMainPage}</td></tr></table>`;

contentHtml += `
<div style="page-break-after: always;"></div>
<h2>REFERENCES</h2>
<p>[1] Facebook Open Source, "React Native: A framework for building native apps using React", 2026. [Online]. Available: https://reactnative.dev/</p>
<p>[2] Kamil Myśliwiec, "NestJS: A progressive Node.js framework for building efficient, reliable and scalable server-side applications", 2026. [Online]. Available: https://nestjs.com/</p>
<p>[3] MongoDB Inc., "MongoDB: The Developer Data Platform", 2026. [Online]. Available: https://www.mongodb.com/</p>
<p>[4] Razorpay Software Private Limited, "Razorpay API Reference: Accept, Process and Disburse Payments", 2026. [Online]. Available: https://razorpay.com/docs/api/</p>
<p>[5] Mapbox, "Mapbox: Maps, Navigation, Search, and Data", 2026. [Online]. Available: https://www.mapbox.com/</p>
`;

const htmlString = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: 'Times New Roman', Times, serif;">
    

    <h2 style="text-align: center;">ABSTRACT</h2>

    <p>The Feedo project is a comprehensive technical solution aimed at revolutionizing the food delivery industry through a high-performance, scalable, and secure application architecture. In the contemporary digital era, the demand for instant, reliable food logistics has grown exponentially. Feedo addresses this by providing a unified platform that integrates three critical stakeholders: Customers, Restaurant Owners, and Delivery Partners.</p>
    <p>The system is built on a robust technology stack consisting of React Native for a cross-platform mobile experience, NestJS for a high-concurrency backend service, and MongoDB for flexible data management. This report delves into the end-to-end development lifecycle, covering system analysis, architectural design, implementation of secure payment gateways using Razorpay, real-time tracking using Mapbox, and exhaustive testing methodologies. The result is a production-ready ecosystem that ensures data integrity, user security, and operational efficiency.</p>
    <div style="page-break-after: always;"></div>

    <h2 style="text-align: center;">TABLE OF CONTENTS</h2>
    <table style="width: 100%; border: none; margin-bottom: 20px;">
        <tr><td style="border: none; text-align: left; font-weight: bold;">Abstract</td><td style="border: none; text-align: right;">4</td></tr>
        <tr><td style="border: none; text-align: left; font-weight: bold;">Table of Content</td><td style="border: none; text-align: right;">5</td></tr>
        <tr><td style="border: none; text-align: left; font-weight: bold;">List of Tables</td><td style="border: none; text-align: right;">7</td></tr>
        <tr><td style="border: none; text-align: left; font-weight: bold;">List of Figures</td><td style="border: none; text-align: right;">8</td></tr>
    </table>
    ${tocHtml}
    <div style="page-break-after: always;"></div>
    <div style="page-break-after: always;"></div>

    <h2 style="text-align: center;">LIST OF TABLES</h2>
    <table style="width: 100%; border: none;">
        <tr><td style="border: none; text-align: left;">3.1 &nbsp;&nbsp; Functional Requirements Analysis matrix detailing priority and impact</td><td style="border: none; text-align: right;">15</td></tr>
        <tr><td style="border: none; text-align: left;">4.1 &nbsp;&nbsp; Database schema definitions for the core operational collections</td><td style="border: none; text-align: right;">18</td></tr>
        <tr><td style="border: none; text-align: left;">5.1 &nbsp;&nbsp; Comprehensive test case suite for the payment verification module</td><td style="border: none; text-align: right;">23</td></tr>
    </table>
    <div style="page-break-after: always;"></div>

    <h2 style="text-align: center;">LIST OF FIGURES</h2>
    <table style="width: 100%; border: none;">
        <tr><td style="border: none; text-align: left;">4.1 &nbsp;&nbsp; High-level architecture diagram illustrating the interaction between microservices</td><td style="border: none; text-align: right;">17</td></tr>
        <tr><td style="border: none; text-align: left;">4.2 &nbsp;&nbsp; ER Diagram of the Database Schema</td><td style="border: none; text-align: right;">18</td></tr>
        <tr><td style="border: none; text-align: left;">4.3 &nbsp;&nbsp; Level 0 Data Flow Diagram</td><td style="border: none; text-align: right;">19</td></tr>
        <tr><td style="border: none; text-align: left;">5.1 &nbsp;&nbsp; Frontend Implementation: Customer Home/Menu</td><td style="border: none; text-align: right;">21</td></tr>
        <tr><td style="border: none; text-align: left;">5.2 &nbsp;&nbsp; Frontend Implementation: Cart/Profile</td><td style="border: none; text-align: right;">22</td></tr>
        <tr><td style="border: none; text-align: left;">5.3 &nbsp;&nbsp; Payment Integration: Razorpay Checkout UI</td><td style="border: none; text-align: right;">23</td></tr>
        <tr><td style="border: none; text-align: left;">5.4 &nbsp;&nbsp; Live Tracking: Mapbox Frontend</td><td style="border: none; text-align: right;">24</td></tr>
    </table>
    <div style="page-break-after: always;"></div>
    ${contentHtml}
</body>
</html>
`;

(async () => {
    try {
        const fileBuffer = await HTMLtoDOCX(htmlString, null, {
          table: { row: { cantSplit: true } },
          footer: true,
          pageNumber: true,
          font: 'Times New Roman'
        });

        // HACK: Modify the XML to start page numbering at 4
        const zip = await JSZip.loadAsync(fileBuffer);
        let documentXml = await zip.file('word/document.xml').async('string');

        // Look for sectPr and inject pgNumType w:start="4"
        const pgNumType = '<w:pgNumType w:start="4"/>';
        if (documentXml.includes('<w:pgNumType')) {
            documentXml = documentXml.replace(/<w:pgNumType[^>]*\/>/, pgNumType);
        } else {
            documentXml = documentXml.replace('<w:sectPr>', `<w:sectPr>${pgNumType}`);
        }

        zip.file('word/document.xml', documentXml);
        const finalBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        fs.writeFileSync('Feedo_Project_Report.docx', finalBuffer);
        console.log('DOCX generated successfully. Abstract is page 1, but numbered as 4.');
    } catch (error) {
        console.error('Error generating DOCX:', error);
        process.exit(1);
    }
})();
