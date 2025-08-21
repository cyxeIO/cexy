# Pi Network Integration Setup Guide

## Overview
This guide helps you set up and test the Pi Network integration in your cexy.ai application using real Pi Network authentication.

## Prerequisites

### 1. Pi Browser (Required)
For Pi Network integration, you need:

**Pi Browser (Required)**
- Download Pi Browser from the Pi Network app
- Navigate to your application URL within Pi Browser
- Pi SDK will work natively with real authentication

### 2. Pi Network Account
- Create a Pi Network account at https://minepi.com
- Complete KYC verification if required
- Ensure your account is in good standing

## Current Configuration

The project is configured for real Pi Network integration with:

### Environment Variables
```bash
# Pi SDK Configuration - Real Pi Network
NEXT_PUBLIC_PI_SDK_VERSION=2.0
NEXT_PUBLIC_PI_SANDBOX_MODE=false
NEXT_PUBLIC_PI_TESTNET_MODE=true
```

### SDK Initialization
- Real Pi SDK loading without sandbox mode
- Proper error handling and logging
- Event-driven SDK ready detection
- Real Pi Network authentication

## Testing Steps

### 1. Check Pi SDK Status
1. Open your app at `http://localhost:3000`
2. Open browser developer console (F12)
3. Look for Pi SDK loading logs:
   ```
   Pi SDK Environment Configuration: {backendURL: "...", sandbox: true, testnet: true}
   Pi SDK script loaded
   Pi SDK initialized with config: {version: "2.0", sandbox: true}
   ```

### 2. Test Pi Authentication
1. Visit the test page: `http://localhost:3000/test`
2. Check the "Pi SDK Test" section
3. Click "Test Pi Authentication"
4. Should see Pi authentication dialog (in Pi Browser) or sandbox simulation

### 3. Main App Testing
1. Visit main page: `http://localhost:3000`
2. Look for "Pi Testnet" indicator in header
3. Click "Sign In with Pi Network" button
4. Should trigger Pi authentication flow

## Expected Behavior

### In Pi Browser
- Pi SDK loads automatically
- Authentication opens Pi Network dialog
- Returns user data and access token

### In Regular Browser (Sandbox Mode)
- Pi SDK loads in sandbox mode
- Mock authentication for development
- Simulates Pi Network responses

## Troubleshooting

### Pi SDK Not Loading
1. Check console for errors
2. Verify network connection
3. Try refreshing the page
4. Check if using HTTPS (required for some Pi features)

### Authentication Fails
1. Ensure you're in Pi Browser or sandbox mode is enabled
2. Check Pi Network account status
3. Verify API keys and configuration
4. Check browser console for detailed error messages

### Network Issues
1. Verify internet connection
2. Check if Pi Network services are accessible
3. Try using a VPN if in a restricted region

## API Endpoints

The following API endpoints are configured for Pi Network:

- `POST /api/pi-register` - User registration with Pi authentication
- `POST /api/payments/incomplete` - Handle incomplete payments
- `POST /api/payments/approve` - Approve payments
- `POST /api/payments/complete` - Complete payments
- `POST /api/payments/cancel` - Cancel payments

## Development Tips

### Console Debugging
Enable verbose logging by opening browser console and checking for:
- Pi SDK loading status
- Authentication attempts
- API call responses
- Error messages

### Testing Payments
Use small amounts for testing:
- Minimum: 0.01 Pi
- Recommended test amount: 1 Pi
- Always test in sandbox mode first

### Mock Data
For development without Pi Browser, the app provides:
- Mock authentication responses
- Simulated user data
- Test payment flows

## Security Notes

- Never commit real Pi API keys to version control
- Use environment variables for all sensitive data
- Test thoroughly in sandbox before production
- Validate all Pi authentication tokens server-side

## Next Steps

1. Test the current setup with the steps above
2. If using Pi Browser, install it and test directly
3. For production, get real Pi Network API credentials
4. Submit your app for Pi Network app review process

## Resources

- [Pi Network Developer Guide](https://pi-apps.github.io/community-developer-guide/)
- [Pi SDK Documentation](https://github.com/pi-apps/pi-platform-docs)
- [Pi Network Testnet](https://testnet.minepi.com)
