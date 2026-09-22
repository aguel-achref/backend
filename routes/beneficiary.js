import express from 'express'; 
import { getBeneficiaries } from '../beneficiary/get.js';
import { getOneBeneficiary } from '../beneficiary/getOne.js';
import { createBeneficiaries} from '../beneficiary/create.js';
import { updateBeneficiaries } from '../beneficiary/update.js';
import { deleteBeneficiaries } from '../beneficiary/delete.js';


const router = express.Router(); 

router.get('/getBeneficiaries', getBeneficiaries);
router.get('/getOneBeneficiary/:id', getOneBeneficiary);
router.post('/createBeneficiaries', createBeneficiaries);
router.put('/updateBeneficiaries/:id', updateBeneficiaries);
router.delete('/deleteBeneficiaries/:id', deleteBeneficiaries);



export default router; 