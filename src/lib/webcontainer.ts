import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer;

export async function getWebContainer(): Promise<WebContainer> {
  if (webcontainerInstance) {
    return webcontainerInstance;
  }

  try {
    console.log('Booting WebContainer...');
    webcontainerInstance = await WebContainer.boot();

    console.log('Mounting project files...');
    await webcontainerInstance.mount({
      'package.json': {
        file: {
          contents: JSON.stringify({
            name: "crm-system",
            private: true,
            type: "module",
            scripts: {
              dev: "vite",
              build: "tsc && vite build",
              preview: "vite preview"
            },
            dependencies: {
              "react": "^18.2.0",
              "react-dom": "^18.2.0",
              "@vitejs/plugin-react": "^4.2.1",
              "vite": "^5.1.4"
            }
          }, null, 2)
        }
      },
      'vite.config.js': {
        file: {
          contents: `
            import { defineConfig } from 'vite';
            import react from '@vitejs/plugin-react';

            export default defineConfig({
              plugins: [react()],
              server: {
                host: true,
                port: 3000,
                strictPort: true
              }
            });
          `.trim()
        }
      },
      'index.html': {
        file: {
          contents: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>CRM System</title>
              </head>
              <body>
                <div id="root"></div>
                <script type="module" src="/src/main.tsx"></script>
              </body>
            </html>
          `.trim()
        }
      }
    });

    console.log('Installing dependencies...');
    const installProcess = await webcontainerInstance.spawn('npm', ['install']);
    
    const installExitCode = await installProcess.exit;
    if (installExitCode !== 0) {
      throw new Error('Failed to install dependencies');
    }

    console.log('Starting development server...');
    const devProcess = await webcontainerInstance.spawn('npm', ['run', 'dev']);

    // Stream the output
    devProcess.output.pipeTo(
      new WritableStream({
        write(chunk) {
          console.log(chunk);
        },
      })
    );

    // Wait for server to be ready
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 30000);

      webcontainerInstance.on('server-ready', (port, url) => {
        console.log('Dev server ready at:', url);
        clearTimeout(timeout);
        resolve();
      });
    });

    return webcontainerInstance;
  } catch (error) {
    console.error('WebContainer initialization failed:', error);
    throw error;
  }
}

export async function teardownWebContainer(): Promise<void> {
  if (webcontainerInstance) {
    await webcontainerInstance.teardown();
    webcontainerInstance = undefined as any;
  }
}