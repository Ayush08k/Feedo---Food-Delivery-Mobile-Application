const pptxgen = require('pptxgenjs');

async function buildPPT() {
  let pptx = new pptxgen();
  pptx.layout = 'LAYOUT_4x3'; // using 4:3 as it matches the standard academic presentation slide ratio shown in images

  // Define Master Slide
  pptx.defineSlideMaster({
    title: 'MASTER_SLIDE',
    background: { color: 'FFFFFF' },
    objects: [
      { image: { path: 'logo.png', x: 0.3, y: 0.2, w: 0.8, h: 0.8 } },
      {
        text: {
          text: 'Department of Engineering & Technology\nGurugram University, Gurugram',
          options: { x: 3.5, y: 0.3, w: 6.0, h: 0.6, align: 'right', fontFace: 'Times New Roman', fontSize: 14 }
        }
      },
      // Footer Name
      {
        text: {
          text: 'Ayush kumar, Deepshikha verma',
          options: { x: 3.0, y: 6.9, w: 4.0, h: 0.4, align: 'center', fontFace: 'Times New Roman', fontSize: 10, color: '7F7F7F' }
        }
      }
    ],
    slideNumber: { x: 9.0, y: 6.9, fontFace: 'Times New Roman', fontSize: 10, color: '7F7F7F' }
  });

  // Slide 1: Title
  let slide1 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  slide1.addText('Synopsis\non\n[PROJECT/DISSERTATION TITLE]', {
    x: 1.0, y: 2.2, w: 8.0, h: 1.5, align: 'center', fontFace: 'Times New Roman', fontSize: 32, bold: false
  });
  slide1.addText('Student Name\nUniversity Roll No.\nBachelor of Technology\nComputer Science & Engineering [Specialization]', {
    x: 4.5, y: 5.0, w: 5.0, h: 1.2, align: 'right', fontFace: 'Times New Roman', fontSize: 12
  });

  // Slide 2: Table of Contents
  let slide2 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  slide2.addText('Table of Contents', {
    x: 1.0, y: 1.5, w: 8.0, h: 0.8, align: 'center', fontFace: 'Times New Roman', fontSize: 28, bold: false
  });
  const tocItems = [
    'Introduction',
    'Problem Statement',
    'Project Objectives',
    'Proposed Methodology',
    'Tools and Technologies',
    'Expected Outcome',
    'Future Scope',
    'References'
  ];
  slide2.addText(tocItems.map(item => ({ text: item })), {
    x: 1.0, y: 2.5, w: 8.0, h: 4.0, align: 'left', fontFace: 'Times New Roman', fontSize: 18, bullet: true, lineSpacing: 24, margin: [0, 0, 10, 0]
  });

  // Helper method for content slides
  const addContentSlide = (title, contentObjArr) => {
    let slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    slide.addText(title, {
       x: 0.5, y: 1.5, w: 9.0, h: 0.6, align: 'left', fontFace: 'Times New Roman', fontSize: 24, bold: true 
    });
    slide.addText(contentObjArr, {
       x: 0.5, y: 2.3, w: 9.0, h: 4.5, align: 'left', fontFace: 'Times New Roman', fontSize: 16, valign: 'top'
    });
  };

  // Content from synopsis.md
  addContentSlide('1. INTRODUCTION', [
    { text: 'The convenience of ordering food online has fundamentally transformed consumer expectations over the past decade.', options: { bullet: true, breakLine: true } },
    { text: 'Feedo is formulated as a robust, real-time food delivery application.', options: { bullet: true, breakLine: true } },
    { text: 'Acts as the central communication and transaction hub among customers, restaurants, and delivery personnel.', options: { bullet: true, breakLine: true } },
    { text: 'Integrates complex geographical real-time mapping, asynchronous event-driven state updates, and secure financial processing architectures.', options: { bullet: true, breakLine: true } },
    { text: 'Leverages modern web frameworks (NestJS, React Native) to deploy a highly concurrent and robust server infrastructure.', options: { bullet: true } }
  ]);

  addContentSlide('2. PROBLEM STATEMENT', [
    { text: 'Information Latency and State Desynchronization', options: { bullet: true, bold: true } },
    { text: 'Delayed updates on meal prep and driver proximities lead to unpredictable delivery windows.', options: { indentLevel: 1, breakLine: true } },
    { text: 'Segmented and Opaque Communication', options: { bullet: true, bold: true } },
    { text: 'Missing centralized, automated notifications forcing extreme reliance on manual support.', options: { indentLevel: 1, breakLine: true } },
    { text: 'Cumbersome Vendor Management Overhead', options: { bullet: true, bold: true } },
    { text: 'Complex admin portals limit vendor flexibility to toggle operation status.', options: { indentLevel: 1, breakLine: true } },
    { text: 'Scalability and Concurrency Bottlenecks', options: { bullet: true, bold: true } },
    { text: 'Tracking dozens of active drivers rapidly exhausts computing resources.', options: { indentLevel: 1 } }
  ]);

  addContentSlide('3. PROJECT OBJECTIVES', [
    { text: 'Develop a Multi-Faceted Mobile Ecosystem.', options: { bullet: true, breakLine: true } },
    { text: 'Implement High-Performance Real-Time Synchronization via WebSockets.', options: { bullet: true, breakLine: true } },
    { text: 'Construct a Scalable, Fault-Tolerant Node.js/NestJS Backend.', options: { bullet: true, breakLine: true } },
    { text: 'Enforce Rigorous Security Protocols (JWT, Bcrypt, MongoDB spatial indexing).', options: { bullet: true, breakLine: true } },
    { text: 'Optimize End-User Experience with dynamic filtration, custom settings, and predictive delivery analytics.', options: { bullet: true } }
  ]);

  addContentSlide('4. PROPOSED METHODOLOGY', [
    { text: 'Strict adherence to Agile Software Development Methodology.', options: { bullet: true } },
    { text: 'Iterative module delivery and rapid prototyping.', options: { indentLevel: 1, breakLine: true } },
    { text: 'N-Tier Client-Server Architecture (Presentation, API, DB).', options: { bullet: true, breakLine: true } },
    { text: 'Event-Driven WebSocket Micro-Architecture.', options: { bullet: true } },
    { text: 'Circumvents traditional REST architecture for high-velocity real-time data.', options: { indentLevel: 1, breakLine: true } },
    { text: 'Service-Oriented Design Principles (SOLID) within NestJS framework.', options: { bullet: true, breakLine: true } },
    { text: 'Unstructured NoSQL strategy with fluid MongoDB collections.', options: { bullet: true } }
  ]);

  // 5. TOOLS AND TECHNOLOGY - Table format
  let slideTech = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  slideTech.addText('5. TOOLS AND TECHNOLOGY', {
     x: 0.5, y: 1.5, w: 9.0, h: 0.6, align: 'left', fontFace: 'Times New Roman', fontSize: 24, bold: true 
  });
  
  const techTableRows = [
    [
      { text: 'Layer / Category', options: { bold: true, fill: 'EFEFEF', fontFace: 'Times New Roman' } },
      { text: 'Technologies & Tools', options: { bold: true, fill: 'EFEFEF', fontFace: 'Times New Roman' } }
    ],
    [ 'Frontend / Mobile Applications', 'React Native, TypeScript, Advanced React Hooks' ],
    [ 'Backend / Server', 'Node.js, NestJS, Socket.io, Passport-JWT' ],
    [ 'Database', 'MongoDB (Mongoose ODM)' ],
    [ 'Cloud Infrastructure', 'MongoDB Atlas, GeoJSON Spatial Querying' ]
  ];
  
  slideTech.addTable(techTableRows, {
    x: 0.5, y: 2.5, w: 9.0,
    colW: [3.5, 5.5],
    border: { type: 'solid', color: 'BFBFBF', pt: 1 },
    fontFace: 'Times New Roman',
    fontSize: 16,
    valign: 'middle',
    align: 'left',
    margin: [0.1, 0.1, 0.1, 0.1],
    rowH: [0.6, 0.8, 0.8, 0.6, 0.6]
  });

  addContentSlide('6. EXPECTED OUTCOME', [
    { text: 'A robust, highly reliable three-part mobile ecosystem (Customer, Restaurant, Delivery).', options: { bullet: true, breakLine: true } },
    { text: 'Frictionless discovery and ordering pipeline for customers with pinpoint mapping.', options: { bullet: true, breakLine: true } },
    { text: 'Significantly reduced administrative overhead via intuitive vendor status toggling.', options: { bullet: true, breakLine: true } },
    { text: 'Pinpoint accurate dispatcher routing for drivers to minimize travel latency.', options: { bullet: true, breakLine: true } },
    { text: 'A scalable application demonstrating modern event-driven framework capabilities under heavy loads.', options: { bullet: true } }
  ]);

  addContentSlide('7. FUTURE SCOPE', [
    { text: 'Integration with predictive AI for order trend analytics and supply planning.', options: { bullet: true, breakLine: true } },
    { text: 'Drone/autonomous vehicle delivery logistics API hooks integration.', options: { bullet: true, breakLine: true } },
    { text: 'Global expansion involving multilingual capability and multi-currency structures.', options: { bullet: true, breakLine: true } },
    { text: 'Migration to full decentralized container orchestration using Docker and Kubernetes.', options: { bullet: true } }
  ]);

  addContentSlide('8. REFERENCES', [
    { text: 'K. Kamil, NestJS: A Progressive Node.js Framework. 1st ed. Packt Publishing, 2021.', options: { bullet: true, breakLine: true } },
    { text: 'A. Holmes, "Getting Started with React Native," Journal of Mobile Eng., Mar 2023.', options: { bullet: true, breakLine: true } },
    { text: 'M. Fowler and J. Lewis. (2014) Microservices. Available: martinfowler.com.', options: { bullet: true, breakLine: true } },
    { text: 'S. Chodorow, MongoDB: The Definitive Guide. O\'Reilly Media, 2019.', options: { bullet: true, breakLine: true } },
    { text: 'R. Richards, "Real-Time WebSocket Architectures," IEEE Transactions on Software Eng., 2024.', options: { bullet: true } }
  ]);

  const outputName = 'Synopsis_Presentation_v2.pptx';
  await pptx.writeFile({ fileName: outputName });
  console.log('Successfully generated ' + outputName);
}

buildPPT().catch(console.error);
