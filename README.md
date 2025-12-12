🚀 Career Flow
💼 A data‑driven job platform built for the CodeYourFuture community

Career Flow is a full‑stack application that centralises, organises, and surfaces job opportunities for CodeYourFuture trainees, mentors, staff.
The project is structured as a monorepo with separate backend and frontend codebases.

📖 Overview
Career Flow helps CodeYourFuture trainees discover curated roles while giving mentors and staff a simple way to manage and share opportunities.

🎯 Key goals
🎓 Reduce noise from generic job boards by focusing on roles relevant to CYF trainees

🛠️ Provide a maintainable, extensible full‑stack codebase for learning and collaboration

👥 Enable different user types (trainees, mentors, staff) to interact with the same source of truth for opportunities

✨ Features
📋 Centralised job board: Aggregated job listings stored and served by the backend and displayed via a dedicated frontend application

🔄 Deduplicated listings: The frontend includes logic to deduplicate jobs by job_id, preventing repeated postings of the same role

🏗️ Full‑stack architecture: Clear separation of concerns with Jobs-board-backend for APIs/data and Jobs-board-frontend for UI and client‑side logic

🔐 Input validation and auth‑ready: The codebase includes regex‑based login and password validation work, laying the groundwork for secure authentication flows

🤝 Collaborative workflow: Multiple contributors work via branches and pull requests, making it a realistic learning project for production‑style development

🔧 Tech Stack
Frontend 

⚛️ React	UI Framework	Component-based architecture for building interactive user interfaces with reusable components

⚡ Vite	Build Tool	Fast development server with Hot Module Replacement (HMR) for rapid development

🟨 JavaScript (ES6+)	Programming Language	Modern JavaScript features including async/await, destructuring, and arrow functions

🎨 CSS3	Styling	Responsive design and modern layout techniques (23.1% of codebase)

📄 HTML5	Markup	Semantic HTML structure (0.2% of codebase)

Backend 

🟢 Node.js	Runtime Environment	JavaScript runtime built on Chrome's V8 engine for server-side execution

🚂 Express.js	Web Framework	Minimalist web framework for building RESTful APIs and handling HTTP requests

🐘 PostgreSQL	Database	Relational database for persistent storage of job listings, user data, and application state

📦 npm	Package Manager	Dependency management and script running for both frontend and backend

Development Tools

🔀 Git/GitHub	Version control and collaboration with branching strategy for feature development

💻 VS Code	Primary IDE with extensions for JavaScript, React, and PostgreSQL

🔧 Postman	API testing and development for backend endpoints

✅ ESLint	Code quality and style enforcement

👥 Contributors

Career Flow is built and maintained by:

@RihannaP - Rihanna P

@gai93003 - Gabriel Deng

@donarbl - Donara Blanc

🤝 Contributing
Career Flow is an actively developed collaborative project with multiple contributors.
Contributions that improve functionality, UX, documentation, and test coverage are welcome!

Code of conduct
Please be respectful and collaborative; this project is part of a learning environment for CodeYourFuture developers, mentors, and staff. 💙

📫 For questions or suggestions, please open an issue or reach out to the contributors.
