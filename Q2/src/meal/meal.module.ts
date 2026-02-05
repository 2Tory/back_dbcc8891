import { Module } from '@nestjs/common';
import { MealController } from './meal.controller';
import { MealService } from './meal.service';
import { NeisClient } from './client/neis.client';
import { isFromDateBeforeToDate } from './validator/meal.validator';

@Module({
  imports: [],
  controllers: [MealController],
  providers: [MealService, NeisClient, isFromDateBeforeToDate],
})
export class MealModule {}
