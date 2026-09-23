import { db } from '../app.js';

export const getSettings = (req, res) => {

    const sql = `
        SELECT
            id,
            company_name,
            address,
            city,
            postal_code,
            customs_code,
            rne,
            phone,
            financial_code,
            biat_account,
            attijari_account,
            next_transfer_number,
            created_at,
            updated_at
        FROM company_settings
        ORDER BY id ASC
        LIMIT 1
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error('Error fetching settings:', err);

            return res.status(500).json({
                success: false,
                message: 'Error fetching settings',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Company settings not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: results[0]
        });
    });
};