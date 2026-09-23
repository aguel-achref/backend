import { db } from '../app.js';

export const getOneTransfer = (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Transfer ID is required'
        });
    }

    const sql = `
        SELECT
            t.id,
            t.reference,
            t.transfer_date,
            t.bank_id,
            b.name AS bank_name,
            t.debit_account,
            t.currency,
            t.amount,
            t.amount_words,
            t.purpose,
            t.fees,
            t.negotiated_rate,
            t.operation_type,
            t.case_reference,

            t.beneficiary_id,
            t.beneficiary_name,
            t.beneficiary_address,
            t.beneficiary_city,
            t.beneficiary_country,
            t.beneficiary_iban,
            t.beneficiary_bank,
            t.beneficiary_swift,
            t.beneficiary_bank_address,
            t.intermediary_bank,
            t.intermediary_swift,

            t.created_at,
            t.updated_at

        FROM transfers t

        INNER JOIN banks b
            ON b.id = t.bank_id

        WHERE t.id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.error('Error fetching transfer:', err);

            return res.status(500).json({
                success: false,
                message: 'Error fetching transfer',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Transfer not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: results[0]
        });
    });
};