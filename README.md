# cexy.ai - Memory Recording and NFT Platform

A Next.js application that enables users to record, manage, and relive memories with blockchain-based storage and NFT minting on the Pi blockchain.

## 🌟 Features

### Core Functionality
- **Smart Recording**: Continuous audio/video recording via browser APIs with intelligent quality detection
- **AI-Powered Curation**: Sentiment analysis, automatic categorization, and highlight detection
- **Blockchain Security**: Decentralized storage on Arweave anchored on Pi blockchain
- **NFT Minting**: Convert precious memories into NFTs with rarity based on AI analysis
- **Pi Token Integration**: Pay for premium features and earn rewards with Pi tokens
- **Privacy-First Design**: Granular sharing controls and data anonymization options

### Technology Stack
- **Frontend**: Next.js 15 with TypeScript, App Router, and Tailwind CSS
- **Backend**: Next.js API routes with Azure SQL Database
- **Blockchain**: Pi Network integration for wallet authentication and payments
- **Storage**: Arweave for decentralized permanent storage
- **AI Services**: Hugging Face Inference API for sentiment analysis and content processing
- **Database**: Azure SQL Database with comprehensive schema
- **UI**: Framer Motion animations, Lucide React icons, React Hot Toast notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Azure SQL Database (for production)
- Hugging Face API key
- Pi Network developer account (for production)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cexy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Pi Network Configuration
PI_API_KEY=your_pi_api_key_here
PI_WALLET_PRIVATE_KEY=your_pi_wallet_private_key_here

# Azure SQL Database
AZURE_SQL_SERVER=your_server.database.windows.net
AZURE_SQL_DATABASE=cexy_memories
AZURE_SQL_USERNAME=your_username
AZURE_SQL_PASSWORD=your_password

# AI Services
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Storage Configuration
# Remove IPFS Gateway URL environment variable (no longer needed)
# IPFS_GATEWAY_URL=https://ipfs.io/ipfs/
ARWEAVE_WALLET_KEY=your_arweave_wallet_key_here
```

5. Initialize the database:
```bash
npm run db:init
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### For Users
1. **Connect Pi Wallet**: Click "Connect Pi Wallet" to authenticate with your Pi Network account
2. **Record Memories**: Use the recording controls to capture audio or video memories
3. **AI Processing**: Memories are automatically analyzed for sentiment, keywords, and highlights
4. **Manage Privacy**: Control who can see your memories with granular privacy settings
5. **Mint NFTs**: Convert special memories into NFTs on the Pi blockchain
6. **Earn Rewards**: Receive Pi tokens for high-quality, engaging memories

### For Developers
- **API Routes**: RESTful endpoints for authentication, memory management, and blockchain operations
- **Database Schema**: Comprehensive SQL schema for users, memories, and transactions
- **AI Integration**: Modular AI services for sentiment analysis and content processing
- **Storage Services**: Unified interface for Arweave storage
- **Pi Network SDK**: Integration layer for wallet authentication and payments

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication routes
│   │   └── memories/      # Memory management routes
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main application page
├── components/            # Reusable React components
│   ├── MemoryCard.tsx     # Memory display component
│   └── RecordingControls.tsx # Audio/video recording interface
├── lib/                   # Core application logic
│   ├── ai.ts             # AI processing services
│   ├── database.ts       # Azure SQL Database utilities
│   ├── pi-network.ts     # Pi Network SDK integration
│   └── storage.ts        # Arweave storage services
└── types/                 # TypeScript type definitions
    └── index.ts           # Core application types
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Database Management
The application uses Azure SQL Database with automatic schema initialization. Key tables:
- `users` - User profiles and Pi wallet information
- `memories` - Memory metadata and blockchain references
- `recording_sessions` - Active recording session tracking
- `ai_analysis_jobs` - AI processing job queue
- `pi_transactions` - Pi Network payment tracking

### AI Processing Pipeline
1. **Audio Transcription**: Convert speech to text using Whisper
2. **Sentiment Analysis**: Analyze emotional content and confidence
3. **Object Detection**: Identify objects and scenes in video content
4. **Highlight Detection**: Find emotionally significant moments
5. **Categorization**: Automatically tag memories by content type
6. **Rarity Calculation**: Determine NFT rarity based on multiple factors

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Deploy the `.next` folder to your hosting provider
3. Ensure environment variables are properly configured
4. Set up Azure SQL Database with provided schema

## 🔐 Security Considerations

- **Environment Variables**: Never commit sensitive keys to version control
- **Pi Wallet Security**: Private keys should be securely stored and encrypted
- **Database Security**: Use Azure SQL firewall rules and encrypted connections
- **File Upload Validation**: Implement proper file type and size validation
- **Rate Limiting**: Consider implementing rate limiting for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the API documentation at `/api/docs` (when implemented)

## 🔮 Future Roadmap

- [ ] Wearable device integration (Apple Watch, smartglasses)
- [ ] Advanced AI models for better content understanding
- [ ] Social features and community marketplace
- [ ] Mobile app development (React Native)
- [ ] Integration with other blockchain networks
- [ ] Advanced privacy features with zero-knowledge proofs
- [ ] Real-time streaming and live memory sharing
- [ ] VR/AR memory playback experiences

---

Built with ❤️ for the Pi Network community
