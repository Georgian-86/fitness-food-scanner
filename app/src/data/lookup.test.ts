import { describe, expect, it, vi } from 'vitest';
import type { Product } from '../scoring';
import { ANCHOR_BARCODE } from './fixtures';
import { lookup } from './lookup';

const prod = (over: Partial<Product> = {}): Product => ({
  name: 'X', nutrients: {}, allergens: [], dietType: 'unknown', source: 'off', ...over,
});

describe('lookup', () => {
  it('returns a saved product first without calling OFF', async () => {
    const fetchOff = vi.fn();
    const r = await lookup('123', { getSaved: () => prod({ source: 'manual' }), fetchOff });
    expect(r?.source).toBe('saved');
    expect(fetchOff).not.toHaveBeenCalled();
  });

  it('uses OFF and caches it', async () => {
    const save = vi.fn();
    const r = await lookup('123', { getSaved: () => null, save, fetchOff: async () => prod() });
    expect(r?.source).toBe('off');
    expect(r?.product.barcode).toBe('123');
    expect(save).toHaveBeenCalledOnce();
  });

  it('falls back to fixtures on network error', async () => {
    const r = await lookup(ANCHOR_BARCODE, {
      getSaved: () => null,
      save: vi.fn(),
      fetchOff: async () => { throw new Error('offline'); },
    });
    expect(r?.source).toBe('fixture');
  });

  it('falls back to fixtures when OFF has no record, else null', async () => {
    const deps = { getSaved: () => null, save: vi.fn(), fetchOff: async () => null };
    expect((await lookup(ANCHOR_BARCODE, deps))?.source).toBe('fixture');
    expect(await lookup('8909999999994', deps)).toBeNull();
  });
});
