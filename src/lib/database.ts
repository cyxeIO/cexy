import sql from 'mssql';

const config: sql.config = {
  server: process.env.AZURE_SQL_SERVER!,
  database: process.env.AZURE_SQL_DATABASE!,
  user: process.env.AZURE_SQL_USERNAME!,
  password: process.env.AZURE_SQL_PASSWORD!,
  options: {
    encrypt: true, // Use encryption
    enableArithAbort: true,
    trustServerCertificate: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
  }
  return pool;
}

export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

// Database initialization script
export const initializeDatabase = async (): Promise<void> => {
  const connection = await getConnection();
  
  // Create tables if they don't exist
  const createTables = [
    `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
    CREATE TABLE users (
      id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      pi_wallet_address NVARCHAR(255) UNIQUE NOT NULL,
      username NVARCHAR(100) UNIQUE NOT NULL,
      email NVARCHAR(255),
      display_name NVARCHAR(255) NOT NULL,
      avatar NVARCHAR(500),
      bio NVARCHAR(1000),
      is_verified BIT DEFAULT 0,
      subscription_tier NVARCHAR(20) DEFAULT 'free',
      pi_token_balance DECIMAL(18,8) DEFAULT 0,
      preferences NVARCHAR(MAX), -- JSON
      stats NVARCHAR(MAX), -- JSON
      created_at DATETIME2 DEFAULT GETUTCDATE(),
      updated_at DATETIME2 DEFAULT GETUTCDATE()
    )
    `,
    `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='memories' AND xtype='U')
    CREATE TABLE memories (
      id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      user_id UNIQUEIDENTIFIER NOT NULL,
      title NVARCHAR(255) NOT NULL,
      description NVARCHAR(1000),
      type NVARCHAR(20) NOT NULL,
      duration INT,
      size BIGINT NOT NULL,
      tags NVARCHAR(MAX), -- JSON array
      sentiment NVARCHAR(MAX), -- JSON
      metadata NVARCHAR(MAX), -- JSON
      privacy_settings NVARCHAR(MAX), -- JSON
      blockchain_data NVARCHAR(MAX), -- JSON
      created_at DATETIME2 DEFAULT GETUTCDATE(),
      updated_at DATETIME2 DEFAULT GETUTCDATE(),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
    `,
    `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='recording_sessions' AND xtype='U')
    CREATE TABLE recording_sessions (
      id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      user_id UNIQUEIDENTIFIER NOT NULL,
      status NVARCHAR(20) NOT NULL DEFAULT 'recording',
      start_time DATETIME2 NOT NULL,
      end_time DATETIME2,
      duration INT DEFAULT 0,
      type NVARCHAR(20) NOT NULL,
      quality NVARCHAR(20) NOT NULL,
      temp_file_url NVARCHAR(500),
      estimated_cost DECIMAL(18,8) DEFAULT 0,
      created_at DATETIME2 DEFAULT GETUTCDATE(),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
    `,
    `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ai_analysis_jobs' AND xtype='U')
    CREATE TABLE ai_analysis_jobs (
      id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      memory_id UNIQUEIDENTIFIER NOT NULL,
      status NVARCHAR(20) NOT NULL DEFAULT 'pending',
      type NVARCHAR(50) NOT NULL,
      progress INT DEFAULT 0,
      result NVARCHAR(MAX), -- JSON
      error NVARCHAR(MAX),
      created_at DATETIME2 DEFAULT GETUTCDATE(),
      completed_at DATETIME2,
      FOREIGN KEY (memory_id) REFERENCES memories(id)
    )
    `,
    `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='communities' AND xtype='U')
    CREATE TABLE communities (
      id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      name NVARCHAR(255) NOT NULL,
      description NVARCHAR(1000),
      creator_id UNIQUEIDENTIFIER NOT NULL,
      is_public BIT DEFAULT 1,
      tags NVARCHAR(MAX), -- JSON array
      members NVARCHAR(MAX), -- JSON array of user IDs
      shared_memories NVARCHAR(MAX), -- JSON array of memory IDs
      created_at DATETIME2 DEFAULT GETUTCDATE(),
      FOREIGN KEY (creator_id) REFERENCES users(id)
    )
    `,
    `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pi_transactions' AND xtype='U')
    CREATE TABLE pi_transactions (
      id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
      identifier NVARCHAR(255) UNIQUE NOT NULL,
      user_id UNIQUEIDENTIFIER NOT NULL,
      amount DECIMAL(18,8) NOT NULL,
      memo NVARCHAR(500),
      metadata NVARCHAR(MAX), -- JSON
      from_address NVARCHAR(255),
      to_address NVARCHAR(255),
      direction NVARCHAR(20) NOT NULL,
      network NVARCHAR(50) NOT NULL,
      status NVARCHAR(MAX), -- JSON
      transaction_data NVARCHAR(MAX), -- JSON
      created_at DATETIME2 DEFAULT GETUTCDATE(),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
    `
  ];

  for (const query of createTables) {
    await connection.request().query(query);
  }

  // Create indexes for better performance
  const createIndexes = [
    'IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = \'IX_memories_user_id\') CREATE INDEX IX_memories_user_id ON memories(user_id)',
    'IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = \'IX_memories_created_at\') CREATE INDEX IX_memories_created_at ON memories(created_at)',
    'IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = \'IX_recording_sessions_user_id\') CREATE INDEX IX_recording_sessions_user_id ON recording_sessions(user_id)',
    'IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = \'IX_ai_analysis_jobs_memory_id\') CREATE INDEX IX_ai_analysis_jobs_memory_id ON ai_analysis_jobs(memory_id)',
    'IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = \'IX_pi_transactions_user_id\') CREATE INDEX IX_pi_transactions_user_id ON pi_transactions(user_id)',
  ];

  for (const query of createIndexes) {
    await connection.request().query(query);
  }

  console.log('Database initialized successfully');
};

