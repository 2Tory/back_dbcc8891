import { Injectable, NotFoundException } from '@nestjs/common';
import {
  MealDto,
  NeisMealRowDto,
  MealResponseDto,
} from './dto/meal-response.dto';
import { NeisClient } from './client/neis.client';

@Injectable()
export class MealService {
  constructor(private readonly neisClient: NeisClient) {}

  async getMealInfo(
    ATPT_OFCDC_SC_CODE: string,
    SD_SCHUL_CODE: string,
    MLSV_FROM_YMD: string,
    MLSV_TO_YMD: string,
  ): Promise<MealResponseDto> {
    const mealInfo = await this.neisClient.getMealInfo(
      ATPT_OFCDC_SC_CODE,
      SD_SCHUL_CODE,
      MLSV_FROM_YMD,
      MLSV_TO_YMD,
    );

    if (!mealInfo || mealInfo.length === 0) {
      throw new NotFoundException('급식 정보를 찾을 수 없습니다.');
    }

    const meals: Record<string, MealDto[]> = {};

    // 조회 기간 내 모든 날짜를 키로 두고 빈 배열로 초기화
    const fromDate = new Date(
      parseInt(MLSV_FROM_YMD.slice(0, 4), 10),
      parseInt(MLSV_FROM_YMD.slice(4, 6), 10) - 1,
      parseInt(MLSV_FROM_YMD.slice(6, 8), 10),
    );
    const toDate = new Date(
      parseInt(MLSV_TO_YMD.slice(0, 4), 10),
      parseInt(MLSV_TO_YMD.slice(4, 6), 10) - 1,
      parseInt(MLSV_TO_YMD.slice(6, 8), 10),
    );
    for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      meals[`${y}-${m}-${day}`] = [];
    }

    for (const meal of mealInfo) {
      const dateKey =
        meal.MLSV_YMD.length === 8
          ? `${meal.MLSV_YMD.slice(0, 4)}-${meal.MLSV_YMD.slice(4, 6)}-${meal.MLSV_YMD.slice(6, 8)}`
          : '';
      if (!meals[dateKey]) meals[dateKey] = [];

      meals[dateKey].push({
        mealTypeCode: parseInt(meal.MMEAL_SC_CODE, 10),
        mealType: meal.MMEAL_SC_NM,
        menus: meal.DDISH_NM.split('<br/>').map((menu) => {
          const allergyMatch = menu.match(/\(([0-9.\s]+)\)\s*$/);
          const allergies = allergyMatch
            ? allergyMatch[1]
                .split('.')
                .map((allergy) => parseInt(allergy.trim(), 10))
                .filter((n) => !Number.isNaN(n))
            : [];
          const name = allergyMatch
            ? menu.replace(/\s*\([0-9.\s]+\)\s*$/, '').trim()
            : menu.trim();
          return { name, allergies };
        }),
        nutrients:
          meal.NTR_INFO?.split('<br/>').map((nutrient) => {
            const partAfterColon = nutrient.split(':')[1];
            const partInParens = nutrient.split('(')[1]?.split(')')[0];
            return {
              name: nutrient.split('(')[0]?.trim() ?? '',
              value: partAfterColon
                ? Number(parseFloat(partAfterColon.trim()).toFixed(2))
                : 0,
              unit: partInParens?.trim() ?? '',
            };
          }) ?? [],
        calorie: parseFloat(meal.CAL_INFO?.split(' ')[0]?.trim() ?? '0') || 0,
      });
    }

    return {
      districtCode: mealInfo[0]?.ATPT_OFCDC_SC_CODE,
      districtName: mealInfo[0]?.ATPT_OFCDC_SC_NM,
      schoolCode: mealInfo[0]?.SD_SCHUL_CODE,
      schoolName: mealInfo[0]?.SCHUL_NM,
      meals,
    };
  }
}
