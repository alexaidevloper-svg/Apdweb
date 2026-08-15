import { Project } from '../types';

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'my-website',
    name: 'My Website',
    icon: '🌐',
    template: 'Base Template',
    createdAt: '2026-08-15 12:34:39',
    lastModified: '2026-08-15 16:48:58',
    settings: {
      titleBarBgColor: '#0d9488',
      screenRotation: 'Follow System',
      homepage: 'index.html',
      phpEnvironment: 'PHP 8.2.10',
      carryPhpEnvironment: 'Include',
      phpServerPort: 8000,
      splashPage: 'splash.html',
      moreOptions: {
        fullscreenMode: false,
        hideTitleBar: false,
        allowLongPress: true,
        showLoadingUI: true,
        allowZoom: true,
        pcMode: false,
        allowMediaAutoplay: true,
        allowSwipingToRefresh: true,
        allowUsingCamera: true,
        allowUsingMicrophone: true,
      },
    },
    files: [
      {
        id: 'file-index-html',
        name: 'index.html',
        type: 'html',
        path: 'index.html',
        size: 1420,
        lastModified: '2026-08-15 16:49:58',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website - Apd Web</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <header class="hero">
      <div class="badge">Apd Web Powered</div>
      <h1>Hello World!</h1>
      <p>Welcome to <strong>Apd Web</strong> mobile web development environment.</p>
    </header>

    <main class="card-grid">
      <section class="card">
        <h3>⚡ Interactive Counter</h3>
        <p>Test real JavaScript DOM execution inside the Android WebView.</p>
        <div class="counter-box">
          <button id="dec-btn" class="btn btn-outline">-</button>
          <span id="counter-val">0</span>
          <button id="inc-btn" class="btn btn-primary">+</button>
        </div>
      </section>

      <section class="card">
        <h3>🔍 Console Logger</h3>
        <p>Log messages directly to Apd Web's built-in Developer Console.</p>
        <div class="btn-group">
          <button onclick="logInfo()" class="btn btn-sm btn-info">Log Info</button>
          <button onclick="logWarning()" class="btn btn-sm btn-warn">Log Warn</button>
          <button onclick="logError()" class="btn btn-sm btn-danger">Log Error</button>
        </div>
      </section>

      <section class="card">
        <h3>🐘 PHP & Dynamic Backend</h3>
        <p>Preview backend dynamic variables served via Apd Web server.</p>
        <div class="code-preview">
          <code>PHP Status: Online (Port 8000)</code>
          <p id="server-time">Timestamp: Loading...</p>
        </div>
      </section>
    </main>

    <footer>
      <p>Apd Web &copy; 2026. Built directly on mobile device.</p>
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: 'file-style-css',
        name: 'style.css',
        type: 'css',
        path: 'style.css',
        size: 980,
        lastModified: '2026-08-15 16:48:58',
        content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: #f1f5f9;
  color: #1e293b;
  padding: 16px;
  line-height: 1.5;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

.hero {
  background: linear-gradient(135deg, #0d9488, #0f766e);
  color: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2);
}

.badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.hero h1 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 6px;
}

.card-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 18px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.card h3 {
  font-size: 17px;
  color: #0f172a;
  margin-bottom: 6px;
}

.card p {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
}

.counter-box {
  display: flex;
  align-items: center;
  gap: 16px;
}

#counter-val {
  font-size: 24px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 14px;
  transition: opacity 0.15s;
}

.btn:active {
  opacity: 0.8;
}

