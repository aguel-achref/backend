import { db } from '../app.js';

export const getBanks = (req, res) => {

    const sql = `
        SELECT
            id,
            code,
            name,
            account,
            template,
            form_number,
            is_active,
            created_at,
            updated_at
        FROM banks
        ORDER BY name ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error('Error fetching banks:', err);

            return res.status(500).json({
                success: false,
                message: 'Error fetching banks',
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            data: results
        });
    });
};