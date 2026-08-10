import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, ArrowUpRight, Icon } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { name: 'Tour Packages', href: '/packages' },
    // { name: 'Flight Bookings', href: '/flights' },
    { name: 'Visa Services', href: '/visa' },
    { name: 'About Us', href: '/about' },
  ];

  const services = [
    { name: 'Domestic Tours', href: '/packages' },
    { name: 'International Tours', href: '/packages' },
    { name: 'Flight Bookings', href: '' },
    { name: 'Visa Assistance', href: '/visa' },
    // { name: 'Travel Insurance', href: '/about' },
    { name: 'Group Tours', href: '/packages' },
  ];

  const destinations = [
    { name: 'Switzerland', id: 'Switzerland' },
    { name: 'Iceland', id: 'Iceland' },
    { name: 'Nepal', id: 'Nepal' },
    { name: 'Goa', id: 'Goa' },
    { name: 'Kerala', id: 'Kerala' },
    { name: 'Rajasthan', id: 'Rajasthan' },
  ];

  const socials = [
    { Icon: Facebook, label: 'Facebook', href: '#' },
    { Icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/wisdomtravelandtours/' },
    // { Icon: Twitter, label: 'Twitter', href: '#' },
    // { Icon: Linkedin, label: 'LinkedIn', href: '#' },
  ];

  const handleWhatsAppClick = () =>
    window.open('https://wa.me/9856664440?text=Hello, I would like to inquire about your travel services.', '_blank');
  const handlePhoneClick = () => window.open('tel:+919856664440', '_self');
  const handleEmailClick = () => window.open('mailto:sales@wisdomtravel.in', '_self');
  const handleMapClick = () =>
    window.open('https://www.google.com/maps/place/Wisdom+Travel+and+Tours/@19.0897983,72.8377711,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c933d62324e3:0x6d5203898e11bf83!8m2!3d19.0897983!4d72.8377711!16s%2Fg%2F11j014gg7_', '_blank');

  return (
    <footer className="bg-gradient-to-br from-red-50 via-white to-red-50 relative overflow-hidden">

      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-25 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-25 translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-7xl pt-16 pb-10">

        {/* Top divider line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-200 to-transparent mb-14" />

        {/* Main Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12 mb-14">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-4 space-y-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-serif font-bold text-slate-900">
                Wisdom Travel & Tours
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mt-2.5 max-w-[280px]">
                Crafting extraordinary journeys and lifelong memories across the globe since 2019.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              {[
                { icon: Phone, label: '+91 98566 64440', onClick: handlePhoneClick },
                { icon: Mail, label: 'sales@wisdomtravel.in', onClick: handleEmailClick },
              ].map(({ icon: Icon, label, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="flex items-center gap-2.5 text-slate-500 text-xs font-medium hover:text-red-600 transition-colors group w-full text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-white border border-red-100 flex items-center justify-center flex-shrink-0 group-hover:border-red-300 group-hover:bg-red-50 transition-all">
                    <Icon className="w-3 h-3 text-red-400" />
                  </div>
                  {label}
                </button>
              ))}
              <button
                onClick={handleMapClick}
                className="flex items-start gap-2.5 text-slate-500 text-xs font-medium hover:text-red-600 transition-colors group w-full text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-red-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-red-300 group-hover:bg-red-50 transition-all">
                  <MapPin className="w-3 h-3 text-red-400" />
                </div>
                <span className="leading-relaxed">
                  Dheeraj Heritage, G-14, Swami Vivekananda Rd,<br />
                  Santacruz (West), Mumbai - 400054
                </span>
              </button>
            </div>

            {/* WhatsApp CTA */}
            <Button
              onClick={handleWhatsAppClick}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-9 text-xs px-4 gap-2 transition-all w-fit"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Us
            </Button>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white border border-red-100 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.15em]">Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.name}>
                  <Link
                    to={s.href}
                    className="flex items-center gap-2 text-slate-500 text-xs hover:text-red-600 transition-colors group"
                  >
                    <div className="w-1 h-1 rounded-full bg-red-200 group-hover:bg-red-500 transition-colors flex-shrink-0" />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.15em]">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 text-slate-500 text-xs hover:text-red-600 transition-colors group"
                  >
                    <div className="w-1 h-1 rounded-full bg-red-200 group-hover:bg-red-500 transition-colors flex-shrink-0" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.15em]">Destinations</h4>
            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2.5">
              {destinations.map((d) => (
                <li key={d.name}>
                  <button
                    onClick={() => navigate('/packages', { state: { selectedDestination: d.id } })}
                    className="flex items-center gap-2 text-slate-500 text-xs hover:text-red-600 transition-colors group w-full text-left"
                  >
                    <div className="w-1 h-1 rounded-full bg-red-200 group-hover:bg-red-500 transition-colors flex-shrink-0" />
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Plan Trip CTA Card */}
          <div className="col-span-2 lg:col-span-2 space-y-3">
            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.15em]">Ready to Travel?</h4>
            <div className="bg-red-600 rounded-2xl p-5 space-y-3">
              <p className="text-white/90 text-xs leading-relaxed">
                Let our experts plan your perfect trip — fully customised to your dream.
              </p>
              <Link
                to="/plan-trip"
                className="flex items-center justify-between gap-2 bg-white text-red-600 text-xs font-bold px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                Plan My Trip
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-red-200 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-600 text-sm font-medium">
            © 2025 Wisdom Travel & Tours. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;