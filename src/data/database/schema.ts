import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const idealySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'kind', type: 'string' }, // 'income' | 'expense'
        { name: 'amount', type: 'number' },
        { name: 'title', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'note', type: 'string', isOptional: true },
        { name: 'envelope_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'occurred_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'synced_at', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'budget_envelopes',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'limit_amount', type: 'number' },
        { name: 'alert_level_1', type: 'number' },
        { name: 'alert_level_2', type: 'number' },
        { name: 'rollover_enabled', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'synced_at', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'bazary_items',
      columns: [
        { name: 'label', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'checked', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'synced_at', type: 'number', isOptional: true },
      ],
    }),
  ],
});
