import { useState, useEffect } from 'react';
import { complianceService } from '../services/compliance';
import { ProductionBatch } from '../types/production';
import { ComplianceReport, DistillationRecord, SpiritStockRecord } from '../types/compliance';

interface ComplianceData {
  exciseReturns: ComplianceReport[];
  distillationRecords: DistillationRecord[];
  stockRecords: SpiritStockRecord[];
  loading: boolean;
  error: string | null;
}

export function useComplianceData(productionBatches: ProductionBatch[]) {
  const [data, setData] = useState<ComplianceData>({
    exciseReturns: [],
    distillationRecords: [],
    stockRecords: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const generateComplianceData = async () => {
      try {
        // Generate distillation records
        const distillationRecords = productionBatches.map(batch =>
          complianceService.createDistillationRecord(batch)
        );

        // Generate stock records
        const stockRecords = productionBatches.map(batch =>
          complianceService.createStockRecord(batch)
        );

        // Generate current month's excise return
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        const currentExciseReturn = complianceService.generateExciseReturn(
          productionBatches,
          startOfMonth,
          endOfMonth
        );

        setData({
          exciseReturns: [currentExciseReturn],
          distillationRecords,
          stockRecords,
          loading: false,
          error: null
        });
      } catch (err) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to generate compliance data'
        }));
      }
    };

    generateComplianceData();
  }, [productionBatches]);

  return data;
}