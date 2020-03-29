const express = require('express')
const { celebrate,Segments, Joi } = require('celebrate')

const routes = express.Router();
const OngController = require('./controllers/OngController')
const IncidentController = require('./controllers/IncidentController')
const ProfileController = require('./controllers/ProfileController')
const SessionController = require('./controllers/SessionController')

routes.post('/sessions', celebrate({

    [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required(),
    }),

}), SessionController.create)



routes.get('/ongs',  OngController.index)

routes.post('/ongs', celebrate({

    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required().min(10).max(13),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2)
    })

}), OngController.create)


routes.post('/incidents', celebrate({

    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),

    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required().min(5),
        description: Joi.string().required().min(10),
        value: Joi.number().min(0),
    }),

}), IncidentController.create)

routes.get('/incidents',  celebrate({

    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number(),
    })

}),
IncidentController.index)

routes.delete('/incidents/:id', celebrate({

    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),

    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    }),

}),IncidentController.delete)



routes.get('/profile', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), ProfileController.index)


module.exports = routes;