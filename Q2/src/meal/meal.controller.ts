import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealInfoRequestDto } from './dto/meal-request.dto';

@Controller('/meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  async getMealInfo(@Query() dto: MealInfoRequestDto) {
    const result = await this.mealService.getMealInfo(
      dto.ATPT_OFCDC_SC_CODE,
      dto.SD_SCHUL_CODE,
      dto.MLSV_FROM_YMD,
      dto.MLSV_TO_YMD,
    );

    return {
      statusCode: 200,
      message: 'success',
      data: result,
    };
  }
}
