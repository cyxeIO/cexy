'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to CEXY
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-400 mt-2">Last updated: August 20, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none"
        >
          <div className="space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Welcome to CEXY.ai ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered memory curation platform built on blockchain technology. By using CEXY.ai, you consent to the data practices described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">2.1 Blockchain Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Pi Network wallet addresses and transaction data</li>
                <li>Smart contract interactions and blockchain events</li>
                <li>NFT ownership and transfer records</li>
                <li>Cryptocurrency payment information</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">2.2 AI and Memory Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Audio and video recordings you choose to upload</li>
                <li>AI-generated sentiment analysis and memory curation</li>
                <li>Metadata associated with your memories (timestamps, locations if provided)</li>
                <li>User preferences and AI model interactions</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">2.3 Technical Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Device information, browser type, and operating system</li>
                <li>IP addresses and usage analytics</li>
                <li>Cookies and local storage data</li>
                <li>Performance metrics and error logs</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">2.4 User Account Information</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Pi Network username and authentication data</li>
                <li>Beta registration information</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">3.1 Core Platform Functions</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Processing and curating your memories using AI technology</li>
                <li>Creating and managing NFTs from your memory content</li>
                <li>Facilitating blockchain transactions and smart contract execution</li>
                <li>Providing secure, decentralized storage solutions</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">3.2 AI Enhancement</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Training and improving our AI models (with anonymized data)</li>
                <li>Personalizing your memory curation experience</li>
                <li>Sentiment analysis and content recommendation</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">3.3 Platform Operations</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Maintaining platform security and preventing fraud</li>
                <li>Providing customer support and technical assistance</li>
                <li>Analyzing usage patterns to improve our services</li>
                <li>Complying with legal obligations and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Blockchain and Decentralization</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                As a blockchain-based platform, certain information is inherently public and immutable:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Transaction records on the Pi Network blockchain are publicly visible</li>
                <li>NFT metadata may be stored on decentralized networks (Arweave)</li>
                <li>Smart contract interactions are recorded permanently on the blockchain</li>
                <li>Once data is recorded on blockchain, it cannot be modified or deleted</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">5.1 We Do Not Sell Personal Data</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>

              <h3 className="text-xl font-medium text-purple-400 mb-3">5.2 Limited Sharing Scenarios</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>With your explicit consent for specific features</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>With service providers bound by confidentiality agreements</li>
                <li>In connection with business transfers or mergers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>End-to-end encryption for sensitive data transmission</li>
                <li>Secure storage protocols for off-chain data</li>
                <li>Multi-signature wallet security for blockchain transactions</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication mechanisms</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights and Choices</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">7.1 Access and Control</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Request access to your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete certain data (subject to blockchain immutability)</li>
                <li>Export your data in portable formats</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">7.2 Blockchain Limitations</h3>
              <p className="text-gray-300 leading-relaxed">
                Data recorded on blockchain networks cannot be modified or deleted. This includes transaction records, NFT ownership, and smart contract interactions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. AI and Machine Learning</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our AI systems process your memory content to provide curation services. We:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Use anonymized data to improve AI model performance</li>
                <li>Implement privacy-preserving machine learning techniques</li>
                <li>Allow you to opt-out of AI model training</li>
                <li>Provide transparency about AI decision-making processes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                As a decentralized platform, your data may be processed and stored across multiple jurisdictions. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                CEXY.ai is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware of such data collection, we will take steps to delete the information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date. Your continued use of CEXY.ai after changes become effective constitutes acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-900/50 rounded-lg p-4 mt-4">
                <p className="text-white font-medium">CEXY.ai Privacy Team</p>
                <p className="text-gray-300">Email: privacy@cexy.ai</p>
                <p className="text-gray-300">For urgent privacy matters: Include "URGENT PRIVACY" in subject line</p>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
