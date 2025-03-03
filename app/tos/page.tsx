import React from "react";

export default function TermsOfService() {
  return (
    <div className="container mx-auto mt-8 p-4 text-white flex flex-col items-left justify-left min-h-screen text-left space-y-12">
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">
        <strong>Last Updated:</strong> March 3, 2025
      </p>

      {/* Terms of Acceptance Section */}
      <h2 className="text-2xl font-bold flex items-center mb-4">
        <span className="text-blue-400 text-2xl mr-2">|</span> Terms of Acceptance
      </h2>
      <p className="text-lg">
        Welcome to <strong>ChainSwitch Transaction Tracker</strong>, a platform designed to help users track and managing their cryptocurrency transactions. By accessing or using our website, services, and products (collectively, the "Services"), you will assume that you agree to oblige Terms of Service ("Terms").
      </p>

      {/* Use of Services Section */}
      <h2 className="text-2xl font-bold flex items-center mt-6 mb-4">
        <span className="text-blue-400 text-2xl mr-2">|</span> Use of Services
      </h2>
      <p className="text-lg">
        By using our Services, you agree to act in accordance with all applicable laws and regulations. You shall not:
      </p>
      <ul className="list-disc list-inside ml-6 text-lg">
        <li>Engage in any unlawful, fraudulent, or deceptive activities.</li>
        <li>Disrupt or interfere with our Services, servers, or network security.</li>
        <li>Attempt unauthorized access to any part of our platform.</li>
      </ul>

      {/* User Accounts Section */}
      <h2 className="text-2xl font-bold flex items-center mt-6 mb-4">
        <span className="text-blue-400 text-2xl mr-2">|</span> User Accounts
      </h2>
      <p className="text-lg">
        You might be required to create an account on ChainSwitch. You are responsible for keeping your login credentials secure and have responsible for all use of your own account. Any unauthorized access or security breaches must be reported to the website adminstrator via Contact.
      </p>

      {/* Termination Section */}
      <h2 className="text-2xl font-bold flex items-center mt-6 mb-4">
        <span className="text-blue-400 text-2xl mr-2">|</span> Termination of Service
      </h2>
      <p className="text-lg">
        We reserve the right to remove, change or terminate your access to our Services at our sole discretion, without prior notice, if we determine that you have inappropriate or obscene usersname.
      </p>

      {/* Changes to Terms Section */}
      <h2 className="text-2xl font-bold flex items-center mt-6 mb-4">
        <span className="text-blue-400 text-2xl mr-2">|</span> Changes to Terms
      </h2>
      <p className="text-lg">
        ChainSwitch may update these Terms periodically. Continued use of our Services after changes take effect constitutes your acceptance of the revised Terms.
      </p>

      {/* Contact Section */}
      <h2 className="text-2xl font-bold flex items-center mt-6 mb-4">
        <span className="text-blue-400 text-2xl mr-2">|</span> Contact Us
      </h2>
      <p className="text-lg">
        If you have any questions or concerns regarding these Terms, please reach to us at <strong>Contact</strong>.
      </p>
    </div>
  );
}
