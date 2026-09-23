import { db } from '../app.js';

export const updateBanks = (req, res) => {

    const { id } = req.params;

    const {
        code,
        name,
        account,
        template,
        form_number,
        is_active
    } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Bank ID is required'
        });
    }

    if (!code || !name) {
        return res.status(400).json({
            success: false,
            message: 'Bank code and bank name are required'
        });
    }

    const sql = `
        UPDATE banks
        SET
            code = ?,
            name = ?,
            account = ?,
            template = ?,
            form_number = ?,
            is_active = ?
        WHERE id = ?
    `;

    const values = [
        code,
        name,
        account || null,
        template || 'GENERIC',
        form_number || null,
        is_active !== undefined ? is_active : true,
        id
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error('Error updating bank:', err);

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'A bank with this code already exists'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error updating bank',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Bank not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Bank updated successfully'
        });
    });
};