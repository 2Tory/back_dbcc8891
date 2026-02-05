/**
 * NEIS 급식식단정보 API row 한 건 (조식/중식/석식 등)
 * @see https://open.neis.go.kr/hub/mealServiceDietInfo
 */
export class NeisMealRowDto {
  /** 시도교육청코드 */
  ATPT_OFCDC_SC_CODE: string;
  /** 시도교육청명 */
  ATPT_OFCDC_SC_NM: string;
  /** 학교코드 */
  SD_SCHUL_CODE: string;
  /** 학교명 */
  SCHUL_NM: string;
  /** 급식구분 (1:조식, 2:중식, 3:석식) */
  MMEAL_SC_CODE: string;
  /** 급식구분명 */
  MMEAL_SC_NM: string;
  /** 급식일자 (YYYYMMDD) */
  MLSV_YMD: string;
  /** 급식인원 수 */
  MLSV_FGR: number;
  /** 요리명 (메뉴, <br/> 구분) */
  DDISH_NM: string;
  /** 영양정보  <br/> 구분 */
  NTR_INFO?: string;
  /** 원산지정보  <br/> 구분 */
  ORPLC_INFO?: string;
  /** 칼로리정보 */
  CAL_INFO?: string;
}

export class MenusDataDto {
  /** 메뉴명 */
  name: string;
  /** 알레르기 정보 */
  allergies: number[];
}

export class NutrientsDataDto {
  /** 영양정보 */
  name: string;
  /** 영양정보 값 */
  value: number;
  /** 영양정보 단위 */
  unit: string;
}

export class MealDto {
  /** 급식구분코드 */
  mealTypeCode: number;
  /** 급식구분명 */
  mealType: string;
  /** 메뉴정보 */
  menus: MenusDataDto[];
  /** 영양정보 */
  nutrients: NutrientsDataDto[];
  /** 칼로리정보 */
  calorie: number;
}

export class MealResponseDto {
  /** 시도교육청코드 */
  districtCode: string;
  /** 시도교육청명 */
  districtName: string;
  /** 학교코드 */
  schoolCode: string;
  /** 학교명 */
  schoolName: string;
  /** 급식정보 (일자별) - 키: 날짜(YYYY-MM-DD), 값: 해당일 급식정보 */
  meals: Record<string, MealDto[]>;
}
