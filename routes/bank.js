import express from 'express'; 
import { getBanks } from '../bank/get.js';
import { createBanks } from '../bank/create.js';
import { updateBanks } from '../bank/update.js';
import { deleteBanks } from '../bank/delete.js';


const router = express.Router(); 

router.get('/getBanks', getBanks);
router.post('/createBanks', createBanks);
router.put('/updateBanks/:id', updateBanks);
router.delete('/deleteBanks/:id', deleteBanks);



export default router; 