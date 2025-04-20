'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaMobile, FaPaintBrush } from 'react-icons/fa';
import Image from 'next/image';
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaLink } from 'react-icons/fa';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function Home() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  // Handle form submission
  const onSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', formData);
      
      // Clear form and show success message
      reset();
      setIsSubmitted(true);
      setShowSuccessMessage(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setIsSubmitted(false);
      }, 5000);
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    try {
      // Intersection Observer for sections
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { threshold: 0.5 }
      );

      document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section);
      });

      return () => observer.disconnect();
    } catch (err) {
      console.error('Error in useEffect:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen tech-grid">
      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0B0B13]">
        <div className="absolute inset-0 z-0">
          {/* Rotating Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[600px] h-[600px] border-[1px] border-cyan-400/20 rounded-full rotate-video"></div>
          </div>
          {/* Background Video */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-[#0B0B13]/90 z-10" />
            <video
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videos/skate-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 neon-text">
            SkateBord Tech
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-16">
            Pushing the boundaries of technology in the skating world
          </p>
          <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
            <button
              onClick={() => scrollToSection('projects')}
              className="neon-button cyan px-16"
            >
              <span>View Projects</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="neon-button magenta px-16"
            >
              <span>Get Started</span>
            </button>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text"
            >
              SkateBord
            </motion.h1>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <button onClick={() => scrollToSection('home')} className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>Home</button>
              <button onClick={() => scrollToSection('services')} className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}>Services</button>
              <button onClick={() => scrollToSection('projects')} className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}>Projects</button>
              <button onClick={() => scrollToSection('team')} className={`nav-link ${activeSection === 'team' ? 'active' : ''}`}>Team</button>
              <button onClick={() => scrollToSection('contact')} className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}>Contact</button>
            </div>
            {/* Mobile Menu Button */}
            <button 
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <motion.a 
                href="#home" 
                className="text-2xl nav-link" 
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Home
              </motion.a>
              <motion.a 
                href="#services" 
                className="text-2xl nav-link" 
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Services
              </motion.a>
              <motion.a 
                href="#projects" 
                className="text-2xl nav-link" 
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Projects
              </motion.a>
              <motion.a 
                href="#team" 
                className="text-2xl nav-link" 
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Team
              </motion.a>
              <motion.button 
                onClick={() => scrollToSection('contact')} 
                className="text-2xl nav-link" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Contact
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Section */}
      <section id="services" className="section-bg py-20">
        <div className="tech-grid absolute inset-0 opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              Our Services
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Empowering your digital journey with cutting-edge solutions and expert craftsmanship
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Web Development */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="service-card"
            >
              <div className="p-6">
                <FaCode className="text-4xl mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-3">Web Development</h3>
                <p className="text-slate-400 mb-4">
                  Custom web applications built with modern technologies and best practices. Our solutions include:
                </p>
                <ul className="text-slate-400 list-disc list-inside space-y-2">
                  <li>Responsive website development</li>
                  <li>Progressive Web Apps (PWA)</li>
                  <li>E-commerce solutions</li>
                  <li>Content Management Systems</li>
                  <li>API development and integration</li>
                </ul>
              </div>
            </motion.div>

            {/* Mobile Development */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="service-card"
            >
              <div className="p-6">
                <FaMobile className="text-4xl mb-4 text-purple-500" />
                <h3 className="text-xl font-bold mb-3">Mobile Development</h3>
                <p className="text-slate-400 mb-4">
                  Native and cross-platform mobile applications that deliver exceptional user experiences:
                </p>
                <ul className="text-slate-400 list-disc list-inside space-y-2">
                  <li>iOS and Android development</li>
                  <li>React Native applications</li>
                  <li>Mobile app UI/UX design</li>
                  <li>App performance optimization</li>
                  <li>App maintenance and updates</li>
                </ul>
              </div>
            </motion.div>

            {/* UI/UX Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="service-card"
            >
              <div className="p-6">
                <FaPaintBrush className="text-4xl mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-3">UI/UX Design</h3>
                <p className="text-slate-400 mb-4">
                  Creating beautiful and intuitive interfaces that users love to interact with:
                </p>
                <ul className="text-slate-400 list-disc list-inside space-y-2">
                  <li>User interface design</li>
                  <li>User experience optimization</li>
                  <li>Wireframing and prototyping</li>
                  <li>Design system creation</li>
                  <li>Usability testing</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section-bg py-20">
        <div className="tech-grid absolute inset-0 opacity-20" />
        <motion.div 
          className="section-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center heading-gradient">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dental Website */}
            <motion.div
              className="project-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                <a href="https://surakshadentalhospvnk.web.app/" target="_blank" rel="noopener noreferrer">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Dental Care</h3>
                  </div>
                </a>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Suraksha Dental Hospital</h3>
              <p className="text-slate-400 mb-4">
                A modern website for a dental hospital showcasing their services and facilitating patient appointments. Let&apos;s make your dental practice shine online!
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tech-tag">React</span>
                <span className="tech-tag">Firebase</span>
                <span className="tech-tag">Tailwind CSS</span>
              </div>
            </motion.div>

            {/* Gaming E-commerce */}
            <motion.div
              className="project-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                <a href="https://gaming-shop-f5937.web.app/" target="_blank" rel="noopener noreferrer">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Gaming Shop</h3>
                  </div>
                </a>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Gaming E-commerce</h3>
              <p className="text-slate-400 mb-4">
                A feature-rich e-commerce platform for gaming enthusiasts to discover and purchase gaming gear.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tech-tag">React</span>
                <span className="tech-tag">Firebase</span>
                <span className="tech-tag">Redux</span>
                <span className="tech-tag">Stripe</span>
              </div>
            </motion.div>

            {/* Doctor Consulting App */}
            <motion.div
              className="project-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 to-purple-600/50 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Doctor Connect</h3>
                    <span className="bg-blue-500/80 px-3 py-1 rounded-full text-sm text-white">Coming Soon</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Online Doctor Consultation</h3>
              <p className="text-slate-400 mb-4">
                A mobile application enabling seamless online consultations between doctors and patients.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tech-tag">React Native</span>
                <span className="tech-tag">Node.js</span>
                <span className="tech-tag">MongoDB</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800/50" />
        <motion.div
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              Meet Our Team
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Passionate developers and designers dedicated to creating exceptional digital experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 - Jaswanth */}
            <motion.div
              className="team-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
                <Image
                  src="/team/jaswanth.jpg"
                  alt="Jaswanth"
                  width={400}
                  height={400}
                  className="object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Jaswanth</h3>
              <p className="text-blue-400 mb-4">Frontend Developer</p>
              <p className="text-slate-400 mb-4">
                Passionate about creating beautiful and responsive web experiences.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-slate-400 hover:text-white"><FaTwitter /></a>
                <a href="#" className="text-slate-400 hover:text-white"><FaLinkedin /></a>
                <a href="#" className="text-slate-400 hover:text-white"><FaGithub /></a>
              </div>
            </motion.div>

            {/* Team Member 2 - Joel */}
            <motion.div
              className="team-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
                <Image
                  src="/team/joel.jpg"
                  alt="Joel"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className="transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Joel</h3>
              <p className="text-blue-400 mb-4">Mobile App Developer</p>
              <p className="text-slate-400 mb-4">
                Specialized in creating seamless mobile applications for iOS and Android.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-slate-400 hover:text-white"><FaTwitter /></a>
                <a href="#" className="text-slate-400 hover:text-white"><FaLinkedin /></a>
                <a href="#" className="text-slate-400 hover:text-white"><FaGithub /></a>
              </div>
            </motion.div>

            {/* Team Member 3 - Sanjay */}
            <motion.div
              className="team-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
                <Image
                  src="/team/sanjay.jpg"
                  alt="Sanjay"
                  width={400}
                  height={400}
                  className="object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Sanjay</h3>
              <p className="text-blue-400 mb-4">Mobile App Developer</p>
              <p className="text-slate-400 mb-4">
                Expert in developing cross-platform mobile solutions with cutting-edge technology.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-slate-400 hover:text-white"><FaTwitter /></a>
                <a href="#" className="text-slate-400 hover:text-white"><FaLinkedin /></a>
                <a href="#" className="text-slate-400 hover:text-white"><FaGithub /></a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* For Developers Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              For Developers
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Join our team of passionate developers and work on cutting-edge projects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-4 text-blue-400">Flexible Work Environment</h3>
              <ul className="text-slate-300 space-y-2">
                <li>• Remote-first culture</li>
                <li>• Flexible working hours</li>
                <li>• Modern tech stack</li>
                <li>• Collaborative team</li>
              </ul>
            </motion.div>

            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4 text-purple-400">Growth Opportunities</h3>
              <ul className="text-slate-300 space-y-2">
                <li>• Regular training sessions</li>
                <li>• Conference opportunities</li>
                <li>• Mentorship program</li>
                <li>• Career progression</li>
              </ul>
            </motion.div>

            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-4 text-green-400">Benefits</h3>
              <ul className="text-slate-300 space-y-2">
                <li>• Competitive salary</li>
                <li>• Health insurance</li>
                <li>• Learning allowance</li>
                <li>• Team events</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              Let&apos;s Connect
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Ready to start your next project? Get in touch with us and let&apos;s create something amazing together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8 bg-slate-800/50 p-8 rounded-xl border border-slate-700"
            >
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-900/50 p-3 rounded-full">
                      <FaEnvelope className="text-blue-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-blue-400 font-semibold mb-1">Email</p>
                      <p className="text-slate-300">jaswanthmallampati@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-900/50 p-3 rounded-full">
                      <FaPhone className="text-blue-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-blue-400 font-semibold mb-1">Phone Numbers</p>
                      <p className="text-slate-300">+91 990 831 5263</p>
                      <p className="text-slate-300">+91 849 901 8948</p>
                      <p className="text-slate-300">+91 755 017 0293</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-900/50 p-3 rounded-full">
                      <FaLink className="text-blue-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-blue-400 font-semibold mb-1">Project Links</p>
                      <div className="space-y-2">
                        <a href="https://surakshadentalhospvnk.web.app/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white block">
                          Suraksha Dental Hospital
                        </a>
                        <a href="https://gaming-shop-f5937.web.app/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white block">
                          Gaming Shop
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-800/50 p-8 rounded-xl border border-slate-700"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <input
                    {...register('name', { required: true })}
                    className="form-input"
                    placeholder="Your Name"
                    disabled={isSubmitting}
                  />
                  {errors.name && <span className="text-red-500">Name is required</span>}
                </div>
                <div>
                  <input
                    {...register('email', {
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    })}
                    className="form-input"
                    placeholder="Your Email"
                    disabled={isSubmitting}
                  />
                  {errors.email && <span className="text-red-500">Valid email is required</span>}
                </div>
                <div>
                  <textarea
                    {...register('message', { required: true })}
                    className="form-input min-h-[150px]"
                    placeholder="Your Message"
                    disabled={isSubmitting}
                  />
                  {errors.message && <span className="text-red-500">Message is required</span>}
                </div>
                <motion.button
                  type="submit"
                  className={`cyber-button w-full ${isSubmitted ? 'cyber-button-secondary' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent!' : 'Send Message'}
                </motion.button>
              </form>

              <AnimatePresence>
                {showSuccessMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed bottom-8 right-8 bg-green-500 text-white p-6 rounded-lg shadow-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <h3 className="font-bold text-lg">Message Sent Successfully!</h3>
                        <p>We&apos;ll get back to you soon ✨</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900/80 backdrop-blur-sm border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-slate-400"> 2025 Skate-Bord. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
