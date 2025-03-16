
import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check, Menu, X, Moon, Sun, ArrowRight, Zap, Shield, BarChart, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { CustomLogo } from "@/components/custom-logo"

export default function Footer() {
    return (
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          {/* FOOTER CONTENT */}
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {/* BRAND INFO */}
            <div className="space-y-4">
              <CustomLogo
                text="ChainSwitch"
                letter="C"
                bgColor="bg-gradient-to-br from-red-400 to-red-300"
              />
              <p className="text-sm text-muted-foreground">
                Track cryptocurrency prices, convert between coins and fiat currencies, and check your wallet transactions—all in one place.
              </p>
              {/* SOCIAL LINKS */}
              <div className="flex gap-4">
                {[
                  { href: "#", icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", label: "Facebook" },
                  { href: "#", icon: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z", label: "Twitter" },
                  { href: "#", icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 4a2 2 0 1 1-2 2 2 2 0 0 1 2-2z", label: "LinkedIn" }
                ].map(({ href, icon, label }) => (
                  <Link key={label} href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                      <path d={icon} />
                    </svg>
                    <span className="sr-only">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
  
            {/* PLATFORM LINKS */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Platform</h4>
              <ul className="space-y-2 text-sm">
                {["Features", "Price Conversion", "About"].map((item) => (
                  <li key={item}>
                    <Link href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* LEGAL LINKS */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Legal</h4>
              <ul className="space-y-2 text-sm">
                {["Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
  
          {/* FOOTER BOTTOM */}
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ChainSwitch. All rights reserved.
            </p>
            <div className="flex gap-4">
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <Link key={item} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }
  