// cache.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class ApiCacheService {
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T): void {
    const record = {
      // data 
      key,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(record));
  }

  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const record = JSON.parse(item);
    const now = Date.now();

    if (now - record.timestamp > this.cacheDuration) {
      localStorage.removeItem(key);
      return null;
    }

    return record as T;
  }

  clear(key: string): void {
    localStorage.removeItem(key);
  }

  clearAll(): void {
    localStorage.clear();
  }
}
