const conn = require('../database/connection');

module.exports = {
  async create(req, res) {
    //const ong_id = req.headers.authorization;
    const { id } = req.body

    const ong = await conn('ongs')
      .where('id', id)
      .select('name')
      .first();
    
      if (!ong) {
        return res.status(400).json({
          error: 'No ONG found whit this id'
        })
      }
      console.log('Nova sessão registrada -> ','ONG:',id)
      res.json(ong)
  }
}