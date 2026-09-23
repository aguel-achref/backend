import { db } from '../app.js';

export const updateSettings = (req, res) => {

    const { id } = req.params;

    const {
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
        next_transfer_number
    } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Settings ID is required'
        });
    }

    if (!company_name) {
        return res.status(400).json({
            success: false,
            message: 'Company name is required'
        });
    }

    if (
        next_transfer_number !== undefined &&
        (
            next_transfer_number === null ||
            isNaN(next_transfer_number) ||
            Number(next_transfer_number) < 1
        )
    ) {
        return res.status(400).json({
            success: false,
            message: 'next_transfer_number must be a valid positive number'
        });
    }

    const sql = `
        UPDATE company_settings
        SET
            company_name = ?,
            address = ?,
            city = ?,
            postal_code = ?,
            customs_code = ?,
            rne = ?,
            phone = ?,
            financial_code = ?,
            biat_account = ?,
            attijari_account = ?,
            next_transfer_number = ?
        WHERE id = ?
    `;

    const values = [
        company_name,
        address || null,
        city || null,
        postal_code || null,
        customs_code || null,
        rne || null,
        phone || null,
        financial_code || null,
        biat_account || null,
        attijari_account || null,
        next_transfer_number !== undefined
            ? Number(next_transfer_number)
            : 1,
        id
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error('Error updating settings:', err);

            return res.status(500).json({
                success: false,
                message: 'Error updating settings',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Company settings not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Company settings updated successfully'
        });
    });
};