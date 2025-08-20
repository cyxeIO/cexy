import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import Arweave from 'arweave';
import { StorageUploadResult, StorageConfig } from '@/types';

// IPFS Service using Helia
class IPFSService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private helia: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private fs: any = null;

  async initialize(): Promise<void> {
    try {
      this.helia = await createHelia();
      this.fs = unixfs(this.helia);
      console.log('IPFS service initialized');
    } catch (error) {
      console.error('Failed to initialize IPFS:', error);
      throw error;
    }
  }

  async uploadFile(file: Uint8Array, fileName: string): Promise<StorageUploadResult> {
    try {
      if (!this.fs) {
        await this.initialize();
      }

      const cid = await this.fs.addFile({
        path: fileName,
        content: file,
      });

      const hash = cid.toString();
      const url = `${process.env.IPFS_GATEWAY_URL}${hash}`;

      return {
        hash,
        url,
        size: file.length,
        type: 'ipfs',
      };
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw error;
    }
  }

  async uploadJson(data: object, fileName: string): Promise<StorageUploadResult> {
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(jsonString);
    
    return this.uploadFile(uint8Array, fileName);
  }

  async getFile(hash: string): Promise<Uint8Array> {
    try {
      if (!this.fs) {
        await this.initialize();
      }

      const chunks: Uint8Array[] = [];
      for await (const chunk of this.fs.cat(hash)) {
        chunks.push(chunk);
      }

      // Combine all chunks
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      return result;
    } catch (error) {
      console.error('IPFS download failed:', error);
      throw error;
    }
  }

  async pin(hash: string): Promise<boolean> {
    try {
      if (!this.fs) {
        await this.initialize();
      }

      // Pin the content to prevent garbage collection
      await this.helia.pins.add(hash);
      return true;
    } catch (error) {
      console.error('IPFS pinning failed:', error);
      return false;
    }
  }

  async shutdown(): Promise<void> {
    if (this.helia) {
      await this.helia.stop();
      this.helia = null;
      this.fs = null;
    }
  }
}

// Arweave Service
class ArweaveService {
  private arweave: Arweave;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private wallet: any = null;

