import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';

export default class BudgetEnvelope extends Model {
  static table = 'budget_envelopes';

  @text('name') name!: string;
  @text('category') category!: string;
  @text('color') color!: string;
  @text('icon') icon!: string;
  @field('limit_amount') limitAmount!: number;
  @field('alert_level_1') alertLevel1!: number;
  @field('alert_level_2') alertLevel2!: number;
  @field('rollover_enabled') rolloverEnabled!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('synced_at') syncedAt?: Date;
}
