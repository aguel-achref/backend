import express from 'express'; 
import { getTransfers } from '../transfer/get.js';
import { getOneTransfer } from '../transfer/getOne.js';
import { createTransfers} from '../transfer/create.js';
import { deleteTransfers } from '../transfer/delete.js';


const router = express.Router(); 

router.get('/getTransfers', getTransfers);
router.get('/getOneTransfer/:id', getOneTransfer);
router.post('/createTransfers', createTransfers);
router.delete('/deleteTransfers/:id', deleteTransfers);



export default router; 