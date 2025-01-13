const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const nameInput = document.getElementById("name");
const addressWarn = document.getElementById("address-warn");
const bairroSelect = document.getElementById("bairro");
const taxaEntrega = document.getElementById("taxa-entrega");
const subtotal = document.getElementById("subtotal");
const formaPagamento = document.getElementById("forma-pagamento");
const chavePixContainer = document.getElementById("chave-pix-container");
const chavePixInput = document.getElementById("chave-pix");
const trocoContainer = document.getElementById("troco-container");
const valorTrocoInput = document.getElementById("valor-troco");
const chaveCriptoContainer = document.getElementById("chave-cripto-container");
const chaveCriptoInput = document.getElementById("chave-cripto");
const splash = document.querySelector('.splash');

// Função de splashScreen
document.addEventListener('DOMContentLoaded', (e)=>{
	setTimeout(()=>{
		splash.classList.add('display-none');
	}, 10000);

})

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() { 
  updateCartModal();
  cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
  if(event.target === cartModal){
    cartModal.style.display = "none"
  }
})

closeModalBtn.addEventListener("click", function(){
  cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){
  let parentButton = event.target.closest(".add-to-cart-btn")

  if(parentButton){
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    addToCart(name, price)
  }

})


// Função para adicionar no carrinho
function addToCart(name, price){
  const existingItem = cart.find(item => item.name === name)

  if(existingItem){
   existingItem.quantity += 1;

  }else{
    cart.push({
      name,
      price,
      quantity: 1,
    })
  }

  updateCartModal()
}


//Atualiza o carrinho
function updateCartModal(){
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        <button class="remove-from-cart-btn bg-red-500 text-white px-4 py-1 rounded" data-name="${item.name}">
          Remover
        </button>
      </div>
    `
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}


// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")
    removeItemCart(name);
  }
})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
    const item = cart[index];
    if(item.quantity > 1){
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}


addressInput.addEventListener("input", function(event){
  let inputValue = event.target.value;

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
})


// Finalizar pedido
checkoutBtn.addEventListener("click", function(){

  const isOpen = checkRestaurantOpen();
  if(!isOpen){
    Toastify({
      text: "Ops o restaurante está fechado!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if(cart.length === 0) return;
  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }
  if(nameInput.value === ""){
    alert("Por favor, insira o seu nome!");
    return;
  }

  const cartItems = cart.map((item) => {
    return (
      ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
    )
  }).join("")

  const message = encodeURIComponent(`Pedido de ${nameInput.value}:\n${cartItems}\nEndereço: ${addressInput.value}`)
  const phone = "5521994601961"

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank")

  cart = [];
  updateCartModal();

})


// Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
  const data = new Date();
  const hora = data.getHours();
  return hora >= 17 && hora < 22; 
}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}
