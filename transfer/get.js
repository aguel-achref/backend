import { db } from '../app.js';

export const getTransfers = (req, res) => {

    const {
        year,
        bank_id,
        search
    } = req.query;

    let sql = `
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

        WHERE 1 = 1
    `;

    const values = [];

    // Filtre par année
    if (year) {
        sql += ` AND YEAR(t.transfer_date) = ?`;
        values.push(year);
    }

    // Filtre par banque
    if (bank_id) {
        sql += ` AND t.bank_id = ?`;
        values.push(bank_id);
    }

    // Recherche libre
    if (search) {

        sql += `
            AND (
                t.reference LIKE ?
                OR t.beneficiary_name LIKE ?
                OR t.beneficiary_iban LIKE ?
                OR t.purpose LIKE ?
                OR t.case_reference LIKE ?
            )
        `;

        const searchValue = `%${search}%`;

        values.push(
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue
        );
    }

    sql += `
        ORDER BY
            t.transfer_date DESC,
            t.id DESC
    `;

    db.query(sql, values, (err, results) => {

        if (err) {
            console.error('Error fetching transfers:', err);

            return res.status(500).json({
                success: false,
                message: 'Error fetching transfers',
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            data: results
        });
    });
};