interface Registration {
  registrationId: string;
  username: string;
  userId: string;
  walletAddress: string;
  transactionId: string;
  paymentId: string;
  amount: number;
  timestamp?: number;
}

interface MetricsData {
  totalRegistrations: number;
  totalEarnings: number;
  recentActivity: Array<{
    id: string;
    username: string;
    timestamp: number;
    amount: number;
  }>;
  lastUpdated: number;
}

// In-memory storage for registrations (in production, use a database)
let registrationDatabase: Registration[] = [];

export function addRegistration(registration: Registration): void {
  const newRegistration = {
    ...registration,
    timestamp: registration.timestamp || Date.now()
  };
  
  registrationDatabase.push(newRegistration);
  console.log('📊 Registration added to metrics:', newRegistration);
}

export function getMetrics(): MetricsData {
  const now = Date.now();
  const totalRegistrations = registrationDatabase.length;
  const totalEarnings = registrationDatabase.reduce((sum, reg) => sum + reg.amount, 0);
  
  // Get recent activity (last 10 registrations)
  const recentActivity = registrationDatabase
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 10)
    .map(reg => ({
      id: reg.registrationId,
      username: reg.username,
      timestamp: reg.timestamp || now,
      amount: reg.amount
    }));

  return {
    totalRegistrations,
    totalEarnings: Math.round(totalEarnings * 100) / 100, // Round to 2 decimals
    recentActivity,
    lastUpdated: now
  };
}

export function getAllRegistrations(): Registration[] {
  return [...registrationDatabase];
}
