const generateUniqueId = require('../utils/generateUniqueId')
const conn = require('../database/connection');

module.exports = {
    async index(req, res) {
        const ongs = await conn('ongs').select('*');
        res.send(ongs)
    },

    async create(req, res) {
        const {name, email, whatsapp, city, uf} = req.body;
        const id = generateUniqueId();

        await conn('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf
        })
        console.log('Nova ONG cadastrada -> ','Nome:',name,'ID:',id)        
        res.send({ ong_id: id})
    },

}