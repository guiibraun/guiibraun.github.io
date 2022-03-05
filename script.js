const c = (e) => document.querySelector(e)
const cs = (e) => document.querySelectorAll(e)


let cart = []
let modalQt = 1
let modalKey = 0

//LISTAGEM DAS PIZZAS
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true) //cloneNode vai pegar o próprio item e tudo que tem dentro dele e clonar

    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}` 
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    
    c('.pizza-area').append(pizzaItem) //Append vai adicionar conteúdo na div
    //EVENTO DE CLICK PARA ABRIR O MODAL E MOSTRAR AS INFOS DE CADA PIZZA

    pizzaItem.querySelector('a').addEventListener('click', (e) => { //parametro "e" é o evento em si, no caso o evento de atualizar pagina quando clicado na tag "<a></a>"
            //essa função preventDefault() vai neutralizar o evento de dar reload na pagina quando
            e.preventDefault()
            modalQt = 1
           
            let key = e.target.closest('.pizza-item').getAttribute('data-key') 
            /*e depois vem a parte importante ele declara a variável key recebendo aquele atributo data-key que nós setamos lá no início, e ele contém a localização do objeto correspondente aquele item dentro do pizzaJson, então quando nós colocamos o valor dele na variável key, estamos salvando a localização desse pizzaItem no pizzaJson lá.
            Ai depois para acessar isso é fácil, você acessa ele pelo index igual você faria em qualquer array, através dos [].*/
            modalKey = key
            /*Construindo as informações no modal de acordo com o item clicado*/
            /*pizzaJson para acessar o ARRAY com os itens, [key] pra pegar o index do item clicado, está sendo passado como atributo em data-key*/
            c('.pizzaBig img').src = pizzaJson[key].img
            c('.pizzaInfo h1').innerHTML = pizzaJson[key].name
            c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
            c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`

            c('.pizzaInfo--size.selected').classList.remove('selected')
            
            cs('.pizzaInfo--size').forEach((size, sizeIndex)=> {
                if(sizeIndex == 2) {
                    size.classList.add('selected')
                }
                size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
            })

            c('.pizzaInfo--qt').innerHTML = modalQt

            
            /*Fim da construção do modal*/
            c('.pizzaWindowArea').style.opacity= 0
            c('.pizzaWindowArea').style.display = 'flex'
            setTimeout(function(){
                c('.pizzaWindowArea').style.opacity= 1
            }, 100)
            

        })


})

//EVENTOS DO MODAL
function fecharModal(){
    c('.pizzaWindowArea').style.opacity= 0
    setTimeout(()=>{
        document.querySelector('.pizzaWindowArea').style.display = 'none'
    }, 500)
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelButton').forEach(item =>{
    item.addEventListener('click', fecharModal)
})

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    
    if(modalQt > 1){
        modalQt--
        c('.pizzaInfo--qt').innerHTML = modalQt
    }
})


c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++
    c('.pizzaInfo--qt').innerHTML = modalQt
    
})

//Seleção de Item para desmarcar os outros itens quando clica em um item
cs('.pizzaInfo--size').forEach((size, sizeIndex)=> {
    size.addEventListener('click', function(e){
        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    
    })
    
})

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    // Qual a Pizza
    // Qual o tamanho selecionado
    //quantidade de pizza
    let tamanhoPizza = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))
    
    let identifier = pizzaJson[modalKey].id + '@' + tamanhoPizza

    let verificarCart = cart.findIndex(item =>{
        return item.identifier == identifier
    })

    if(verificarCart > -1) {
        cart[verificarCart].qt += modalQt
    } else {
        cart.push({
            identifier: identifier,
            id: pizzaJson[modalKey].id,
            size: tamanhoPizza,
            qt: modalQt
        })
    }

    updateCart()
    fecharModal()

})



function updateCart(){ //função para atualizar o carrinho caso a pessoa adicione mais pizzas

    c('.menu-openner span').innerHTML = cart.length // Adicionar no carrinho mobile

    if(cart.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = ''
        let subtotal = 0;
        let desconto = 0;
        let total = 0

        for(let i in cart){
            let pizzaItem = pizzaJson.find(item => {
                return item.id == cart[i].id
            })
            subtotal += pizzaItem.price * cart[i].qt
            console.log(subtotal)
            let pizzaSizeName

            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'Pequena'
                    break
                case 1:
                    pizzaSizeName = 'Média'
                    break
                case 2:
                    pizzaSizeName = 'Grande'
                    break
                default:
                    pizzaSizeName = 'Este tamanho não existe'
                    alert('Este tamanho não existe')
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
            
            let cartItem = c('.models .cart--item').cloneNode(true)
            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--
                    
                } else {
                    cart.splice(i, 1)
                }
                updateCart()

            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++
                updateCart()
            })

            c('.cart').append(cartItem)
            
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto
        
        c('.cart--totalitem.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.cart--totalitem.desconto span:last-child').innerHTML = `Total de desconto: R$ ${desconto.toFixed(2)}`
        c('.cart--totalitem.total.big span:last-child').innerHTML = `R$ ${total.toFixed(2)}`


    } else {
        c('aside').classList.remove('show')
        c('aside').style.left = '100vw'
    }

}
c('.menu-openner').addEventListener('click', function(){
    if(cart.length > 0){
        c('aside').style.left = '0'
    }
})
c('.menu-closer').addEventListener('click', function(){
        c('aside').style.left = '100vw'

})
c('.pizzaInfo--cancelMobileButton').addEventListener('click', function(){
        c('.pizzaWindowArea').style.display = 'none'

})





