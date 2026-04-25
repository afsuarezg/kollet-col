import { Router, Request, Response } from 'express';
import { listCases, getCaseById, createCase, updateCase, deleteCase } from '../models/case';
import { caseSchema } from '../schemas/caseSchema';

const router = Router();

function parseBody(req: Request, res: Response): Record<string, unknown> | null {
  const result = caseSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Datos inválidos', details: result.error.flatten() });
    return null;
  }
  return result.data as Record<string, unknown>;
}

router.get('/', (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.min(200, Math.max(1, parseInt(req.query.pageSize as string) || 50));
  const q = (req.query.q as string) || undefined;
  const result = listCases(page, pageSize, q);
  res.json({ ...result, page, pageSize });
});

router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const record = getCaseById(id);
  if (!record) return res.status(404).json({ error: 'Caso no encontrado' });
  res.json(record);
});

router.post('/', (req: Request, res: Response) => {
  const data = parseBody(req, res);
  if (!data) return;
  try {
    const record = createCase(data);
    res.status(201).json(record);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: message });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const data = parseBody(req, res);
  if (!data) return;
  try {
    const record = updateCase(id, data);
    if (!record) return res.status(404).json({ error: 'Caso no encontrado' });
    res.json(record);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const deleted = deleteCase(id);
  if (!deleted) return res.status(404).json({ error: 'Caso no encontrado' });
  res.status(204).send();
});

export default router;
