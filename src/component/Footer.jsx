import {
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Logo dan Deskripsi */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h1 className="text-2xl font-bold">TeraPro</h1>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
          </div>

          {/* Navigasi Link */}
          <div className="flex space-x-6 mb-6 md:mb-0">
            <a href="#about" className="hover:text-indigo-400 transition duration-300">Tentang</a>
            <a href="#services" className="hover:text-indigo-400 transition duration-300">Layanan</a>
            <a href="#contact" className="hover:text-indigo-400 transition duration-300">Kontak</a>
          </div>

          {/* Social Media */}
          <div className="flex space-x-4">
            <a
              href="https://github.com"
              className="hover:text-indigo-400 transition"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={22} />
            </a>
            <a
              href="https://twitter.com"
              className="hover:text-indigo-400 transition"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={22} />
            </a>
            <a
              href="https://linkedin.com"
              className="hover:text-indigo-400 transition"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={22} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
