import { db } from '../app.js';

export const updateBeneficiaries = (req, res) => {

    const { id } = req.params;

    const {
        name,
        address,
        city,
        country,
        iban,
        bank_name,
        swift,
        bank_address,
        intermediary_bank,
        intermediary_swift
    } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Beneficiary ID is required'
        });
    }

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Beneficiary name is required'
        });
    }

    const sql = `
        UPDATE beneficiaries
        SET
            name = ?,
            address = ?,
            city = ?,
            country = ?,
            iban = ?,
            bank_name = ?,
            swift = ?,
            bank_address = ?,
            intermediary_bank = ?,
            intermediary_swift = ?
        WHERE id = ?
    `;

    const values = [
        name,
        address || null,
        city || null,
        country || null,
        iban || null,
        bank_name || null,
        swift || null,
        bank_address || null,
        intermediary_bank || null,
        intermediary_swift || null,
        id
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error('Error updating beneficiary:', err);

            return res.status(500).json({
                success: false,
                message: 'Error updating beneficiary',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Beneficiary not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Beneficiary updated successfully'
        });
    });
};