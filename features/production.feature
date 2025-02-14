Funcionalidade: Atualizar status do pedido

  Cenário: Atualizar status com sucesso
    Dado que eu tenho um pedido existente com ID 123
    Quando eu envio uma requisição PUT para "/orders" com o status "RECEIVED"
    Então a resposta deve ter status 200
    Então o status do pedido deve ser "RECEIVED"

  Cenário: Atualizar status com ID inválido
    Dado que eu tenho um ID de pedido inválido
    Quando eu envio uma requisição PUT para "/orders"
    Então a resposta deve ter status 400

  Cenário: Atualizar status sem autenticação
    Dado que eu não estou autenticado
    Quando eu envio uma requisição PUT para "/orders"
    Então a resposta deve ter status 401