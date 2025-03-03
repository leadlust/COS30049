import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-800/70 to-blue-900/70 text-white py-4 px-6 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center text-sm">
        <p>&copy; 2025 ChainSwitch. All rights reserved.</p>
        <div className="space-x-4">
          <Link href="/tos">Terms of Services</Link>
          <Link href="/aboutus">About Us</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  )
}

