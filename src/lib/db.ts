// IndexedDB wrapper for offline storage
const DB_NAME = 'efactura_db';
const DB_VERSION = 1;

export interface StoredInvoice {
  id: string;
  type: string;
  series: string;
  number: string;
  client: string;
  date: string;
  total: number;
  status: 'draft' | 'pending' | 'submitted' | 'rejected';
  lines: InvoiceLine[];
  createdAt: string;
  syncedAt?: string;
}

export interface InvoiceLine {
  product: string;
  quantity: number;
  price: number;
  iva: number;
  total: number;
}

export interface AGTSubmission {
  id: string;
  invoiceId: string;
  payload: any;
  status: 'pending' | 'success' | 'error';
  response?: any;
  error?: string;
  attempts: number;
  createdAt: string;
  lastAttempt?: string;
}

class Database {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('invoices')) {
          const invoiceStore = db.createObjectStore('invoices', { keyPath: 'id' });
          invoiceStore.createIndex('status', 'status', { unique: false });
          invoiceStore.createIndex('date', 'date', { unique: false });
        }

        if (!db.objectStoreNames.contains('submissions')) {
          const submissionStore = db.createObjectStore('submissions', { keyPath: 'id' });
          submissionStore.createIndex('status', 'status', { unique: false });
          submissionStore.createIndex('invoiceId', 'invoiceId', { unique: false });
        }
      };
    });
  }

  async addInvoice(invoice: StoredInvoice): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['invoices'], 'readwrite');
      const store = transaction.objectStore('invoices');
      const request = store.add(invoice);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateInvoice(invoice: StoredInvoice): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['invoices'], 'readwrite');
      const store = transaction.objectStore('invoices');
      const request = store.put(invoice);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getInvoices(): Promise<StoredInvoice[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['invoices'], 'readonly');
      const store = transaction.objectStore('invoices');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addSubmission(submission: AGTSubmission): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['submissions'], 'readwrite');
      const store = transaction.objectStore('submissions');
      const request = store.add(submission);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateSubmission(submission: AGTSubmission): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['submissions'], 'readwrite');
      const store = transaction.objectStore('submissions');
      const request = store.put(submission);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSubmissions(): Promise<AGTSubmission[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['submissions'], 'readonly');
      const store = transaction.objectStore('submissions');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingSubmissions(): Promise<AGTSubmission[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['submissions'], 'readonly');
      const store = transaction.objectStore('submissions');
      const index = store.index('status');
      const request = index.getAll('pending');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getFailedSubmissions(): Promise<AGTSubmission[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['submissions'], 'readonly');
      const store = transaction.objectStore('submissions');
      const index = store.index('status');
      const request = index.getAll('error');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new Database();
