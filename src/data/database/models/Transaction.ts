import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Transaction extends Model {
  static table = 'transactions';

  @text('kind') kind!: 'income' | 'expense';
  @field('amount') amount!: number;
  @text('title') title!: string;
  @text('category') category!: string;
  @text('note') note?: string;
  @text('envelope_id') envelopeId?: string;
  @date('occurred_at') occurredAt!: Date;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('synced_at') syncedAt?: Date;
}
