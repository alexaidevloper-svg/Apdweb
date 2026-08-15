import { Project, ProjectFile } from '../types';

export function compileProjectForPreview(
  project: Project,
  entryFileName: string = 'index.html',
  serverRunning: boolean = true
): string {
  const entryFile = project.files.find(
    (f) => f.name.toLowerCase() === entryFileName.toLowerCase()
  ) || project.files.find((f) => f.name.endsWith('.html') || f.name.endsWith('.php')) || project.files[0];

  if (!entryFile) {
    return `<!DOCTYPE html><html><body><h3>No entry file found in project</h3></body></html>`;
  }

  let htmlContent = entryFile.content;

  // Handle PHP execution simulation if it's a PHP file or contains PHP tags
  if (entryFile.type === 'php' || htmlContent.includes('<?php')) {
    htmlContent = processPhpCode(htmlContent, project);
  }

  // Inject linked CSS files
  project.files.filter((f) => f.type === 'css').forEach((cssFile) => {
    // Replace <link rel="stylesheet" href="style.css"> or href="./style.css" with inline style
    const linkRegex = new RegExp(`<link[^>]*href=["'](\\./)?${escapeRegExp(cssFile.name)}["'][^>]*>`, 'gi');
    if (linkRegex.test(htmlContent)) {
      htmlContent = htmlContent.replace(linkRegex, `<style>/* ${cssFile.name} */\n${cssFile.content}</style>`);
    } else {
      // Append into head if not explicitly linked
      if (htmlContent.includes('</head>')) {
        htmlContent = htmlContent.replace('</head>', `<style>/* ${cssFile.name} */\n${cssFile.content}</style></head>`);
      }
    }
  });

  // Inject linked JavaScript files
  project.files.filter((f) => f.type === 'js').forEach((jsFile) => {
    const scriptRegex = new RegExp(`<script[^>]*src=["'](\\./)?${escapeRegExp(jsFile.name)}["'][^>]*>\\s*</script>`, 'gi');
    if (scriptRegex.test(htmlContent)) {
      htmlContent = htmlContent.replace(scriptRegex, `<script>/* ${jsFile.name} */\n${jsFile.content}</script>`);
    }
  });

  // Inject Console Interceptor & Error Handler for the Dev Console
  const consoleScript = `
  <script id="apdweb-console-interceptor">
    (function() {
      const origLog = console.log;
      const origWarn = console.warn;
      const origError = console.error;
      const origInfo = console.info;

      function sendToParent(type, args, source) {
        try {
          const msg = Array.from(args).map(arg => {
            if (typeof arg === 'object') {
              try { return JSON.stringify(arg, null, 2); } catch (e) { return String(arg); }
            }
            return String(arg);
          }).join(' ');

          window.parent.postMessage({
            source: 'apdweb_preview_console',
            type: type,
            message: msg,
            timestamp: new Date().toLocaleTimeString(),
            lineSource: source || 'eval:1:1'
          }, '*');
        } catch(err) {}
      }

      console.log = function(...args) {
        origLog.apply(console, args);
        sendToParent('log', args, 'index.js:13');
      };
      console.warn = function(...args) {
        origWarn.apply(console, args);
        sendToParent('warn', args, 'index.js:28');
      };
      console.error = function(...args) {
        origError.apply(console, args);
        sendToParent('error', args, 'runtime:1:23');
      };
      console.info = function(...args) {
        origInfo.apply(console, args);
        sendToParent('info', args, 'system:1:0');
      };

      window.addEventListener('error', function(e) {
        sendToParent('error', [e.message], (e.filename || 'script.js') + ':' + (e.lineno || 1));
      });

      // Handle custom eval requests from Dev Console prompt
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'APD_WEB_EVAL_COMMAND') {
          try {
            const result = eval(event.data.code);
            sendToParent('log', ['=> ' + (result !== undefined ? JSON.stringify(result) : 'undefined')], 'console:1:1');
          } catch(err) {
            sendToParent('error', [err.message], 'console:1:1');
          }
        }
      });
    })();
  </script>
  `;

  if (htmlContent.includes('<head>')) {
    htmlContent = htmlContent.replace('<head>', `<head>${consoleScript}`);
  } else if (htmlContent.includes('<html>')) {
    htmlContent = htmlContent.replace('<html>', `<html><head>${consoleScript}</head>`);
  } else {
    htmlContent = consoleScript + htmlContent;
  }

  return htmlContent;
}

function processPhpCode(code: string, project: Project): string {
  // Simple PHP tag processor
  return code.replace(/<\?php([\s\S]*?)\?>/gi, (match, phpBlock) => {
    let output = '';
    const lines = phpBlock.split(';');

    // Evaluate basic echo statements and variables
    const vars: Record<string, any> = {
      app_name: project.name,
      server_port: project.settings.phpServerPort || 8000,
      status: 'Ready',
      phpversion: () => project.settings.phpEnvironment || '8.2.10',
    };

    lines.forEach((line: string) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Variable assignment: $var = "value"
      const varMatch = trimmed.match(/^\$([a-zA-Z0-9_]+)\s*=\s*(.+)$/);
      if (varMatch) {
        const varName = varMatch[1];
        let val: string | number = varMatch[2].trim();
        if ((typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) || (typeof val === 'string' && val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        } else if (!isNaN(Number(val))) {
          val = Number(val);
        }
        vars[varName] = val;
        return;
      }

      // Echo statement: echo "something" or echo $var
      const echoMatch = trimmed.match(/^echo\s+(.+)$/);
      if (echoMatch) {
        let expr = echoMatch[1].trim();
        // Replace variable references in string or expression
        Object.keys(vars).forEach((k) => {
          if (typeof vars[k] === 'function') {
            expr = expr.replace(new RegExp(`${k}\\(\\)`, 'g'), vars[k]());
          } else {
            expr = expr.replace(new RegExp(`\\$${k}`, 'g'), String(vars[k]));
          }
        });

        // Strip quotes and concatenate
        expr = expr.replace(/"\s*\.\s*"/g, '').replace(/'\s*\.\s*'/g, '');
        if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
          expr = expr.slice(1, -1);
        }
        output += expr;
      }
    });

    return output || '<div style="color:#0f766e;font-family:monospace;">[PHP execution completed]</div>';
  });
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
