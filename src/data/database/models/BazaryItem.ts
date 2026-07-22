import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';

export default class BazaryItem extends Model {
  static table = 'bazary_items';

  @text('label') label!: string;
  @text('category') category!: string;
  @field('checked') checked!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('synced_at') syncedAt?: Date;
}
