import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { EnquiryModal } from '@/components/EnquiryModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if scrolled past top
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine scroll direction for hiding/showing
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold -> Hide
        setIsVisible(false);
        // Close menu if open when scrolling down
        if (isMenuOpen) setIsMenuOpen(false);
      } else {
        // Scrolling up -> Show
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMenuOpen]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Tour Packages', href: '/packages' },
    // { name: 'Flight Bookings', href: '/flights' },
    // { name: 'Bookings', href: '/my-bookings' },
    { name: 'Visa Services', href: '/visa' },
    { name: 'About Us', href: '/about' },
    { name: 'Plan Your Trip', href: "/plan-trip" }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleWhatsAppClick = () => {
    setEnquiryOpen(true);
    setIsMenuOpen(false);
  };

  const handleContactClick = () => {
    navigate('/contact');
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <header className={`mx-auto max-w-7xl backdrop-blur-xl transition-all duration-300 ${isScrolled ? 'bg-white/90 shadow-lg border border-white/40 rounded-2xl' : 'bg-white/60 shadow-sm rounded-xl'}`}>
          <div className="px-4 pr-6 sm:px-6">
            <div className="flex items-center justify-between h-[72px]">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-4 group transition-transform duration-300 hover:scale-[1.02]">
                <div className="relative w-28 h-28 flex items-center justify-center -ml-2">
                  <img src="/WisdomLogo.png" alt="Logo"
                    className="w-full h-full object-contain select-none pointer-events-none drop-shadow-sm" />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`relative px-3 py-2 text-[15px] font-semibold transition-all duration-300 rounded-lg group overflow-hidden ${active ? 'text-primary' : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                        }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {active && (
                        <span className="absolute bottom-1.5 left-3 right-3 h-0.5 bg-primary rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Desktop CTA Buttons */}
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWhatsAppClick}
                  className="flex items-center gap-2 border-[1.5px] border-green-500/30 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 rounded-xl h-10 px-4 group shadow-sm bg-green-50/50 backdrop-blur-sm"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold">WhatsApp</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleContactClick}
                  className="bg-primary text-white hover:bg-primary/90 transition-all duration-300 rounded-xl h-10 px-5 font-semibold shadow-md hover:shadow-primary/25 hover:-translate-y-0.5"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Navigation Sidebar */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Sidebar */}
      <div className={`lg:hidden fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
            <div className="relative w-16 h-16 flex items-center justify-center -ml-2">
              <img src="/WisdomLogo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium rounded-xl px-4 py-3.5 transition-all flex items-center ${active
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-primary'
                    }`}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Buttons */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <Button
            variant="outline"
            size="default"
            onClick={handleWhatsAppClick}
            className="w-full flex justify-center gap-2 border-[1.5px] border-green-500/30 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 rounded-xl h-12 shadow-sm bg-white"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold text-base">WhatsApp Inquiry</span>
          </Button>
          <Button
            size="default"
            className="w-full bg-primary text-white hover:bg-primary/90 h-12 rounded-xl font-semibold shadow-md"
            onClick={handleContactClick}
          >
            <Phone className="w-5 h-5 mr-2" />
            Contact Us
          </Button>
        </div>
      </div>

      <EnquiryModal
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        sourceContext="whatsapp_header"
      />
    </>
  );
};

export default Header;
