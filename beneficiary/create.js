import { db } from '../app.js';

export const createBeneficiaries = (req, res) => {

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

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Beneficiary name is required'
        });
    }

    const sql = `
        INSERT INTO beneficiaries (
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
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        intermediary_swift || null
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error('Error creating beneficiary:', err);

            return res.status(500).json({
                success: false,
                message: 'Error creating beneficiary',
                error: err.message
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Beneficiary created successfully',
            data: {
                id: result.insertId,
                name,
                address: address || null,
                city: city || null,
                country: country || null,
                iban: iban || null,
                bank_name: bank_name || null,
                swift: swift || null,
                bank_address: bank_address || null,
                intermediary_bank: intermediary_bank || null,
                intermediary_swift: intermediary_swift || null
            }
        });
    });
};