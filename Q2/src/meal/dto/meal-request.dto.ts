import { IsNotEmpty, IsString, Matches, Validate } from 'class-validator';
import { isFromDateBeforeToDate } from '../validator/meal.validator';

export class MealInfoRequestDto {
  /** 시도교육청코드 */
  @IsString()
  @IsNotEmpty()
  ATPT_OFCDC_SC_CODE: string;
  /** 학교코드 */
  @IsString()
  @IsNotEmpty()
  SD_SCHUL_CODE: string;
  /** 급식시작일자 (YYYYMMDD) */
  @IsString()
  @Matches(/^\d{8}$/, {
    message: '급식시작일자(MLSV_FROM_YMD)는 8자리 숫자여야 합니다.',
  })
  MLSV_FROM_YMD: string;
  /** 급식종료일자 (YYYYMMDD) */
  @IsString()
  @Matches(/^\d{8}$/, {
    message: '급식종료일자(MLSV_TO_YMD)는 8자리 숫자여야 합니다.',
  })
  @Validate(isFromDateBeforeToDate)
  MLSV_TO_YMD: string;
}
