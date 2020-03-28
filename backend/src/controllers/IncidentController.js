const conn = require('../database/connection')

module.exports = {
  async create(req, res) {
    const ong_id = req.headers.authorization;
    const { title, description, value } =  req.body;
    const [id] = await conn('incidents').insert({
      title,
      description,
      value,
      ong_id
    });
    res.json({id})
    console.log('Novo incidente cadastrado -> ','ONG:',ong_id,'Incidente:',title)
  },

  async index(req, res) {
    const { page = 1 } = req.query;
    const itensPerPage = 5;

    const [count] = await conn('incidents')
      .count();      
    console.log(count)

    const incidents = await conn('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(itensPerPage)
      .offset((page-1)*itensPerPage)
      .select([
        'incidents.*', 
        'ongs.name', 
        'ongs.email', 
        'ongs.whatsapp', 
        'ongs.city', 
        'ongs.uf'
      ]);

    res.header('X-Total-Count',count['count(*)'])
    res.header('X-Itens-Per-Page', itensPerPage)
    return res.json(incidents)    
  },

  async delete(req, res) {
    const { id } = req.params;
    const ong_id = req.headers.authorization;
    
    const incident = await conn('incidents')
    .where('id', id)
    .select('ong_id')
    .first();
    if (incident.ong_id !== ong_id) {
      return res.status(401).json({
        error: 'Operation not permitted'
      })
    }
    
    await conn('incidents')
    .where('id', id)
    .delete();
  
    console.log('Incidente deletado -> ','ONG:',ong_id,'Incidente:',id)
    return res.status(204).send();
  }
}