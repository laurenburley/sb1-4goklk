import { 
  DistillationRecord,
  StockRecord,
  MonthlySummary,
  DistillationRecordType 
} from '../types/compliance';

export class ComplianceService {
  // Create a new distillation record
  async createDistillationRecord(data: Partial<DistillationRecord>): Promise<DistillationRecord> {
    // Validate required fields based on record type
    this.validateDistillationRecord(data);
    
    const record: DistillationRecord = {
      ...data,
      id: `DR-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'System', // Replace with actual user
      updatedBy: 'System'  // Replace with actual user
    } as DistillationRecord;

    // Save to localStorage for demo
    const records = this.getDistillationRecords();
    records.push(record);
    localStorage.setItem('distillationRecords', JSON.stringify(records));

    return record;
  }

  // Validate record based on ATO requirements
  private validateDistillationRecord(data: Partial<DistillationRecord>) {
    if (!data.type) throw new Error('Record type is required');
    if (!data.date) throw new Error('Date is required');
    if (!data.batchNumber) throw new Error('Batch number is required');

    switch (data.type) {
      case DistillationRecordType.PRODUCTION:
        if (!data.productionDetails) throw new Error('Production details are required');
        if (!data.rawMaterials?.length) throw new Error('Raw materials are required');
        break;
      case DistillationRecordType.STORAGE:
        if (!data.storageDetails) throw new Error('Storage details are required');
        break;
      case DistillationRecordType.MOVEMENT:
        if (!data.movementDetails) throw new Error('Movement details are required');
        break;
      // Add other validations as needed
    }
  }

  // Get all distillation records
  getDistillationRecords(): DistillationRecord[] {
    const records = localStorage.getItem('distillationRecords');
    return records ? JSON.parse(records) : [];
  }

  // Create stock record
  async createStockRecord(data: Partial<StockRecord>): Promise<StockRecord> {
    const record: StockRecord = {
      ...data,
      id: `SR-${Date.now()}`,
      lpa: (data.volume || 0) * (data.alcoholContent || 0) / 100,
    } as StockRecord;

    const records = this.getStockRecords();
    records.push(record);
    localStorage.setItem('stockRecords', JSON.stringify(records));

    return record;
  }

  // Get stock records
  getStockRecords(): StockRecord[] {
    const records = localStorage.getItem('stockRecords');
    return records ? JSON.parse(records) : [];
  }

  // Generate monthly summary
  async generateMonthlySummary(month: string, year: string): Promise<MonthlySummary> {
    const stockRecords = this.getStockRecords().filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === parseInt(month) - 1 && 
             recordDate.getFullYear() === parseInt(year);
    });

    // Calculate totals
    const summary: MonthlySummary = {
      id: `MS-${year}${month}`,
      month,
      year,
      openingBalance: 0,
      production: 0,
      receipts: 0,
      removals: 0,
      returns: 0,
      wastage: 0,
      closingBalance: 0,
      exciseDutyPayable: 0,
      exciseDutyPaid: 0,
    };

    // Calculate values from stock records
    stockRecords.forEach(record => {
      switch (record.type) {
        case 'Opening':
          summary.openingBalance += record.lpa;
          break;
        case 'Production':
          summary.production += record.lpa;
          break;
        case 'Receipt':
          summary.receipts += record.lpa;
          break;
        case 'Removal':
          summary.removals += record.lpa;
          break;
        case 'Return':
          summary.returns += record.lpa;
          break;
      }
    });

    // Calculate closing balance
    summary.closingBalance = 
      summary.openingBalance + 
      summary.production + 
      summary.receipts - 
      summary.removals + 
      summary.returns - 
      summary.wastage;

    return summary;
  }
}

export const complianceService = new ComplianceService();