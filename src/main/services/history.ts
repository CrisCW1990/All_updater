import Store from 'electron-store';
import type { HistoryItem } from '../../shared/types.js';

interface HistoryData {
    items: HistoryItem[];
}

const schema = {
    items: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                appName: { type: 'string' },
                version: { type: 'string' },
                status: { type: 'string' },
                date: { type: 'string' },
                details: { type: 'string' }
            }
        },
        default: []
    }
};

export class HistoryService {
    private store: Store<HistoryData>;

    constructor() {
        this.store = new Store<HistoryData>({
            schema,
            name: 'installation-history'
        });
    }

    getHistory(): HistoryItem[] {
        return this.store.get('items');
    }

    addEntry(entry: Omit<HistoryItem, 'date'>): void {
        const items = this.getHistory();
        const newEntry: HistoryItem = {
            ...entry,
            date: new Date().toISOString()
        };
        items.unshift(newEntry); // Newest first
        // Limit history to last 200 items to avoid bloat
        this.store.set('items', items.slice(0, 200));
    }

    isVersionSkipped(id: string, version: string): boolean {
        const items = this.getHistory();
        return items.some(item =>
            item.id === id &&
            item.version === version &&
            // Only skip if explicitly marked as 'skipped' by user action (future feature)
            // Do NOT skip 'inapplicable' or 'failed' statuses, so user can retry them
            item.status === 'skipped'
        );
    }

    clearHistory(): void {
        this.store.set('items', []);
    }
}
