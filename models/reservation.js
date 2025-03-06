import Joi from "joi";

const reservationSchema = Joi.object({
        user: Joi.string()
            .required()
            .messages({
                'string.empty': `L'utilisateur ne doit pas être vide.`,
                'any.required': `L'utilisateur est requis.`
            }),
        hotel: Joi.string()
            .required()
            .messages({
                'string.empty': `L'hôtel ne doit pas être vide.`,
                'any.required': `L'hôtel est requis.`
            }),
        check_in_date: Joi.date()
            .required()
            .messages({
                'date.base': `La date d'arrivée doit être une date.`,
                'any.required': `La date d'arrivée est requise.`,
                'any.invalid': `La date d'arrivée ne doit pas être nulle.`
            }),
        check_out_date: Joi.date()
            .required()
            .messages({
                'date.base': `La date de départ doit être une date.`,
                'any.required': `La date de départ est requise.`,
                'any.invalid': `La date de départ ne doit pas être nulle.`
            }),
        status: Joi.string()
            .valid('waiting', 'confirmed', 'cancelled')
            .required()
            .messages({
                'string.empty': `Le statut ne doit pas être vide.`,
                'any.only': `Le statut doit être 'active' ou 'cancelled'.`,
                'any.required': `Le statut est requis.`
            }),

        total_price: Joi.number()
            .min(1)
            .required()
            .messages({
                'number.base': `Le prix total doit être un nombre.`,
                'number.min': `Le prix total doit être supérieur ou égal à {#limit}.`,
                'any.required': `Le prix total est requis.`
            }),

    }
);
export default reservationSchema;