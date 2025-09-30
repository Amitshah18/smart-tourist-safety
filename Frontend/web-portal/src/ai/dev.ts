
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-incident-reports.ts';
import '@/ai/flows/suggest-risk-score-explanation.ts';
import '@/ai/flows/calculate-safety-score.ts';
import '@/ai/flows/create-incident-report.ts';
import '@/ai/flows/generate-digital-id.ts';
import '@/ai/flows/detect-anomalies.ts';
import '@/ai/flows/generate-efir.ts';

    