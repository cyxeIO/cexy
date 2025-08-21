// Shared metrics service for registration tracking
import fs from 'fs';
import path from 'path';

interface Registration {
  registrationId: string;
  username: string;
  userId: string;
  walletAddress: string;
  transactionId: string;
  paymentId: string;
  amount: number;
  timestamp: number;
}

// File-based storage for development persistence
const DATA_FILE = path.join(process.cwd(), 'registrations.json');

// Load registrations from file or initialize empty array
function loadRegistrations(): Registration[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading registrations:', error);
  }
  return [];
}

// Save registrations to file
function saveRegistrations(registrations: Registration[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(registrations, null, 2));
  } catch (error) {
    console.error('Error saving registrations:', error);
  }
}

// In-memory storage for registrations (in production, use a database)
// NO MOCK DATA - only real blockchain registrations
let registrationDatabase: Registration[] = loadRegistrations();

export function addRegistration(registration: Omit<Registration, 'timestamp'>): void {
  const newRegistration = {
    ...registration,
    timestamp: Date.now()
  };
  
  registrationDatabase.push(newRegistration);
  saveRegistrations(registrationDatabase);
  console.log('📊 Registration added to metrics database:', newRegistration);
}

export function getRegistrations(): Registration[] {
  return [...registrationDatabase];
}

export function getMetrics() {
  const now = Date.now();
  const todayStart = new Date().setHours(0, 0, 0, 0);
  
  const totalRegistrations = registrationDatabase.length;
  const todayRegistrations = registrationDatabase.filter(reg => reg.timestamp >= todayStart).length;
  const totalPiVolume = registrationDatabase.reduce((sum, reg) => sum + reg.amount, 0);
  
  // Get recent registrations (last 10)
  const recentRegistrations = registrationDatabase
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    .map(reg => ({
      registrationId: reg.registrationId,
      username: reg.username,
      walletAddress: reg.walletAddress,
      transactionId: reg.transactionId,
      timestamp: reg.timestamp,
      amount: reg.amount
    }));

  return {
    totalRegistrations,
    todayRegistrations,
    totalPiVolume: Math.round(totalPiVolume * 100) / 100,
    recentRegistrations
  };
}
