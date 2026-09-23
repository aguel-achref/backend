import { db } from '../app.js';

export const createTransfers = (req, res) => {

    const {
        transfer_date,
        bank_id,
        debit_account,
        currency,
        amount,
        amount_words,
        purpose,
        fees,
        negotiated_rate,
        operation_type,
        case_reference,
        beneficiary_id
    } = req.body;

    /* =========================
       Validation
    ========================= */

    if (!transfer_date) {
        return res.status(400).json({
            success: false,
            message: 'Transfer date is required'
        });
    }

    if (!bank_id) {
        return res.status(400).json({
            success: false,
            message: 'Bank is required'
        });
    }

    if (!debit_account) {
        return res.status(400).json({
            success: false,
            message: 'Debit account is required'
        });
    }

    if (!currency) {
        return res.status(400).json({
            success: false,
            message: 'Currency is required'
        });
    }

    if (
        amount === undefined ||
        amount === null ||
        isNaN(amount) ||
        Number(amount) <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: 'A valid amount is required'
        });
    }

    if (!beneficiary_id) {
        return res.status(400).json({
            success: false,
            message: 'Beneficiary is required'
        });
    }

    /* =========================
       Get MySQL connection
    ========================= */

    db.getConnection((connectionError, connection) => {

        if (connectionError) {

            console.error(
                'Error getting MySQL connection:',
                connectionError
            );

            return res.status(500).json({
                success: false,
                message: 'Database connection error'
            });
        }

        connection.beginTransaction((transactionError) => {

            if (transactionError) {

                connection.release();

                return res.status(500).json({
                    success: false,
                    message: 'Could not start transaction',
                    error: transactionError.message
                });
            }

            /* =========================
               Get company settings
               + LOCK ROW
            ========================= */

            const settingsSql = `
                SELECT
                    id,
                    next_transfer_number
                FROM company_settings
                ORDER BY id ASC
                LIMIT 1
                FOR UPDATE
            `;

            connection.query(
                settingsSql,
                (settingsError, settingsResults) => {

                    if (settingsError) {

                        return rollback(
                            connection,
                            res,
                            settingsError,
                            'Error getting company settings'
                        );
                    }

                    if (settingsResults.length === 0) {

                        return rollback(
                            connection,
                            res,
                            null,
                            'Company settings not found',
                            404
                        );
                    }

                    const settings = settingsResults[0];

                    const transferNumber =
                        Number(settings.next_transfer_number);

                    if (
                        !Number.isInteger(transferNumber) ||
                        transferNumber < 1
                    ) {

                        return rollback(
                            connection,
                            res,
                            null,
                            'Invalid next transfer number',
                            500
                        );
                    }

                    /* =========================
                       Generate reference
                    ========================= */

                    const reference =
                        String(transferNumber).padStart(6, '0');

                    /* =========================
                       Check bank
                    ========================= */

                    const bankSql = `
                        SELECT
                            id,
                            name
                        FROM banks
                        WHERE id = ?
                        AND is_active = TRUE
                    `;

                    connection.query(
                        bankSql,
                        [bank_id],
                        (bankError, bankResults) => {

                            if (bankError) {

                                return rollback(
                                    connection,
                                    res,
                                    bankError,
                                    'Error checking bank'
                                );
                            }

                            if (bankResults.length === 0) {

                                return rollback(
                                    connection,
                                    res,
                                    null,
                                    'Bank not found or inactive',
                                    404
                                );
                            }

                            /* =========================
                               Get beneficiary
                            ========================= */

                            const beneficiarySql = `
                                SELECT
                                    id,
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
                                FROM beneficiaries
                                WHERE id = ?
                            `;

                            connection.query(
                                beneficiarySql,
                                [beneficiary_id],
                                (
                                    beneficiaryError,
                                    beneficiaryResults
                                ) => {

                                    if (beneficiaryError) {

                                        return rollback(
                                            connection,
                                            res,
                                            beneficiaryError,
                                            'Error checking beneficiary'
                                        );
                                    }

                                    if (
                                        beneficiaryResults.length === 0
                                    ) {

                                        return rollback(
                                            connection,
                                            res,
                                            null,
                                            'Beneficiary not found',
                                            404
                                        );
                                    }

                                    const beneficiary =
                                        beneficiaryResults[0];

                                    /* =========================
                                       Create transfer
                                    ========================= */

                                    const insertSql = `
                                        INSERT INTO transfers (
                                            reference,
                                            transfer_date,
                                            bank_id,
                                            debit_account,
                                            currency,
                                            amount,
                                            amount_words,
                                            purpose,
                                            fees,
                                            negotiated_rate,
                                            operation_type,
                                            case_reference,

                                            beneficiary_id,
                                            beneficiary_name,
                                            beneficiary_address,
                                            beneficiary_city,
                                            beneficiary_country,
                                            beneficiary_iban,
                                            beneficiary_bank,
                                            beneficiary_swift,
                                            beneficiary_bank_address,
                                            intermediary_bank,
                                            intermediary_swift
                                        )
                                        VALUES (
                                            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                                            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                                            ?, ?, ?
                                        )
                                    `;

                                    const values = [
                                        reference,
                                        transfer_date,
                                        bank_id,
                                        debit_account,
                                        currency,
                                        Number(amount),
                                        amount_words || null,
                                        purpose || null,
                                        fees || 'SHA',
                                        negotiated_rate || null,
                                        operation_type || null,
                                        case_reference || null,

                                        beneficiary.id,
                                        beneficiary.name,
                                        beneficiary.address,
                                        beneficiary.city,
                                        beneficiary.country,
                                        beneficiary.iban,
                                        beneficiary.bank_name,
                                        beneficiary.swift,
                                        beneficiary.bank_address,
                                        beneficiary.intermediary_bank,
                                        beneficiary.intermediary_swift
                                    ];

                                    connection.query(
                                        insertSql,
                                        values,
                                        (insertError, insertResult) => {

                                            if (insertError) {

                                                return rollback(
                                                    connection,
                                                    res,
                                                    insertError,
                                                    'Error creating transfer'
                                                );
                                            }

                                            /* =========================
                                               Increment transfer number
                                            ========================= */

                                            const updateSettingsSql = `
                                                UPDATE company_settings
                                                SET next_transfer_number = ?
                                                WHERE id = ?
                                            `;

                                            const nextNumber =
                                                transferNumber + 1;

                                            connection.query(
                                                updateSettingsSql,
                                                [
                                                    nextNumber,
                                                    settings.id
                                                ],
                                                (updateError) => {

                                                    if (updateError) {

                                                        return rollback(
                                                            connection,
                                                            res,
                                                            updateError,
                                                            'Error updating transfer number'
                                                        );
                                                    }

                                                    /* =========================
                                                       Commit
                                                    ========================= */

                                                    connection.commit(
                                                        (commitError) => {

                                                            if (commitError) {

                                                                return rollback(
                                                                    connection,
                                                                    res,
                                                                    commitError,
                                                                    'Error committing transfer'
                                                                );
                                                            }

                                                            connection.release();

                                                            return res.status(201).json({
                                                                success: true,
                                                                message: 'Transfer created successfully',
                                                                data: {
                                                                    id: insertResult.insertId,
                                                                    reference,
                                                                    transfer_date,
                                                                    bank_id,
                                                                    debit_account,
                                                                    currency,
                                                                    amount: Number(amount),
                                                                    beneficiary_id
                                                                }
                                                            });
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        });
    });
};


/* =========================================
   Rollback helper
========================================= */

function rollback(
    connection,
    res,
    error = null,
    message = 'Transaction failed',
    statusCode = 500
) {

    if (error) {
        console.error(message, error);
    }

    connection.rollback(() => {

        connection.release();

        return res.status(statusCode).json({
            success: false,
            message,
            ...(error && {
                error: error.message
            })
        });
    });
}