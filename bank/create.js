import { db } from '../app.js';

export const createBanks = (req, res) => {

    const {
        code,
        name,
        account,
        template,
        form_number,
        is_active
    } = req.body;

    // Required fields
    if (!code || !name) {
        return res.status(400).json({
            success: false,
            message: 'Bank code and bank name are required'
        });
    }

    const sql = `
        INSERT INTO banks (
            code,
            name,
            account,
            template,
            form_number,
            is_active
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        code,
        name,
        account || null,
        template || 'GENERIC',
        form_number || null,
        is_active !== undefined ? is_active : true
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error('Error creating bank:', err);

            // Duplicate code
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'A bank with this code already exists'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error creating bank',
                error: err.message
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Bank created successfully',
            data: {
                id: result.insertId,
                code,
                name,
                account: account || null,
                template: template || 'GENERIC',
                form_number: form_number || null,
                is_active: is_active !== undefined ? is_active : true
            }
        });
    });
};