  constructor() {
    this.arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });
  }

  async initialize(): Promise<void> {
    try {
      const walletKey = process.env.ARWEAVE_WALLET_KEY;
      if (walletKey) {
        this.wallet = JSON.parse(walletKey);
        console.log('Arweave service initialized');
      } else {
        console.warn('Arweave wallet key not provided');
      }
    } catch (error) {
      console.error('Failed to initialize Arweave:', error);
      throw error;
    }
  }

  async uploadFile(file: Uint8Array, contentType: string, tags: { name: string; value: string }[] = []): Promise<StorageUploadResult> {
    try {
      if (!this.wallet) {
        await this.initialize();
      }

      const transaction = await this.arweave.createTransaction({
        data: file,
      }, this.wallet);

      // Add content type tag
      transaction.addTag('Content-Type', contentType);
      
      // Add custom tags
      tags.forEach(tag => {
        transaction.addTag(tag.name, tag.value);
      });

      // Add cexy.ai specific tags
      transaction.addTag('App-Name', 'cexy.ai');
      transaction.addTag('App-Version', '1.0.0');
      transaction.addTag('Upload-Timestamp', new Date().toISOString());

      await this.arweave.transactions.sign(transaction, this.wallet);
      
      const response = await this.arweave.transactions.post(transaction);
      
      if (response.status === 200) {
        const id = transaction.id;
        const url = `https://arweave.net/${id}`;
        
        return {
          hash: id,
          url,
          size: file.length,
          type: 'arweave',
        };
      } else {
        throw new Error(`Arweave upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Arweave upload failed:', error);
      throw error;
    }
  }

  async uploadJson(data: object, tags: { name: string; value: string }[] = []): Promise<StorageUploadResult> {
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(jsonString);
    
    return this.uploadFile(uint8Array, 'application/json', tags);
  }

  async getFile(id: string): Promise<Uint8Array> {
    try {
      const response = await fetch(`https://arweave.net/${id}`);
      if (!response.ok) {
        throw new Error(`Arweave download failed with status ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (error) {
      console.error('Arweave download failed:', error);
      throw error;
    }
  }

  async getTransactionStatus(id: string): Promise<string> {
    try {
      const status = await this.arweave.transactions.getStatus(id);
      return status.status === 200 ? 'confirmed' : 'pending';
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      return 'unknown';
    }
  }

  async getWalletBalance(): Promise<number> {
    try {
      if (!this.wallet) {
        await this.initialize();
      }

      const address = await this.arweave.wallets.jwkToAddress(this.wallet);
      const winston = await this.arweave.wallets.getBalance(address);
      const ar = this.arweave.ar.winstonToAr(winston);
      
      return parseFloat(ar);
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return 0;
    }
  }
}

// Unified Storage Service
class StorageService {
  private ipfsService: IPFSService;
  private arweaveService: ArweaveService;
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.ipfsService = new IPFSService();
    this.arweaveService = new ArweaveService();
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      if (this.config.provider === 'ipfs' || this.config.provider === 'hybrid') {
        await this.ipfsService.initialize();
      }
      
      if (this.config.provider === 'arweave' || this.config.provider === 'hybrid') {
        await this.arweaveService.initialize();
      }
      
      console.log('Storage service initialized');
    } catch (error) {
      console.error('Failed to initialize storage service:', error);
      throw error;
    }
  }

  async uploadMemory(file: Uint8Array, metadata: object, contentType: string): Promise<{
    ipfs?: StorageUploadResult;
    arweave?: StorageUploadResult;
  }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any = {};

    try {
      // Encrypt file if required
      const processedFile = file;
      if (this.config.encryption) {
        // Implement encryption here
        console.log('Encryption not implemented yet');
      }

      // Upload to IPFS (fast, temporary)
      if (this.config.provider === 'ipfs' || this.config.provider === 'hybrid') {
        const fileName = `memory_${Date.now()}.${contentType.split('/')[1]}`;
        results.ipfs = await this.ipfsService.uploadFile(processedFile, fileName);
        
        // Pin the file for persistence
        await this.ipfsService.pin(results.ipfs.hash);
      }

      // Upload to Arweave (permanent, slower)
      if (this.config.provider === 'arweave' || this.config.provider === 'hybrid') {
        const tags = [
          { name: 'Memory-Metadata', value: JSON.stringify(metadata) },
          { name: 'Storage-Provider', value: 'cexy.ai' },
        ];
        
        results.arweave = await this.arweaveService.uploadFile(processedFile, contentType, tags);
      }

      return results;
    } catch (error) {
      console.error('Failed to upload memory:', error);
      throw error;
    }
  }

  async uploadNFTMetadata(metadata: object): Promise<StorageUploadResult> {
    try {
      // NFT metadata should be permanent, so prefer Arweave
      if (this.config.provider === 'arweave' || this.config.provider === 'hybrid') {
        const tags = [
          { name: 'Content-Type', value: 'nft-metadata' },
          { name: 'NFT-Standard', value: 'ERC-721' },
        ];
        
        return await this.arweaveService.uploadJson(metadata, tags);
      } else {
        const fileName = `nft_metadata_${Date.now()}.json`;
        return await this.ipfsService.uploadJson(metadata, fileName);
      }
    } catch (error) {
      console.error('Failed to upload NFT metadata:', error);
      throw error;
    }
  }

  async getFile(hash: string, provider: 'ipfs' | 'arweave'): Promise<Uint8Array> {
    try {
      if (provider === 'ipfs') {
        return await this.ipfsService.getFile(hash);
      } else {
        return await this.arweaveService.getFile(hash);
      }
    } catch (error) {
      console.error(`Failed to get file from ${provider}:`, error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    await this.ipfsService.shutdown();
  }
}

// Singleton instances
let ipfsService: IPFSService | null = null;
let arweaveService: ArweaveService | null = null;
let storageService: StorageService | null = null;

export function getIPFSService(): IPFSService {
  if (!ipfsService) {
    ipfsService = new IPFSService();
  }
  return ipfsService;
}

export function getArweaveService(): ArweaveService {
  if (!arweaveService) {
    arweaveService = new ArweaveService();
  }
  return arweaveService;
}

export function getStorageService(config?: StorageConfig): StorageService {
  if (!storageService) {
    const defaultConfig: StorageConfig = {
      provider: 'hybrid',
      encryption: true,
      redundancy: 2,
      retention: 'permanent',
    };
    
    storageService = new StorageService(config || defaultConfig);
  }
  return storageService;
}

export { IPFSService, ArweaveService, StorageService };
