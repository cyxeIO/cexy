# Copilot Instructions for cexy.ai

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js application for cexy.ai that enables users to record, manage, and relive memories with blockchain-based storage and NFT minting on the Pi blockchain.

## Tech Stack
- **Frontend**: Next.js 15 with TypeScript, App Router, and Tailwind CSS
- **Backend**: Next.js API routes
- **Blockchain**: Pi blockchain integration with Pi SDK
- **Storage**: Arweave for decentralized storage
- **AI**: Google Cloud Vision API or Hugging Face for sentiment analysis
- **Database**: Azure SQL Database
- **Authentication**: Pi Wallet-based authentication
- **Styling**: Tailwind CSS

## Core Features
- Continuous audio/video recording via browser APIs
- AI-powered memory curation and sentiment analysis
- Blockchain-secured storage and NFT minting
- Pi token payments for premium features
- Privacy-first design with granular sharing controls
- Community features for sharing curated moments

## Development Guidelines
- Use TypeScript for all code
- Follow Next.js 15 App Router patterns
- Implement responsive design with Tailwind CSS
- Prioritize security and privacy in all features
- Use environment variables for sensitive configuration
- Follow React best practices and hooks patterns
- Implement proper error handling and loading states
- Use server components where appropriate for performance

## File Structure
- `/src/app` - App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and configurations
- `/src/hooks` - Custom React hooks
- `/src/types` - TypeScript type definitions
- `/src/blockchain` - Pi blockchain integration
- `/src/ai` - AI/ML related functions
- `/src/storage` - Arweave storage utilities

## API Routes
- `/api/auth` - Pi Wallet authentication
- `/api/memories` - Memory CRUD operations
- `/api/blockchain` - Blockchain interactions
- `/api/ai` - AI processing endpoints
- `/api/nft` - NFT minting and management
