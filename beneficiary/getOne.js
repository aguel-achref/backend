import { db } from '../app.js';

export const getOneBeneficiary = (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Beneficiary ID is required'
        });
    }

    const sql = `
        SELECT
            id,
            name,
            address,
            city,
            country,
            iban,
            bank_name,
            swift,
            bank_address,
            intermediary_bank,
            intermediary_swift,
            created_at,
            updated_at
        FROM beneficiaries
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.error('Error fetching beneficiary:', err);

            return res.status(500).json({
                success: false,
                message: 'Error fetching beneficiary',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Beneficiary not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: results[0]
        });
    });
};