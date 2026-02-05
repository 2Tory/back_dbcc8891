import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'meal', async: true })
export class isFromDateBeforeToDate implements ValidatorConstraintInterface {
  validate(toDate: string, args: ValidationArguments) {
    const obj = args.object as any;
    const fromDate = obj.MLSV_FROM_YMD;

    if (!fromDate || !toDate) return true;

    return Number(fromDate) <= Number(toDate);
  }

  defaultMessage() {
    return '급식시작일자(MLSV_FROM_YMD)는 급식종료일자(MLSV_TO_YMD)보다 늦을 수 없습니다.';
  }
}
