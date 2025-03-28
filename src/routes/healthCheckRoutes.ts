import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/health', async (req: Request, res: Response) => {
    res.status(200).send('OK');
});

export default router;