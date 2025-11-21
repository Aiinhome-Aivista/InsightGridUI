import React from 'react'

/**
 * Footer Component
 * 
 * Sticky footer displayed at the bottom of all dashboard pages
 * Contains copyright, links, and additional information
 */
function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Left Section - Copyright */}
                    <div className="text-sm text-gray-600">
                        © {currentYear} <span className="font-semibold text-gray-800">VendorApp</span>. All rights reserved.
                    </div>

                    {/* Center Section - Links */}
                    <div className="flex items-center space-x-6 mt-3 md:mt-0">
                        <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                            About
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                            Support
                        </a>
                    </div>

                    {/* Right Section - Version */}
                    <div className="text-sm text-gray-500 mt-3 md:mt-0">
                        Version 1.0.0
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
