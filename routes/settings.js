import express from 'express'; 
import { getSettings } from '../settings/get.js';
import { updateSettings } from '../settings/update.js';



const router = express.Router(); 

router.get('/getSettings', getSettings);
router.get('/updateSettings/:id', updateSettings);




export default router; 