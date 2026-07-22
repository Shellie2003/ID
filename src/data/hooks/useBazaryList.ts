import { useEffect, useState } from 'react';
import { Q } from '@nozbe/watermelondb';

import { database } from '../database';
import BazaryItem from '../database/models/BazaryItem';

export type BazaryOverview = {
  loading: boolean;
  items: BazaryItem[];
  checkedCount: number;
  totalCount: number;
};

export function useBazaryList(): BazaryOverview {
  const [state, setState] = useState<BazaryOverview>({ loading: true, items: [], checkedCount: 0, totalCount: 0 });

  useEffect(() => {
    const subscription = database
      .get<BazaryItem>('bazary_items')
      .query(Q.sortBy('created_at', Q.desc))
      .observe()
      .subscribe((items) => {
        setState({
          loading: false,
          items,
          checkedCount: items.filter((item) => item.checked).length,
          totalCount: items.length,
        });
      });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export async function createBazaryItem(input: { label: string; category: string }) {
  await database.write(async () => {
    await database.get<BazaryItem>('bazary_items').create((item) => {
      item.label = input.label;
      item.category = input.category;
      item.checked = false;
    });
  });
}

export async function toggleBazaryItem(item: BazaryItem) {
  await database.write(async () => {
    await item.update((record) => {
      record.checked = !record.checked;
    });
  });
}

export async function deleteBazaryItem(item: BazaryItem) {
  await database.write(async () => {
    await item.markAsDeleted();
  });
}

export async function clearCheckedBazaryItems(items: BazaryItem[]) {
  const checked = items.filter((item) => item.checked);
  if (checked.length === 0) return;
  await database.write(async () => {
    await database.batch(...checked.map((item) => item.prepareMarkAsDeleted()));
  });
}
