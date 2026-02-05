import {
  Injectable,
  Logger,
  BadGatewayException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { NeisMealRowDto } from '../dto/meal-response.dto';

const NEIS_API_KEY = '1234567890'; // 실제 사용시 환경변수로 관리
const NEIS_API_URL = 'https://open.neis.go.kr/hub/mealServiceDietInfo'; // 실제 사용시 환경변수로 관리

@Injectable()
export class NeisClient {
  private readonly logger = new Logger(NeisClient.name);

  async getMealInfo(
    ATPT_OFCDC_SC_CODE: string,
    SD_SCHUL_CODE: string,
    MLSV_FROM_YMD: string,
    MLSV_TO_YMD: string,
  ): Promise<NeisMealRowDto[] | undefined> {
    // 실제 사용 시 api key 추가하여 요청
    const url = `${NEIS_API_URL}?Type=json&pIndex=1&pSize=10&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_FROM_YMD=${MLSV_FROM_YMD}&MLSV_TO_YMD=${MLSV_TO_YMD}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        // 외부 서버의 상태코드/본문 일부를 로그로 남김
        const bodySnippet = (await response.text()).slice(0, 300);
        this.logger.warn(
          `NEIS API non-2xx: ${response.status} ${response.statusText} | url=${url} | body=${bodySnippet}`,
        );
        throw new BadGatewayException('NEIS API 응답이 정상적이지 않습니다.');
      }

      const data = await response.json();

      return data?.mealServiceDietInfo?.[1]?.row as
        | NeisMealRowDto[]
        | undefined;
    } catch (err: any) {
      // 네트워크/파싱/타임아웃 등 "통신 자체 실패" 로깅
      this.logger.error(
        `NEIS API call failed | url=${url} | msg=${err?.message ?? err}`,
        err?.stack,
      );

      // 이미 HttpException으로 변환된 건 그대로 던져도 됨
      if (err instanceof BadGatewayException) throw err;

      throw new ServiceUnavailableException(
        'NEIS API 호출 중 오류가 발생했습니다.',
      );
    }
  }
}
