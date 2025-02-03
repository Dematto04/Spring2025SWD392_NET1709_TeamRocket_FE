import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="pt-12">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Platform Intro */}
          <div>
            <Logo/>
            <p className="mt-4 text-sm">
              Your trusted platform for professional home services. Book skilled housekeepers with ease and ensure your
              home stays fresh and clean.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Our Services</a></li>
              <li><a href="#" className="hover:underline">Pricing</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><MapPin size={16} /> 123 Main Street, City, Country</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +1 234 567 890</li>
              <li className="flex items-center gap-2"><Mail size={16} /> support@homeservice.com</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-4">
              <a href="#"><Facebook /></a>
              <a href="#"><Twitter /></a>
              <a href="#"><Instagram /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-primary-foreground/30 pt-4 text-center text-sm">
          © {new Date().getFullYear()} HomeService. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