.btn-primary { background: #0d9488; color: white; }
.btn-outline { background: #e2e8f0; color: #334155; }
.btn-info { background: #0284c7; color: white; }
.btn-warn { background: #f59e0b; color: white; }
.btn-danger { background: #ef4444; color: white; }
.btn-group { display: flex; gap: 8px; flex-wrap: wrap; }

.code-preview {
  background: #0f172a;
  color: #38bdf8;
  padding: 12px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 13px;
}

footer {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 24px;
  padding: 12px;
}`,
      },
      {
        id: 'file-script-js',
        name: 'script.js',
        type: 'js',
        path: 'script.js',
        size: 820,
        lastModified: '2026-08-15 15:54:58',
        content: `// Apd Web Client Script
let count = 0;
const counterDisplay = document.getElementById('counter-val');
const incBtn = document.getElementById('inc-btn');
const decBtn = document.getElementById('dec-btn');

if (incBtn && decBtn) {
  incBtn.addEventListener('click', () => {
    count++;
    counterDisplay.innerText = count;
    console.log('[ApdWeb Log] Counter incremented to: ' + count);
  });

  decBtn.addEventListener('click', () => {
    count--;
    counterDisplay.innerText = count;
    console.log('[ApdWeb Log] Counter decremented to: ' + count);
  });
}

function logInfo() {
  console.info('Apd Web application state verified successfully.');
}

function logWarning() {
  console.warn('Network latency detected on port 8000.');
}

function logError() {
  console.error('Simulated runtime exception for Developer Console debug.');
}

// Set simulated server timestamp
const serverTimeEl = document.getElementById('server-time');
if (serverTimeEl) {
  serverTimeEl.innerText = 'Timestamp: ' + new Date().toLocaleTimeString();
}

console.log('My Website loaded successfully on Apd Web WebView.');
`,
      },
      {
        id: 'file-config-php',
        name: 'config.php',
        type: 'php',
        path: 'config.php',
        size: 450,
        lastModified: '2026-08-15 15:49:58',
        content: `<?php
/**
 * Apd Web PHP Server Configuration
 * Environment: PHP 8.2.10
 */

$app_name = "My Website";
$server_port = 8000;
$status = "Ready";

echo "<h1>Apd Web PHP Server</h1>";
echo "<p>Running $app_name on port $server_port with PHP " . phpversion() . "</p>";
?>`,
      },
      {
        id: 'file-image-png',
        name: 'image.png',
        type: 'png',
        path: 'image.png',
        size: 3200,
        lastModified: '2026-08-15 15:54:58',
        content: 'https://i.ibb.co/wFb1mkxT/file-0000000066a882118c17060a71e8c306.png',
      },
      {
        id: 'file-splash-html',
        name: 'splash.html',
        type: 'html',
        path: 'splash.html',
        size: 400,
        lastModified: '2026-08-15 14:20:00',
        content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin:0; background:#0d9488; display:flex; justify-content:center; align-items:center; height:100vh; color:white; font-family:sans-serif; }
    .loader { text-align:center; }
  </style>
</head>
<body>
  <div class="loader">
    <h2>Apd Web</h2>
    <p>Starting Application...</p>
  </div>
</body>
</html>`,
      },
    ],
  },
  {
    id: 'plazaallhub',
    name: 'Plazaallhub',
    icon: '🛒',
    template: 'Base Template',
    createdAt: '2026-06-16 12:34:59',
    lastModified: '2026-07-20 14:15:22',
    settings: {
      titleBarBgColor: '#0284c7',
      screenRotation: 'Follow System',
      homepage: 'index.html',
      phpEnvironment: 'PHP 8.2.10',
      carryPhpEnvironment: 'Include',
      phpServerPort: 8000,
      splashPage: 'splash.html',
      moreOptions: {
        fullscreenMode: false,
        hideTitleBar: false,
        allowLongPress: true,
        showLoadingUI: true,
        allowZoom: true,
        pcMode: false,
        allowMediaAutoplay: true,
        allowSwipingToRefresh: true,
        allowUsingCamera: false,
        allowUsingMicrophone: false,
      },
    },
    files: [
      {
        id: 'p-index',
        name: 'index.html',
        type: 'html',
        path: 'index.html',
        size: 890,
        lastModified: '2026-06-16 12:34:59',
        content: `<!DOCTYPE html>
<html>
<head><title>Plazaallhub Store</title></head>
<body style="font-family:sans-serif; padding:20px; text-align:center;">
  <h2>🛒 Plazaallhub Mobile Store</h2>
  <p>Local marketplace starter app configured for Android APK compilation.</p>
</body>
</html>`,
      },
    ],
  },
  {
    id: 'eom19',
    name: 'eom19',
    icon: '🚀',
    template: 'Base Template',
    createdAt: '2026-07-13 12:16:16',
    lastModified: '2026-07-13 12:16:16',
    settings: {
      titleBarBgColor: '#6366f1',
      screenRotation: 'Follow System',
      homepage: 'index.html',
      phpEnvironment: 'PHP 8.2.10',
      carryPhpEnvironment: 'Include',
      phpServerPort: 8000,
      splashPage: 'splash.html',
      moreOptions: {
        fullscreenMode: false,
        hideTitleBar: false,
        allowLongPress: true,
        showLoadingUI: true,
        allowZoom: true,
        pcMode: false,
        allowMediaAutoplay: true,
        allowSwipingToRefresh: true,
        allowUsingCamera: false,
        allowUsingMicrophone: false,
      },
    },
    files: [
      {
        id: 'e-index',
        name: 'index.html',
        type: 'html',
        path: 'index.html',
        size: 510,
        lastModified: '2026-07-13 12:16:16',
        content: `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:20px;"><h1>EOM 19 Dashboard</h1></body></html>`,
      },
    ],
  },
  {
    id: 'nep-nost',
    name: 'Nep Nost',
    icon: '📱',
    template: 'Base Template',
    createdAt: '2026-07-19 13:32:72',
    lastModified: '2026-07-19 13:32:72',
    settings: {
      titleBarBgColor: '#0f766e',
      screenRotation: 'Follow System',
      homepage: 'index.html',
      phpEnvironment: 'PHP 8.2.10',
      carryPhpEnvironment: 'Include',
      phpServerPort: 8000,
      splashPage: 'splash.html',
      moreOptions: {
        fullscreenMode: false,
        hideTitleBar: false,
        allowLongPress: true,
        showLoadingUI: true,
        allowZoom: true,
        pcMode: false,
        allowMediaAutoplay: true,
        allowSwipingToRefresh: true,
        allowUsingCamera: true,
        allowUsingMicrophone: true,
      },
    },
    files: [
      {
        id: 'n-index',
        name: 'index.html',
        type: 'html',
        path: 'index.html',
        size: 620,
        lastModified: '2026-07-19 13:32:72',
        content: `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:20px;"><h1>Nep Nost Web View</h1></body></html>`,
      },
    ],
  },
];
