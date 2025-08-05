# The Simplest Resume Builder (ATS Friendly)

A modern, clean resume builder designed for maximum ATS compatibility and professional presentation. Create beautiful resumes with real-time preview and export to high-quality PDF.

![Resume Builder Screenshot](https://resume-builder-dun-rho.vercel.app/preview.png)

## ✨ Features

- **🎯 ATS Optimized**: Clean, simple layout that passes through Applicant Tracking Systems
- **👀 Real-time Preview**: See your resume update instantly as you type
- **📄 PDF Export**: Generate high-quality PDFs with precise formatting
- **💾 Auto-save**: Your work is automatically saved to your browser
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile
- **⚡ Fast**: Built with modern tools for lightning-fast performance
- **🎨 Professional Design**: Clean typography using IBM Plex Sans
- **♿ Accessible**: Keyboard navigation and screen reader friendly

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:tonyzebastian/Resume-Builder.git
   cd Resume-Builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit `http://localhost:5173` to start building your resume!

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📋 How to Use

### 1. Personal Information
Fill in your basic contact details:
- Full name and professional title
- Email address and website/portfolio
- Optional sub-profession title

### 2. Work Experience
Add your professional experience:
- Company name and position
- Location and dates (MM/YYYY format)
- Job description with line breaks for multiple points
- Toggle for current positions

### 3. Skills
Organize your skills by categories:
- Create custom skill categories (e.g., "Programming Languages", "Design Tools")
- Add skills one per line
- Delete categories you don't need

### 4. Export PDF
Click "Download PDF" to generate a professional PDF resume that matches the preview exactly.

## 🏗️ Built With

- **[React](https://reactjs.org/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Radix UI](https://www.radix-ui.com/)** - Accessible components
- **[pdf-lib](https://pdf-lib.js.org/)** - PDF generation
- **[Lucide React](https://lucide.dev/)** - Icons
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[Vercel Speed Insights](https://vercel.com/docs/speed-insights)** - Performance monitoring

## 🎨 Design Philosophy

This resume builder follows a **"less is more"** approach:

- **Clean Layout**: Simple, scannable design that ATS systems love
- **Professional Typography**: IBM Plex Sans for modern readability
- **Consistent Spacing**: Carefully crafted spacing for visual hierarchy
- **Subtle Interactions**: Hover effects and smooth transitions
- **Mobile First**: Responsive design that works everywhere

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── sections/        # Resume sections (experience, skills)
│   └── preview/         # Resume preview
├── context/             # React context for state
├── types/               # TypeScript definitions
├── utils/               # PDF generation & validation
└── assets/              # Fonts and images
```

## 🔧 Configuration

### Custom Fonts
The app uses IBM Plex Sans by default. To change fonts:
1. Add your font files to `src/assets/fonts/`
2. Update font loading in `src/utils/fontLoader.ts`
3. Modify PDF generation in `src/utils/pdfGenerator.ts`

### Styling
Built with Tailwind CSS. Key customizations in `tailwind.config.js`:
- Custom color palette
- Font family configuration
- Component-specific utilities

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test` (when available)
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Use Tailwind CSS for styling
- Ensure accessibility compliance

## 📱 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 🐛 Known Issues

- Large bundle size (~724KB) - working on code splitting
- PDF generation might be slow on older devices
- Some special characters may not render in PDF exports

## 🚀 Deployment

This app is optimized for **Vercel deployment** with built-in Speed Insights:

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically with zero configuration
4. Speed Insights will automatically track performance metrics

### Other Deployment Options
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Enable Pages in repository settings
- **Any static host**: Upload the `dist` folder after running `npm run build`

## 🔒 Privacy & Security

- **No data collection**: Your resume data never leaves your browser
- **Local storage only**: All data is stored locally in your browser
- **No tracking**: No analytics or third-party scripts
- **HTTPS ready**: Secure deployment compatible

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility-first CSS framework
- [pdf-lib](https://pdf-lib.js.org/) for client-side PDF generation
- [IBM](https://fonts.google.com/specimen/IBM+Plex+Sans) for the beautiful IBM Plex Sans font

## 🚧 Roadmap

- [ ] Education section
- [ ] Projects showcase
- [ ] Multiple templates
- [ ] Import from LinkedIn
- [ ] ATS compatibility scoring
- [ ] Mobile app

See [cursor.md](cursor.md) for detailed improvement plans.

## 📞 Support

Having issues? Please check:

1. **FAQ**: Common questions and solutions
2. **Issues**: [GitHub Issues](https://github.com/tonyzebastian/Resume-Builder/issues)
3. **Discussions**: [GitHub Discussions](https://github.com/tonyzebastian/Resume-Builder/discussions)

---

<div align="center">
  <strong>Built with ❤️ for job seekers everywhere</strong>
  <br>
  <sub>Make your next career move with confidence</sub>
</div>