// Utility functions for common database operations
export const dbUtils = {
  async findUserByWallet(walletAddress: string) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('walletAddress', sql.NVarChar, walletAddress)
      .query('SELECT * FROM users WHERE pi_wallet_address = @walletAddress');
    
    return result.recordset[0] || null;
  },

  async createUser(userData: {
    piWalletAddress: string;
    username: string;
    email: string;
    displayName: string;
    preferences: Record<string, unknown>;
    stats?: Record<string, unknown>;
  }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('piWalletAddress', sql.NVarChar, userData.piWalletAddress)
      .input('username', sql.NVarChar, userData.username)
      .input('email', sql.NVarChar, userData.email)
      .input('displayName', sql.NVarChar, userData.displayName)
      .input('preferences', sql.NVarChar, JSON.stringify(userData.preferences))
      .input('stats', sql.NVarChar, JSON.stringify(userData.stats || {}))
      .query(`
        INSERT INTO users (pi_wallet_address, username, email, display_name, preferences, stats)
        OUTPUT INSERTED.*
        VALUES (@piWalletAddress, @username, @email, @displayName, @preferences, @stats)
      `);
    
    return result.recordset[0];
  },

  async getMemoriesByUser(userId: string, limit: number = 20, offset: number = 0) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset)
      .query(`
        SELECT * FROM memories 
        WHERE user_id = @userId 
        ORDER BY created_at DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);
    
    return result.recordset;
  },

  async saveMemory(memoryData: {
    userId: number;
    title: string;
    description?: string;
    contentType: string;
    contentUrl?: string;
    type?: string;
    duration?: number;
    size?: number;
    tags?: string[];
    sentiment?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    privacyLevel: string;
    privacySettings?: Record<string, unknown>;
    blockchainData?: Record<string, unknown>;
    aiAnalysis?: Record<string, unknown>;
  }) {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('userId', sql.UniqueIdentifier, memoryData.userId)
      .input('title', sql.NVarChar, memoryData.title)
      .input('description', sql.NVarChar, memoryData.description)
      .input('type', sql.NVarChar, memoryData.type || memoryData.contentType)
      .input('duration', sql.Int, memoryData.duration || 0)
      .input('size', sql.BigInt, memoryData.size || 0)
      .input('tags', sql.NVarChar, JSON.stringify(memoryData.tags || []))
      .input('sentiment', sql.NVarChar, JSON.stringify(memoryData.sentiment || {}))
      .input('metadata', sql.NVarChar, JSON.stringify(memoryData.metadata || {}))
      .input('privacySettings', sql.NVarChar, JSON.stringify(memoryData.privacySettings || {}))
      .input('blockchainData', sql.NVarChar, JSON.stringify(memoryData.blockchainData || {}))
      .query(`
        INSERT INTO memories (user_id, title, description, type, duration, size, tags, sentiment, metadata, privacy_settings, blockchain_data)
        OUTPUT INSERTED.*
        VALUES (@userId, @title, @description, @type, @duration, @size, @tags, @sentiment, @metadata, @privacySettings, @blockchainData)
      `);
    
    return result.recordset[0];
  }
};

const databaseService = { getConnection, closeConnection, initializeDatabase, dbUtils };

export default databaseService;
