import { ExciseClassification, EXCISE_RATES } from '../types/compliance';

export class ExciseService {
  calculateExciseDuty(classification: keyof typeof ExciseClassification, lpa: number): number {
    let rate;
    switch (classification) {
      case ExciseClassification.BRANDY:
        rate = EXCISE_RATES.SPIRITS.BRANDY;
        break;
      case ExciseClassification.OTHER_SPIRITS:
        rate = EXCISE_RATES.SPIRITS.OTHER_SPIRITS;
        break;
      case ExciseClassification.OTHER_EXCISABLE:
        rate = EXCISE_RATES.MINIMUM_RATES.OTHER_EXCISABLE;
        break;
      default:
        rate = EXCISE_RATES.SPIRITS.OTHER_SPIRITS;
    }
    return lpa * rate;
  }

  calculateLPA(volume: number, abv: number): number {
    return volume * (abv / 100);
  }

  calculateExciseForBatch(volume: number, abv: number, classification: keyof typeof ExciseClassification = 'OTHER_SPIRITS'): number {
    const lpa = this.calculateLPA(volume, abv);
    return this.calculateExciseDuty(classification, lpa);
  }
}

export const exciseService = new ExciseService();