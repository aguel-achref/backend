import { db } from '../app.js';

export const deleteBanks = (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Bank ID is required'
        });
    }

    const sql = `
        DELETE FROM banks
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error('Error deleting bank:', err);

            // Bank is used by a transfer
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    success: false,
                    message: 'This bank cannot be deleted because it is used by one or more transfers'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Error deleting bank',
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
            message: 'Bank deleted successfully'
        });
    });
};