import { db } from '../app.js';

export const getBeneficiaries = (req, res) => {

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
        ORDER BY name ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error('Error fetching beneficiaries:', err);

            return res.status(500).json({
                success: false,
                message: 'Error fetching beneficiaries',
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            data: results
        });
    });
};