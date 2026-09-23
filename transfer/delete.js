import { db } from '../app.js';

export const deleteTransfers = (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Transfer ID is required'
        });
    }

    const sql = `
        DELETE FROM transfers
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error('Error deleting transfer:', err);

            return res.status(500).json({
                success: false,
                message: 'Error deleting transfer',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Transfer not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Transfer deleted successfully'
        });
    });
};