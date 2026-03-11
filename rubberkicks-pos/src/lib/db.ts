import { promises as fs } from 'fs';
import path from 'path';

// Determine storage type
const isProduction = process.env.NODE_ENV === 'production';
const hasFileSystem = typeof process !== 'undefined' && process.versions?.node;

// For Vercel serverless, we'll use /tmp directory which is writable
const DATA_DIR = isProduction 
  ? path.join('/tmp', 'pos-data')
  : path.join(process.cwd(), 'data');

// In-memory cache for data (important for serverless)
let memoryCache: { [key: string]: any } = {};
let cacheInitialized = false;

// Ensure data directory exists
async function ensureDataDir() {
  if (!hasFileSystem) return;
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// File-based storage with memory cache
export async function getFromFile<T>(key: string): Promise<T | null> {
  // Return from memory cache if available
  if (memoryCache[key]) {
    return memoryCache[key];
  }

  if (!hasFileSystem) return null;

  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, `${key}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Cache in memory
    memoryCache[key] = parsed;
    return parsed;
  } catch (error) {
    return null;
  }
}

export async function setToFile<T>(key: string, value: T): Promise<void> {
  // Always update memory cache
  memoryCache[key] = value;

  if (!hasFileSystem) return;

  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, `${key}.json`);
    await fs.writeFile(filePath, JSON.stringify(value, null, 2));
  } catch (error) {
    console.error('Error writing to file:', error);
    // Don't throw - memory cache is still updated
  }
}

// Unified storage interface (uses memory cache + file persistence)
export async function getData<T>(key: string): Promise<T | null> {
  return await getFromFile<T>(key);
}

export async function setData<T>(key: string, value: T): Promise<void> {
  await setToFile(key, value);
}

// Initialize with default data if needed
export async function initializeData() {
  if (cacheInitialized) return;

  const inventory = await getData('inventory');
  
  if (!inventory) {
    const defaultInventory = [
      { 
        id: '1', 
        name: 'Classic Rain Boot', 
        category: 'Boots', 
        price: 45.99, 
        stock: 15, 
        size: '8-12', 
        color: 'Black' 
      },
      { 
        id: '2', 
        name: 'Sport Sneaker', 
        category: 'Sneakers', 
        price: 65.99, 
        stock: 8, 
        size: '7-11', 
        color: 'White' 
      },
      { 
        id: '3', 
        name: 'Garden Clog', 
        category: 'Clogs', 
        price: 29.99, 
        stock: 20, 
        size: '6-10', 
        color: 'Green' 
      },
      { 
        id: '4', 
        name: 'Beach Sandal', 
        category: 'Sandals', 
        price: 24.99, 
        stock: 25, 
        size: '5-12', 
        color: 'Blue' 
      },
      { 
        id: '5', 
        name: 'Work Boot', 
        category: 'Boots', 
        price: 79.99, 
        stock: 5, 
        size: '9-13', 
        color: 'Brown' 
      },
    ];
    
    await setData('inventory', defaultInventory);
    await setData('sales', []);
  }

  cacheInitialized = true;
}
