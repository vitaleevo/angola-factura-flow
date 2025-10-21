self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-invoices') {
    event.waitUntil(handleInvoiceSync());
  }
});

async function handleInvoiceSync() {
  const db = await openDB('efactura_offline', 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('pending')) {
        database.createObjectStore('pending', { keyPath: 'id', autoIncrement: true });
      }
    },
  });

  const tx = db.transaction('pending', 'readwrite');
  const store = tx.objectStore('pending');
  const entries = await requestToPromise(store.getAll());

  for (const entry of entries) {
    const { idemKey, payload, id } = entry;
    try {
      await fetch('/api/invoices/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idemKey,
        },
        body: JSON.stringify(payload),
      });
      await requestToPromise(store.delete(id));
    } catch (error) {
      console.error('Falha ao reenviar fatura', error);
    }
  }

  return await transactionDone(tx);
}

function openDB(name, version, { upgrade }) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onupgradeneeded = () => upgrade(request.result);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(void 0);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
