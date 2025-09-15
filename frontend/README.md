# SkillRack Dashboard - Frontend

React.js frontend application for the SkillRack Dashboard project.

## 🚀 Overview

The frontend is built with React.js and styled using Tailwind CSS. It provides an interactive dashboard for tracking coding skills and progress.

## 🛠️ Tech Stack

- **React.js** (v18+) - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework for styling
- **JavaScript/JSX** - Programming language and syntax extension
- **React Hooks** - For state management and lifecycle methods

## 📁 Project Structure

```
frontend/
├── public/                   # Static files
│   ├── index.html           # HTML template
│   ├── favicon.ico          # App favicon
│   └── manifest.json        # PWA manifest
├── src/                     # Source files
│   ├── App.js              # Main App component
│   ├── App.css             # App-specific styles
│   ├── index.js            # Entry point
│   ├── index.css           # Global styles
│   └── SkillRackDashboard.jsx # Main dashboard component
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

## 🔧 Prerequisites

- **Node.js** (version 14.x or higher)
- **npm** (Node Package Manager)

## 🚀 Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install all required packages including:
   - React and React DOM
   - Tailwind CSS and related packages
   - PostCSS for CSS processing
   - Testing utilities
   - Build tools and scripts

## 🎯 Available Scripts

### Development
```bash
# Start the development server
npm start
```
- Starts the app in development mode
- Opens [http://localhost:3000](http://localhost:3000) in your browser
- Hot reloading enabled - the page will reload when you make changes

### Testing
```bash
# Launch the test runner
npm test
```
- Runs tests in interactive watch mode

### Production Build
```bash
# Build the app for production
npm run build
```
- Builds the app for production to the `build` folder
- Optimizes the build for best performance
- Files are minified and filenames include hashes

## 🎨 Styling with Tailwind CSS

This project uses Tailwind CSS for styling:

```jsx
// Example component with Tailwind classes
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
  <p className="text-sm">Welcome to your skill tracking dashboard!</p>
</div>
```

## 🧩 Key Components

- **App.js** - Root application component
- **SkillRackDashboard.jsx** - Main dashboard interface with skill tracking features

## 🔄 Development Workflow

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Make your changes**:
   - Edit components in `src/`
   - Add new components as needed
   - Update styles using Tailwind classes

3. **Test your changes**:
   ```bash
   npm test
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📱 Features

- ✅ **Interactive Dashboard** - Clean and intuitive user interface
- ✅ **Skill Management** - Track coding skills and progress
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Modern UI** - Built with Tailwind CSS

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Hosting Services
The `build` folder can be deployed to:
- **Netlify** - Drag and drop deployment
- **Vercel** - GitHub integration
- **GitHub Pages** - Static site hosting
- **AWS S3** - Cloud storage hosting

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 already in use**:
   ```bash
   # Kill process using port 3000
   npx kill-port 3000
   # Or specify different port
   PORT=3001 npm start
   ```

2. **Dependencies issues**:
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📚 Learn More

- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Create React App Documentation](https://create-react-app.dev/)

## 🤝 Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Implement responsive design with Tailwind
4. Write clean, readable code
5. Test your components

---

**Happy Coding! 🚀**