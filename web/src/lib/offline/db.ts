import Dexie, { Table } from 'dexie';

export interface PendingSubmit {
  id?: number;
  idemKey: string;
  payload: any;
  createdAt: number;
}

export class OfflineDB extends Dexie {
  pending!: Table<PendingSubmit, number>;

  constructor() {
    super('efactura_offline');
    this.version(1).stores({
      pending: '++id, idemKey, createdAt',
    });
  }
}

export const db = new OfflineDB();
