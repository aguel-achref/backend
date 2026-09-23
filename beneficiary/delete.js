import { db } from '../app.js';

export const deleteBeneficiaries = (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Beneficiary ID is required'
        });
    }

    const sql = `
        DELETE FROM beneficiaries
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error('Error deleting beneficiary:', err);

            return res.status(500).json({
                success: false,
                message: 'Error deleting beneficiary',
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
            message: 'Beneficiary deleted successfully'
        });
    });
};