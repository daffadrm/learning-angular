import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LabelStoreService {
  private store = new Map<string, any>();

  set(id: string, data: any) {
    this.store.set(id, data);
  }

  get(id: string) {
    return this.store.get(id);
  }

  remove(id: string) {
    this.store.delete(id);
  }
}
