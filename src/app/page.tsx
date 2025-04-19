'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaTwitter, FaLinkedin, FaGithub, FaDribbble, FaInstagram, FaCode, FaMobile, FaPaintBrush } from 'react-icons/fa';
import { collection, addDoc } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { db, analytics } from '../firebase/config';

interface FormData {
  name: string;
  email: string;
  message: string;
  timestamp?: Date;
}

export default function Home() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Add timestamp to the form data
      const formData = {
        ...data,
        timestamp: new Date()
      };

      // Save to Firebase
      const docRef = await addDoc(collection(db, 'messages'), formData);
      
      // Track form submission in analytics
      if (analytics) {
        logEvent(analytics, 'form_submission', {
          form_name: 'contact',
          message_id: docRef.id
        });
      }
      
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
      
      // Track form submission error in analytics
      if (analytics) {
        logEvent(analytics, 'form_error', {
          form_name: 'contact',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const video = document.getElementById('hero-video') as HTMLVideoElement;
    if (video) {
      video.onloadeddata = () => setIsVideoLoaded(true);
    }

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
  }, []);

  return (
    <main className="min-h-screen tech-grid">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 animated-border">
        <div className="section-container !py-4">
          <div className="flex items-center justify-between">
            <motion.h1 
              className="text-xl md:text-2xl font-bold tech-text"
              data-text="SkateBord Tech"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              SkateBord Tech
            </motion.h1>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <a href="#services" className={`nav-link ${activeSection === 'services' ? 'text-[var(--neon-blue)]' : ''}`}>Services</a>
              <a href="#projects" className={`nav-link ${activeSection === 'projects' ? 'text-[var(--neon-blue)]' : ''}`}>Projects</a>
              <a href="#team" className={`nav-link ${activeSection === 'team' ? 'text-[var(--neon-blue)]' : ''}`}>Team</a>
              <a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'text-[var(--neon-blue)]' : ''}`}>Contact</a>
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
                href="#services" 
                className="text-2xl nav-link" 
                onClick={closeMobileMenu}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Services
              </motion.a>
              <motion.a 
                href="#projects" 
                className="text-2xl nav-link" 
                onClick={closeMobileMenu}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Projects
              </motion.a>
              <motion.a 
                href="#team" 
                className="text-2xl nav-link" 
                onClick={closeMobileMenu}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Team
              </motion.a>
              <motion.a 
                href="#contact" 
                className="text-2xl nav-link" 
                onClick={closeMobileMenu}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Contact
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90" />
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="/skate-poster.jpg"
          >
            <source src="/skate-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-content">
          <motion.div 
            className="section-container relative z-10 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 tech-text glow"
              data-text="SkateBord Tech"
              animate={{ 
                filter: [
                  "drop-shadow(0 0 20px rgba(0,243,255,0.5))",
                  "drop-shadow(0 0 40px rgba(0,243,255,0.5))",
                  "drop-shadow(0 0 20px rgba(0,243,255,0.5))"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SkateBord Tech
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto px-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Pushing the boundaries of technology in the skating world
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                className="cyber-button w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span>View Projects</span>
              </motion.button>
              <motion.button
                className="cyber-button-secondary w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span>Get Started</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-bg py-20">
        <div className="tech-grid absolute inset-0 opacity-20" />
        <motion.div 
          className="section-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center heading-gradient">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6">
                <div className="mb-4 text-blue-500">
                  <FaCode size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Web Development</h3>
                <p className="text-slate-400">
                  Custom web solutions built with modern technologies for optimal performance and user experience.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6">
                <div className="mb-4 text-blue-500">
                  <FaMobile size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Mobile Development</h3>
                <p className="text-slate-400">
                  Native and cross-platform mobile applications that deliver seamless experiences.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-6">
                <div className="mb-4 text-blue-500">
                  <FaPaintBrush size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">UI/UX Design</h3>
                <p className="text-slate-400">
                  User-centered design solutions that create intuitive and engaging digital experiences.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
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
      <section id="team" className="relative py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-slate-900/90 z-0"></div>
        <motion.div
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Meet Our Team
            </motion.h2>
            <motion.p
              className="text-slate-400 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              The innovators behind our cutting-edge skateboarding technology
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              {
                name: "Jaswanth",
                role: "Frontend Developer",
                bio: "Passionate about creating beautiful and responsive web experiences.",
                social: {
                  twitter: "https://twitter.com/jaswanth",
                  linkedin: "https://linkedin.com/in/jaswanth",
                  github: "https://github.com/jaswanth"
                }
              },
              {
                name: "Joel",
                role: "Mobile App Developer",
                bio: "Specialized in creating seamless mobile applications for iOS and Android.",
                social: {
                  twitter: "https://twitter.com/joel",
                  linkedin: "https://linkedin.com/in/joel",
                  github: "https://github.com/joel"
                }
              },
              {
                name: "Sanjay",
                role: "Mobile App Developer",
                bio: "Expert in developing cross-platform mobile solutions with cutting-edge technology.",
                social: {
                  twitter: "https://twitter.com/sanjay",
                  linkedin: "https://linkedin.com/in/sanjay",
                  github: "https://github.com/sanjay"
                }
              }
            ].map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {member.name[0]}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{member.name}</h3>
                <p className="text-blue-400 mb-3">{member.role}</p>
                <p className="text-slate-400 mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-4">
                  <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400">
                    <FaTwitter size={20} />
                  </a>
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400">
                    <FaLinkedin size={20} />
                  </a>
                  <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400">
                    <FaGithub size={20} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800/50" />
        <motion.div
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              Let&apos;s Connect
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Ready to start your next project? Get in touch with us and let&apos;s create something amazing together.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
                  <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Email</p>
                        <a href="mailto:jaswanthmallampati@gmail.com" className="text-white hover:text-blue-400 transition-colors">
                          jaswanthmallampati@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Phone Numbers</p>
                        <div className="space-y-2">
                          <a href="tel:+919908315263" className="block text-white hover:text-blue-400 transition-colors">
                            +91 990 831 5263
                          </a>
                          <a href="tel:+918499018948" className="block text-white hover:text-blue-400 transition-colors">
                            +91 849 901 8948
                          </a>
                          <a href="tel:+917550170293" className="block text-white hover:text-blue-400 transition-colors">
                            +91 755 017 0293
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Project Links</p>
                        <div className="space-y-2">
                          <a href="https://surakshadentalhospvnk.web.app/" target="_blank" rel="noopener noreferrer" className="block text-white hover:text-blue-400 transition-colors">
                            Suraksha Dental Hospital
                          </a>
                          <a href="https://gaming-shop-f5937.web.app/" target="_blank" rel="noopener noreferrer" className="block text-white hover:text-blue-400 transition-colors">
                            Gaming Shop
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 relative">
                <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
                
                <AnimatePresence mode="wait">
                  {showSuccessMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30 flex items-center space-x-2"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Message sent successfully!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register('name', { required: true })}
                        className="form-input"
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <span className="text-red-500 text-sm mt-1">Name is required</span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                        className="form-input"
                        placeholder="Your email"
                      />
                      {errors.email && (
                        <span className="text-red-500 text-sm mt-1">Valid email is required</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      {...register('message', { required: true })}
                      rows={5}
                      className="form-input resize-none"
                      placeholder="Your message"
                    />
                    {errors.message && (
                      <span className="text-red-500 text-sm mt-1">Message is required</span>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    className={`cyber-button w-full ${isSubmitted ? 'cyber-button-secondary' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : isSubmitted ? 'Message Sent!' : 'Send Message'}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
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
