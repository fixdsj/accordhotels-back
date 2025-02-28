import Joi from 'joi';

const hotelSchema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.empty': `Le nom ne doit pas être vide.`,
                'string.min': `Le nom doit avoir une longueur minimale de {#limit} caractères.`,
                'string.max': `Le nom doit avoir une longueur maximale de {#limit} caractères.`,
                'any.required': `Le nom est requis.`
            }),
        location: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.empty': `L'emplacement ne doit pas être vide.`,
                'string.min': `L'emplacement doit avoir une longueur minimale de {#limit} caractères.`,
                'string.max': `L'emplacement doit avoir une longueur maximale de {#limit} caractères.`,
                'any.required': `L'emplacement est requis.`
            }),
        rating: Joi.number()
            .min(1)
            .max(5)
            .required()
            .messages({
                'number.base': `La note doit être un nombre.`,
                'number.min': `La note doit être supérieure ou égale à {#limit}.`,
                'number.max': `La note doit être inférieure ou égale à {#limit}.`,
                'any.required': `La note est requise.`
            }),
        price: Joi.number()
            .min(1)
            .required()
            .messages({
                'number.base': `Le prix doit être un nombre.`,
                'number.min': `Le prix doit être supérieur ou égal à {#limit}.`,
                'any.required': `Le prix est requis.`
            }),

        description: Joi.string()
            .min(2)
            .max(500)
            .required()
            .messages({
                'string.empty': `La description ne doit pas être vide.`,
                'string.min': `La description doit avoir une longueur minimale de {#limit} caractères.`,
                'string.max': `La description doit avoir une longueur maximale de {#limit} caractères.`,
                'any.required': `La description est requise.`
            }),

        picture: Joi.string()
            .uri()
            .required()
            .messages({
                'string.empty': `L'image ne doit pas être vide.`,
                'string.uri': `L'image doit être une URL valide.`,
                'any.required': `L'image est requise.`
            }),

        amenities: Joi.array()
            .items(Joi.string())
            .min(1)
            .required()
            .messages({
                'array.base': `Les équipements doivent être un tableau.`,
                'array.min': `Les équipements doivent avoir une longueur minimale de {#limit}.`,
                'any.required': `Les équipements sont requis.`
            }),

    }
);
export default hotelSchema;