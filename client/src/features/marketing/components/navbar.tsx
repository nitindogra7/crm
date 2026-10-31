"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { marketingData } from "../data";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 15;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { navbar, brand } = marketingData;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04)] py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8 lg:gap-11">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-slate-900 group transition-transform active:scale-95"
            aria-label={brand.ariaLabel}
          >
            {/* Infraly Logo Mark */}
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <Image
                src="/favicon.ico"
                alt="Infraly"
                width={32}
                height={32}
                unoptimized
                className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <span className="text-[19px] font-bold tracking-tight text-slate-900 font-heading">
              {navbar.brandName}
            </span>
          </Link>

          {/* Desktop Navigation Links directly beside brand */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium text-slate-700">
            {navbar.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-slate-950 transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors px-3 py-1.5"
          >
            {navbar.loginText}
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] active:scale-95 inline-flex items-center justify-center"
          >
            {navbar.ctaText}
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-700">
            {navbar.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="py-1 hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <Link
              href="/sign-in"
              className="text-center py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              {navbar.loginText}
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition-all text-center block"
            >
              {navbar.ctaText}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
