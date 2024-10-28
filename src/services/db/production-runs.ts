import { database as db } from '../../db';
import { 
  productionRuns, 
  productionResources, 
  productionStaff, 
  productionStages 
} from '../../db/schema';
import { ProductionRun } from '../../types/scheduling';
import { eq } from 'drizzle-orm';

// Rest of the file remains unchanged