import { z } from 'zod';

export const SimilarSchema = z.boolean();

type Similar = z.infer<typeof SimilarSchema>;

export default Similar;
