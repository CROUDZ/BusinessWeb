"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FaLaptop, FaMobileAlt, FaSearch, 
  FaMapMarkerAlt, FaEnvelope, FaPhone,
  FaFacebookF, FaInstagram, FaTwitter,
  FaCheckCircle, FaStar, FaBars
} from "react-icons/fa";
import { FiX } from "react-icons/fi";

import LogoImg from "@/assets/logo.png";
import NoProfilImg  from "@/assets/noProfil.webp";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8 }
  }
};

const slideIn = (direction = "left") => ({
  hidden: { 
    x: direction === "left" ? -100 : 100, 
    opacity: 0 
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.7, 
      ease: "easeOut" as const
    }
  }
});

export default function BusinessWebPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // New useEffect for section detection
  useEffect(() => {
    const sections = ['accueil', 'apropos', 'services', 'temoignages', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        threshold: [0.3, 0.5, 0.7],
        rootMargin: '-80px 0px -20% 0px'
      }
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    console.log("Formulaire soumis:", formData);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const smoothScrollTo = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const headerHeight = 80; // Hauteur approximative du header fixe
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    // Fermer le menu mobile si ouvert
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'apropos', label: 'À propos' },
    { id: 'services', label: 'Services' },
    { id: 'temoignages', label: 'Avis Clients' },
    { id: 'contact', label: 'Contact' }
  ];

  const getUnderlineStyle = () => {
    const activeIndex = navItems.findIndex(item => item.id === activeSection);
    const activeButton = navRefs.current[activeIndex];
    
    if (!activeButton) {
      return { x: 0, width: 0, opacity: 0 };
    }

    const buttonRect = activeButton.getBoundingClientRect();
    const containerRect = activeButton.parentElement?.parentElement?.getBoundingClientRect();
    
    if (!containerRect) {
      return { x: 0, width: 0, opacity: 0 };
    }

    return {
      x: buttonRect.left - containerRect.left,
      width: buttonRect.width,
      opacity: 1
    };
  };

  return (
    <>
      <Head>
        <title>BusinessWeb - Sites web professionnels</title>
        <meta name="description" content="Création de sites web modernes pour petites entreprises et artisans" />
        <link rel="icon" href="../assets/logo.png" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Header animé */}
        <motion.header 
          className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white '}`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Image src={LogoImg} alt="BusinessWeb Logo" className="w-16 h-16 object-contain" />
            </motion.div>
            
            {/* Menu desktop */}
            <motion.nav 
              className="hidden md:block relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ul className="flex space-x-8 relative">
                {navItems.map((item, index) => (
                  <li key={item.id} className="relative">
                    <motion.button
                      ref={(el) => { navRefs.current[index] = el; }}
                      onClick={() => smoothScrollTo(item.id)} 
                      className={`text-gray-700 hover:text-orange-500 font-medium cursor-pointer transition-colors duration-300 py-2 px-1 ${
                        activeSection === item.id ? 'text-orange-500' : ''
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.label}
                    </motion.button>
                  </li>
                ))}
                
                {/* Animated underline */}
                <motion.div
                  className="absolute bottom-0 h-0.5 bg-orange-500 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={getUnderlineStyle()}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.6
                  }}
                />
              </ul>
            </motion.nav>
            
            {/* Menu mobile */}
            <motion.button 
              className="md:hidden text-gray-700 z-50"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </motion.button>
            
            {/* Menu mobile overlay */}
            {isMenuOpen && (
              <motion.div 
                className="md:hidden fixed inset-0 bg-[#00000088] z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleMenu}
              >
                <motion.div 
                  className="absolute top-0 right-0 h-full w-3/4 bg-white shadow-xl p-8"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={(e) => e.stopPropagation()}
                >
                    <ul className="mt-16 space-y-6 flex flex-col items-center justify-center">
                    <li>
                      <button
                      onClick={() => smoothScrollTo('accueil')} 
                      className="text-xl text-gray-800 hover:text-orange-500 block py-2 cursor-pointer"
                      >
                      Accueil
                      </button>
                    </li>
                    <li>
                      <button
                      onClick={() => smoothScrollTo('apropos')} 
                      className="text-xl text-gray-800 hover:text-orange-500 block py-2 cursor-pointer"
                      >
                      À propos
                      </button>
                    </li>
                    <li>
                      <button
                      onClick={() => smoothScrollTo('services')} 
                      className="text-xl text-gray-800 hover:text-orange-500 block py-2 cursor-pointer"
                      >
                      Services
                      </button>
                    </li>
                    <li>
                      <button
                      onClick={() => smoothScrollTo('temoignages')} 
                      className="text-xl text-gray-800 hover:text-orange-500 block py-2 cursor-pointer"
                      >
                      Avis Clients
                      </button>
                    </li>
                    <li>
                      <button
                      onClick={() => smoothScrollTo('contact')} 
                      className="text-xl text-gray-800 hover:text-orange-500 block py-2 cursor-pointer"
                      >
                      Contact
                      </button>
                    </li>
                    </ul>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Hero Section avec animations */}
        <section id="accueil" className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-r from-orange-600 to-yellow-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Votre présence en ligne professionnelle
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl max-w-3xl mx-auto mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Nous créons des sites web modernes et efficaces pour les petites entreprises et artisans
              </motion.p>
              
              <motion.button
                onClick={() => smoothScrollTo('contact')} 
                className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition duration-300 inline-block cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                Contactez-nous
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* À propos avec animations */}
        <section id="apropos" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-8 text-gray-800"
                variants={itemVariants}
              >
                À propos de BusinessWeb
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600 leading-relaxed"
                variants={itemVariants}
              >
                BusinessWeb est une agence innovante, dédiée à la création de sites web modernes pour les petites entreprises. Nous aidons les commerçants locaux et les indépendants à avoir une présence en ligne professionnelle, accessible et efficace. Que vous soyez coiffeur, restaurateur, ou artisan, BusinessWeb transforme vos idées en un site internet qui vous ressemble.
              </motion.p>
              
              <motion.div 
                className="mt-10 flex justify-center"
                variants={itemVariants}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <motion.div 
                    className="bg-gray-100 p-6 rounded-lg"
                    whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-4xl font-bold text-orange-500">5+</div>
                    <div className="text-gray-600 mt-2">Années d'expérience</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gray-100 p-6 rounded-lg"
                    whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-4xl font-bold text-orange-500">150+</div>
                    <div className="text-gray-600 mt-2">Projets réalisés</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gray-100 p-6 rounded-lg"
                    whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-4xl font-bold text-orange-500">98%</div>
                    <div className="text-gray-600 mt-2">Clients satisfaits</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gray-100 p-6 rounded-lg"
                    whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-4xl font-bold text-orange-500">24h</div>
                    <div className="text-gray-600 mt-2">Support rapide</div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services avec animations */}
        <section id="services" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-16 text-center text-gray-800"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              Nos Services
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service 1 avec animation */}
              <motion.div 
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={slideIn("left")}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
              >
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <FaLaptop className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Création de sites vitrines</h3>
                <p className="text-gray-600">
                  Conception de sites simples et élégants pour présenter votre entreprise. Mise en valeur de vos produits et services avec un design moderne.
                </p>
              </motion.div>
              
              {/* Service 2 avec animation */}
              <motion.div 
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
              >
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <FaMobileAlt className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Sites adaptés aux mobiles</h3>
                <p className="text-gray-600">
                  Des sites optimisés pour une consultation facile sur smartphone et tablette. Expérience utilisateur parfaite sur tous les appareils.
                </p>
              </motion.div>
              
              {/* Service 3 avec animation */}
              <motion.div 
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={slideIn("right")}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
              >
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <FaSearch className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">SEO de base</h3>
                <p className="text-gray-600">
                  Optimisation pour le référencement afin que votre site soit trouvé sur Google. Augmentation de votre visibilité en ligne.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Témoignages avec animations */}
        <section id="temoignages" className="py-16 bg-gradient-to-r from-orange-600 to-yellow-600 text-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-16 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              Ce que disent nos clients
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Témoignage 1 avec animation */}
              <motion.div 
                className="bg-white bg-opacity-20 backdrop-blur-sm p-8 rounded-lg text-black"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-4">
                  <Image src={NoProfilImg} alt="Profil de Marie L." className="w-16 h-16 rounded-full border-2 border-orange-500" />
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">Marie L.</h4>
                    <p className="text-black">Créatrice de bijoux</p>
                  </div>
                </div>
                <p className="italic">
                  "BusinessWeb a transformé ma boutique en ligne. Le site est magnifique et il m'a permis d'attirer plus de clients !"
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 text-yellow-300" />
                  ))}
                </div>
              </motion.div>
              
              {/* Témoignage 2 avec animation */}
              <motion.div 
                className="bg-white bg-opacity-20 backdrop-blur-sm p-8 rounded-lg text-black"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-4">
                  <Image src={NoProfilImg} alt="Profil de Jean B." className="w-16 h-16 rounded-full border-2 border-orange-500" />
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">Jean B.</h4>
                    <p className="text-black">Restaurateur</p>
                  </div>
                </div>
                <p className="italic text-black">
                  "Très professionnel et réactif. Le site que j'ai obtenu est exactement ce que je voulais !"
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 text-yellow-300" />
                  ))}
                </div>
              </motion.div>
              
              {/* Témoignage 3 avec animation */}
              <motion.div 
                className="md:col-span-2 bg-white bg-opacity-20 backdrop-blur-sm p-8 rounded-lg text-black"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-4">
                <Image src={NoProfilImg} alt="Profil de Marie L." className="w-16 h-16 rounded-full border-2 border-orange-500" />
                  <div className="ml-4">
                    <h4 className="font-bold text-lg text-black">Sophie D.</h4>
                    <p className="text-black">Coiffeuse indépendante</p>
                  </div>
                </div>
                <p className="italic text-black">
                  "Grâce à BusinessWeb, j'ai enfin un site qui représente vraiment mon salon. Mes clients peuvent maintenant prendre rendez-vous en ligne facilement et voir mes créations. Un vrai plus pour mon activité !"
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 text-yellow-300" />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact avec animations */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                Contactez-nous
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={slideIn("left")}
                >
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Discutons de votre projet</h3>
                  <p className="text-gray-600 mb-6">
                    Vous avez un projet de site web pour votre entreprise ? Remplissez ce formulaire et nous vous recontacterons dans les plus brefs délais.
                  </p>
                  
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <h4 className="font-bold mb-3 text-gray-800">Nos coordonnées</h4>
                    <div className="flex items-center mb-3">
                      <FaMapMarkerAlt className="w-5 h-5 text-orange-500 mr-3" />
                      <span className="text-gray-600">15 Rue de la Paix, 75002 Paris</span>
                    </div>
                    <div className="flex items-center mb-3">
                      <FaEnvelope className="w-5 h-5 text-orange-500 mr-3" />
                      <span className="text-gray-600">contact@businessweb.fr</span>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="w-5 h-5 text-orange-500 mr-3" />
                      <span className="text-gray-600">01 23 45 67 89</span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="font-bold mb-4 text-gray-800">Nous suivre</h4>
                    <div className="flex space-x-4">
                      <motion.a 
                        href="#" 
                        className="bg-gray-200 hover:bg-orange-500 text-gray-700 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition duration-300"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaFacebookF className="w-5 h-5" />
                      </motion.a>
                      <motion.a 
                        href="#" 
                        className="bg-gray-200 hover:bg-orange-500 text-gray-700 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition duration-300"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaInstagram className="w-5 h-5" />
                      </motion.a>
                      <motion.a 
                        href="#" 
                        className="bg-gray-200 hover:bg-orange-500 text-gray-700 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition duration-300"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTwitter className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
                
                {/* Formulaire avec animation */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={slideIn("right")}
                >
                  {formSubmitted ? (
                    <motion.div 
                      className="bg-green-100 border border-green-400 text-green-700 px-4 py-8 rounded text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Message envoyé avec succès !</h3>
                      <p>Nous vous recontacterons très rapidement.</p>
                        <motion.button 
                        onClick={() => setFormSubmitted(false)}
                        className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        >
                        Envoyer un autre message
                        </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      onSubmit={handleSubmit} 
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 text-black"
                          placeholder="Votre nom"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 text-black"
                          placeholder="Votre email"
                        />
                      </div>
                      
                        <div>
                        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 text-black"
                          placeholder="Votre message"
                        />
                        </div>
                        
                      <motion.button 
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Envoyer
                      </motion.button>
                    </motion.form>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Carte de localisation avec animation */}
        <div className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Notre localisation
              </h3>
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.2913145143174!2d2.3310!3d48.8697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2s15%20Rue%20de%20la%20Paix%2C%2075002%20Paris!5e0!3m2!1sfr!2sfr!4v1635789012345!5m2!1sfr!2sfr"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                  title="BusinessWeb - 15 Rue de la Paix, 75002 Paris"
                />
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800">BusinessWeb - Agence Web Paris</h4>
                      <p className="text-gray-600 text-sm">15 Rue de la Paix, 75002 Paris</p>
                      <p className="text-gray-600 text-sm">Métro : Opéra (Lignes 3, 7, 8)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Horaires d'ouverture :</p>
                      <p className="text-sm text-gray-800 font-medium">Lun-Ven : 9h-18h</p>
                      <p className="text-sm text-gray-600">Sur rendez-vous</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer avec animation */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div 
                className="mb-4 md:mb-0"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <motion.div 
                    className="flex items-center justify-center"
                    whileHover={{ rotate: 10 }}
                  >
                    <Image src={LogoImg} alt="BusinessWeb Logo" className="w-16 h-16 object-contain" />
                  </motion.div>
                  <h3 className="ml-3 text-xl font-bold">BusinessWeb</h3>
                </div>
                <p className=" text-gray-400 text-sm">Création de sites web sur mesure pour petites entreprises</p>
              </motion.div>
              
              <motion.div 
                className="text-center md:text-right"
                variants={itemVariants}
              >
                <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} BusinessWeb. Tous droits réservés.</p>
                <p className="text-gray-500 text-xs mt-2">Site fictif créé dans le cadre d'un projet</p>
              </motion.div>
            </motion.div>
          </div>
        </footer>
      </div>
    </>
  );
}