import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50">
      {/* Top Divider */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="border-t border-gray-300 w-full my-8"></div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
          {/* Logo and Quote */}
          <div className="space-y-4 mt-22">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              PawsToHome
            </Link>
            <p className="text-gray-600 w-55">
              Connecting loving homes with deserving pets. Every adoption
              creates a forever family.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              {[
                ["Find Pets", "/pets"],
                ["Find Shelters", "/shelters"],
                ["Posts", "/posts"],
                ["How To", "/guide"],
                ["About Us", "/about-us"],
                ["Legal", "/legal"],
              ].map(([title, url]) => (
                <li key={title}>
                  <Link to={url} className="text-gray-600 hover:text-blue-600">
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact and Newsletter */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Contact Us
              </h3>
              <p className="text-gray-600">
                Email:&nbsp;
                <a
                  href="mailto:contactpawstohome@gmail.com"
                  className="underline"
                >
                  contactpawstohome@gmail.com
                </a>
              </p>
              <p className="text-gray-600">
                Phone:&nbsp;
                <a href="tel:+91234567890" className="underline">
                  +91234567890
                </a>
              </p>
              <p className="text-gray-600">
                Address: 123 Pet Lane, Animal City, Country
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Subscribe to our newsletter
              </h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-1"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Divider */}
        <div className="border-t border-gray-300 w-full my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-8 space-y-4 md:space-y-0">
          <div className="text-gray-600">
            Copyright © {currentYear} PawsToHome | All Rights Reserved
          </div>

          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600"
            >
              <FaFacebook className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600"
            >
              <FaTwitter className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600"
            >
              <FaYoutube className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
