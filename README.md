# ServiHero CRM

A modern, full-featured CRM system built for service-based businesses. View the live demo at [https://service-hero.github.io/servihero/](https://service-hero.github.io/servihero/)

## Features

- 📊 Dashboard with real-time analytics
- 💼 Deal pipeline management
- 👥 Contact management
- ✅ Task management
- 📈 Marketing automation
- 🤝 Agency management
- 🔄 Integrations support
- 🔐 Role-based access control

## Tech Stack

- React 18
- TypeScript
- Vite
- Firebase (Authentication, Firestore)
- TailwindCSS
- Framer Motion
- Lucide Icons
- Recharts

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/service-hero/servihero.git
cd servihero
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Deployment

The project is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process is handled by GitHub Actions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.