'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            Terms of Service
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
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using CEXY.ai ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Platform. These Terms constitute a legal agreement between you and CEXY.ai.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Platform Description</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                CEXY.ai is an AI-powered memory curation platform built on blockchain technology that allows users to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Record, store, and curate digital memories using artificial intelligence</li>
                <li>Create and mint Non-Fungible Tokens (NFTs) from memory content</li>
                <li>Participate in a decentralized ecosystem powered by the Pi Network blockchain</li>
                <li>Access beta features during the development phase</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Beta Program and Limited Liability</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">3.1 Beta Status</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                CEXY.ai is currently in BETA phase. By participating in our beta program, you acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>The Platform is experimental and under active development</li>
                <li>Features may be incomplete, unstable, or subject to significant changes</li>
                <li>Data loss, service interruptions, or technical failures may occur</li>
                <li>Beta access does not guarantee continued access to the Platform</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">3.2 Beta Registration Payment</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Beta registration requires a payment of 0.01 Pi tokens. This payment:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Grants access to beta features only</li>
                <li>Is non-refundable under any circumstances</li>
                <li>Does not guarantee any specific features or functionality</li>
                <li>Does not create any obligation for us to provide ongoing services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. NFT Terms and Blockchain Assets</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">4.1 NFT Creation and Ownership</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                When you create NFTs through CEXY.ai:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>You receive exactly what is minted - an NFT representing your memory content</li>
                <li>Ownership is recorded on the blockchain and cannot be altered by us</li>
                <li>NFT value, if any, is determined solely by market forces</li>
                <li>We make no representations about NFT value, utility, or future prospects</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">4.2 Blockchain Immutability</h3>
              <p className="text-gray-300 leading-relaxed">
                All blockchain transactions are permanent and irreversible. We cannot:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Reverse, cancel, or modify blockchain transactions</li>
                <li>Recover lost private keys or wallet access</li>
                <li>Restore NFTs sent to incorrect addresses</li>
                <li>Guarantee blockchain network availability or performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. User Responsibilities</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">5.1 Account Security</h3>
              <p className="text-gray-300 leading-relaxed mb-4">You are solely responsible for:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Maintaining the security of your Pi Network wallet and private keys</li>
                <li>All activities that occur under your account</li>
                <li>Keeping your login credentials confidential</li>
                <li>Immediately notifying us of any unauthorized account access</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">5.2 Content Guidelines</h3>
              <p className="text-gray-300 leading-relaxed mb-4">When uploading content to CEXY.ai, you must not:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Upload illegal, harmful, or infringing content</li>
                <li>Violate any third-party rights or privacy</li>
                <li>Upload malicious code or attempt to harm the Platform</li>
                <li>Engage in spam, fraud, or deceptive practices</li>
                <li>Use the Platform for any unlawful purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. AI and Data Processing</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">6.1 AI Processing Consent</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                By using CEXY.ai, you consent to AI processing of your content for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Memory curation and sentiment analysis</li>
                <li>Content organization and recommendation</li>
                <li>NFT generation and metadata creation</li>
                <li>Platform improvement (with anonymized data)</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">6.2 AI Limitations</h3>
              <p className="text-gray-300 leading-relaxed">
                AI-generated content and analysis are provided "as is" without warranties. AI outputs may be inaccurate, biased, or inappropriate. You should review all AI-generated content before use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. DISCLAIMER OF WARRANTIES</h2>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-red-400">THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.</strong>
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT</li>
                  <li>ACCURACY, RELIABILITY, OR COMPLETENESS OF AI-GENERATED CONTENT</li>
                  <li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
                  <li>SECURITY OF DATA OR BLOCKCHAIN TRANSACTIONS</li>
                  <li>VALUE OR UTILITY OF NFTs OR DIGITAL ASSETS</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. LIMITATION OF LIABILITY</h2>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-red-400">TO THE MAXIMUM EXTENT PERMITTED BY LAW, CEXY.AI SHALL NOT BE LIABLE FOR ANY DAMAGES WHATSOEVER.</strong>
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  THIS INCLUDES, BUT IS NOT LIMITED TO:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
                  <li>LOSS OF DATA, PROFITS, REVENUE, OR BUSINESS OPPORTUNITIES</li>
                  <li>PERSONAL INJURY OR PROPERTY DAMAGE</li>
                  <li>FAILED BLOCKCHAIN TRANSACTIONS OR LOST CRYPTOCURRENCY</li>
                  <li>NFT VALUE FLUCTUATIONS OR MARKET LOSSES</li>
                  <li>AI PROCESSING ERRORS OR CONTENT MISINTERPRETATION</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  YOUR SOLE REMEDY IS TO DISCONTINUE USE OF THE PLATFORM. IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID FOR BETA ACCESS.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Indemnification</h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to indemnify, defend, and hold harmless CEXY.ai, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including attorney fees) arising from:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li>Your use or misuse of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your content or NFTs created through the Platform</li>
                <li>Your violation of any third-party rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Blockchain and Cryptocurrency Risks</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">10.1 Inherent Risks</h3>
              <p className="text-gray-300 leading-relaxed mb-4">You acknowledge that blockchain and cryptocurrency involve significant risks:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Extreme price volatility and potential total loss of value</li>
                <li>Regulatory uncertainty and potential legal changes</li>
                <li>Technical vulnerabilities and smart contract bugs</li>
                <li>Network congestion and high transaction fees</li>
                <li>Irreversible transactions and lost access risks</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">10.2 No Investment Advice</h3>
              <p className="text-gray-300 leading-relaxed">
                Nothing on the Platform constitutes investment, financial, or legal advice. You should consult qualified professionals before making any blockchain-related decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Intellectual Property</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">11.1 User Content</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You retain ownership of your original content but grant us a license to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Process your content through our AI systems</li>
                <li>Store and display your content on the Platform</li>
                <li>Create NFTs and blockchain records from your content</li>
                <li>Use anonymized data for platform improvement</li>
              </ul>

              <h3 className="text-xl font-medium text-purple-400 mb-3">11.2 Platform Rights</h3>
              <p className="text-gray-300 leading-relaxed">
                All Platform technology, including AI models, software, and design elements, remain our exclusive property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may terminate or suspend your access immediately, without notice, for any reason, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Violation of these Terms</li>
                <li>Suspicious or fraudulent activity</li>
                <li>Legal or regulatory requirements</li>
                <li>Platform discontinuation</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Upon termination, your right to use the Platform ceases immediately. Blockchain-recorded data and NFTs remain unaffected by account termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law and Disputes</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">13.1 Governing Law</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                These Terms are governed by the laws of [Jurisdiction], without regard to conflict of law principles.
              </p>

              <h3 className="text-xl font-medium text-purple-400 mb-3">13.2 Dispute Resolution</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Any disputes shall be resolved through binding arbitration rather than in court, except for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Claims that may be brought in small claims court</li>
                <li>Injunctive relief for intellectual property violations</li>
                <li>Claims that cannot be arbitrated under applicable law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We may modify these Terms at any time by posting updated terms on the Platform. Your continued use after changes constitutes acceptance of the new Terms. If you disagree with changes, you must stop using the Platform immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">15. Miscellaneous</h2>
              
              <h3 className="text-xl font-medium text-purple-400 mb-3">15.1 Severability</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                If any provision of these Terms is found unenforceable, the remaining provisions continue in full force.
              </p>

              <h3 className="text-xl font-medium text-purple-400 mb-3">15.2 Entire Agreement</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                These Terms constitute the entire agreement between you and CEXY.ai regarding the Platform.
              </p>

              <h3 className="text-xl font-medium text-purple-400 mb-3">15.3 Assignment</h3>
              <p className="text-gray-300 leading-relaxed">
                We may assign these Terms without notice. You may not assign your rights under these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">16. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                For questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-900/50 rounded-lg p-4 mt-4">
                <p className="text-white font-medium">CEXY.ai Legal Team</p>
                <p className="text-gray-300">Email: legal@cexy.ai</p>
                <p className="text-gray-300">For urgent legal matters: Include "URGENT LEGAL" in subject line</p>
              </div>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mt-6">
                <p className="text-yellow-300 font-medium mb-2">⚠️ IMPORTANT NOTICE:</p>
                <p className="text-gray-300 text-sm">
                  By using CEXY.ai, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                  You understand that this is a beta platform with inherent risks, and that CEXY.ai is not liable for any damages or losses.
                </p>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
