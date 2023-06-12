  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
  import { getDatabase, ref, push, get, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
  
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCCp8A-C7fuA6aNo0bLACty7f0pzrZTIqk",
    authDomain: "muambas-shop.firebaseapp.com",
    databaseURL: "https://muambas-shop-default-rtdb.firebaseio.com",
    projectId: "muambas-shop",
    storageBucket: "muambas-shop.appspot.com",
    messagingSenderId: "647727361533",
    appId: "1:647727361533:web:2a0abff8380a614d293d94",
    measurementId: "G-1Q9Y1Y2Z53"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
 


window.removeCartItem = function removeCartItem(event) {
 var removeButton = event.target;
 var cartItem = removeButton.closest('li');
 var cartItems = document.querySelector('.cart-items .shopping-list');
 cartItems.removeChild(cartItem);

 // Atualiza o número total de itens no carrinho
 var cartCount = document.querySelectorAll('.cart-items .total-items');
 for (var i = 0; i < cartCount.length; i++) {
  var totalCount = parseInt(cartCount[i].textContent) - 1;
  cartCount[i].textContent = totalCount;
 }

 // Calcula e exibe o total do carrinho
 updateCartTotal();



 // Remove o item do banco de dados
 var itemId = cartItem.dataset.itemId;
 removeCartItemFromDatabase(itemId);
}





// Função para carregar os dados de um produto
function loadProductData(productId) {
  const productRef = ref(database, `produtos/${productId}`);
  get(productRef).then((snapshot) => {
    if (snapshot.exists()) {
      const product = snapshot.val();
      // Preencher os elementos do card product details com os dados do produto index
      const productImage = document.getElementById(`product-image-${productId}`);
      productImage.src = product.image;
      productImage.alt = product.title;

      document.getElementById(`product-category-${productId}`).textContent = product.category;
      document.getElementById(`product-title-${productId}`).textContent = product.title;
      document.getElementById(`product-review-${productId}`).textContent = product.review;
      document.getElementById(`product-price-${productId}`).textContent = product.price;

      // Atualizar os atributos 'data' do botão "Adicionar ao carrinho"
      const addToCartButton = document.querySelector(`[data-id="${productId}"]`);
      addToCartButton.dataset.availablecolors = product.availablecolors.join(",");
      addToCartButton.dataset.image = product.image;
      addToCartButton.dataset.category = product.category;
      addToCartButton.dataset.title = product.title;
      addToCartButton.dataset.review = product.review;
      addToCartButton.dataset.price = product.price;
      addToCartButton.dataset.subtitle = product.subtitle;
      addToCartButton.dataset.details = product.details;
      addToCartButton.dataset.image1 = product.images[0];
      addToCartButton.dataset.image2 = product.images[1];
      addToCartButton.dataset.image3 = product.images[2];
      addToCartButton.dataset.image4 = product.images[3];
    }
  });
}


// Função para carregar os dados de todos os produtos da index
function loadAllProductsData() {
  const produtosRef = ref(database, 'produtos');

  // Obter uma lista dos IDs de todos os produtos no banco de dados
  get(produtosRef).then((snapshot) => {
    if (snapshot.exists()) {
      const produtos = snapshot.val();

      // Percorrer todos os produtos
      for (const productId in produtos) {
        // Chamar a função para carregar os dados do produto no card
        loadProductData(productId);
      }
    }
  }).catch((error) => {
    console.error(error);
  });
}

// Chamar a função para carregar os dados de todos os produtos somente na página index

var index = document.querySelector('.trending-product');

if (index) {
loadAllProductsData();
}




// Função para remover o item do banco de dados
function removeCartItemFromDatabase(itemId) {
  const usuarioId = "07";
  const usuarioRef = `${usuarioId}_usuario`;
  const carrinhoId = `${usuarioId}_carrinho`;
  const carrinhoRef = ref(database, `usuarios/${usuarioRef}/carrinho/${carrinhoId}/itens/${itemId}`);
  console.log(itemId);

  // Remove o item do banco de dados
  remove(carrinhoRef)
    .then(() => {
      console.log("Item removido do banco de dados com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao remover o item do banco de dados:", error);
    });
}



// Variável global para armazenar o produto selecionado
window.selectedProduct = null;

// Função para adicionar um item ao carrinho
function addToCart() {
 // Coleta os dados do produto
 var productTitle = document.getElementById('product-title').textContent;
 var productImage = document.getElementById('product-image1').src;
 var productPrice = parseFloat(document.getElementById('product-price').textContent.replace('R$', ''));
 var productQuantity = parseInt(document.querySelector('.quantity select').value);
 var productId = document.getAttribute('data-id');

 // Coleta as cores selecionadas
 var selectedColors = Array.from(document.querySelectorAll('.color-option input:checked + label span'))
  .map(span => span.getAttribute('data-color'));

 // Verifica se o número de cores selecionadas não é maior que a quantidade de itens selecionados
 if (selectedColors.length > productQuantity) {
  alert('O número de cores selecionadas não pode ser maior que a quantidade de itens selecionados.');
  return;
 }

 // Calcula o subtotal do item
 var itemTotal = productPrice * productQuantity;

 // Cria o objeto do item do carrinho
 var cartItem = {
  title: productTitle,
  image: productImage,
  price: productPrice,
  quantity: productQuantity,
  colors: selectedColors
 };

 // Armazena o produto selecionado na variável global
 selectedProduct = cartItem;
 



 // Cria o elemento do item do carrinho
 var cartItem = document.createElement('li');
 cartItem.innerHTML = `
    <a href="javascript:void(0)" class="remove" title="Remove this item"><i class="lni lni-close"></i></a>
    <div class="cart-img-head">
      <a class="cart-img"><img class="img-cart" src="${productImage}" alt="#"></a>
    </div>
    <div class="content">
      <h4><a href="product-details.html">${productTitle}</a></h4>
      <p class="quantity">${productQuantity}x - <span class="amount">R$${(productPrice * productQuantity).toFixed(2)}</span></p>
      <p class="color">Cores: ${selectedColors.join(', ')}</p>
    </div>
  `;

 // Adiciona o item ao carrinho
 var cartItems = document.querySelector('.cart-items .shopping-list');
 cartItems.appendChild(cartItem);


 // Calcula e exibe o total do carrinho
 enviarProdutoParaBanco(selectedProduct);
 updateCartTotal();
 loadCartData();
 
}

// Função para carregar os dados do carrinho do banco de dados
function loadCartData() {
  const usuariosRef = ref(database, "usuarios");
  const usuarioId = "07";
  const usuarioRef = `${usuarioId}_usuario`;
  const carrinhoId = `${usuarioId}_carrinho`;
  const carrinhoRef = ref(database, `usuarios/${usuarioRef}/carrinho/${carrinhoId}`);

  // Escuta as alterações no carrinho do usuário
  onValue(carrinhoRef, (snapshot) => {
    const carrinhoData = snapshot.val();

    if (carrinhoData && carrinhoData.itens) {
      const cartItems = Object.values(carrinhoData.itens);

      // Limpa os itens existentes no carrinho
      var cartItemsContainer = document.querySelector('.cart-items .shopping-list');
      cartItemsContainer.innerHTML = '';

      cartItems.forEach((item) => {
        var cartItem = document.createElement('li');
        cartItem.innerHTML = `
          <a href="javascript:void(0)" onclick="removeCartItem(event);" class="remove" title="Remove this item"><i class="lni lni-close"></i></a>
          <div class="cart-img-head">
            <a class="cart-img" href="#"><img src="${item.imagem}" alt="#"></a>
          </div>
          <div class="content">
            <h4><a href="product-details.html">${item.titulo}</a></h4>
            <p class="quantity">${item.quantidade}x - <span class="amount">R$${(item.preco_unitario * item.quantidade).toFixed(2)}</span></p>
            ${item.cores_selecionadas ? `<p class="color">Cores: ${item.cores_selecionadas.join(', ')}</p>` : ''}
          </div>
        `;
        cartItemsContainer.appendChild(cartItem);
      });

      // Atualiza o número total de itens no carrinho
      var cartCount = document.querySelectorAll('.cart-items .total-items');
      for (var i = 0; i < cartCount.length; i++) {
        var totalCount = cartItems.length;
        cartCount[i].textContent = totalCount;
      }

      // Calcula e exibe o total do carrinho
      updateCartTotal();
    }
  });
}

loadCartData();

// Função para calcular e exibir o total do carrinho
function updateCartTotal() {
  var cartItems = document.querySelectorAll('.cart-items .shopping-list li');
  var total = 0;

  for (var i = 0; i < cartItems.length; i++) {
    var amountElement = cartItems[i].querySelector('.amount');
    var amount = parseFloat(amountElement.textContent.replace('R$', ''));
    var quantityElement = cartItems[i].querySelector('.quantity');
    var quantity = parseInt(quantityElement.textContent);
    total += amount;
  }

  // Atualiza o total do carrinho
  var totalAmountElement = document.querySelector('.cart-items .total-amount');
  totalAmountElement.textContent = 'R$' + total.toFixed(2);
}

// Função para enviar dados para o banco de dados
function enviarParaBanco(cartData) {
  const usuarioId = "07";
  const usuarioRef = `${usuarioId}_usuario`;
  const carrinhoId = `${usuarioId}_carrinho`;
  const carrinhoRef = ref(database, `usuarios/${usuarioRef}/carrinho/${carrinhoId}`);

  // Define os dados a serem enviados para o banco de dados
  const dataCriacao = new Date().toISOString();

  console.log("Tentando obter os dados do carrinho...");

  // Verifica se o carrinho existe
  get(carrinhoRef)
   .then((snapshot) => {
     console.log("Dados do carrinho obtidos com sucesso!");

     let carrinhoData = {};

     try {
      carrinhoData = snapshot.val() || {};
      console.log("Dados do carrinho antes da atualização:", carrinhoData);
     } catch (error) {
      console.error("Erro ao obter os dados do carrinho:", error);
      return;
     }
     
      // Se o carrinho já existe, verifica o número do próximo item
      let proximoItemNumero = 1;
      if (carrinhoData.itens) {
        const itensKeys = Object.keys(carrinhoData.itens);
        const ultimoItemKey = itensKeys[itensKeys.length - 1];
        const ultimoItemNumero = parseInt(ultimoItemKey.split("_")[2]);

        proximoItemNumero = ultimoItemNumero + 1;
      } else {
        carrinhoData.itens = {}; // Inicializa carrinhoData.itens como um objeto vazio se for null
      }

      // Preenche os itens do carrinho com os dados da cartData
      cartData.forEach((item) => {
        // Verifica se o item já existe no carrinho
        let itemExistente = false;
        let itemIdExistente = null;
        for (const itemId in carrinhoData.itens) {
          const itemCarrinho = carrinhoData.itens[itemId];
          if (
            itemCarrinho.titulo === item.title &&
            itemCarrinho.preco_unitario === item.price &&
            arraysEqual(itemCarrinho.cores_selecionadas, item.colors) &&
            itemCarrinho.quantidade === item.quantity
          ) {
            itemExistente = true;
            itemIdExistente = itemId;
            break;
          }
        }

        // Se o item existe no carrinho, atualiza as informações
        if (itemExistente) {
          const itemData = {
            titulo: item.title,
            preco_unitario: item.price,
            cores_selecionadas: item.colors,
            quantidade: item.quantity,
            imagem: item.image
          };

          carrinhoData.itens[itemIdExistente] = itemData;
          console.log(`Item '${item.title}' atualizado no carrinho.`);
        } else {
          // Se o item não existe no carrinho, adiciona como um novo item
          let itemExistenteComDiferencas = false;
          let itemIdExistenteComDiferencas = null;

          for (const itemId in carrinhoData.itens) {
            const itemCarrinho = carrinhoData.itens[itemId];
            if (
              itemCarrinho.titulo === item.title &&
              arraysEqual(itemCarrinho.cores_selecionadas, item.colors)
            ) {
              itemExistenteComDiferencas = true;
              itemIdExistenteComDiferencas = itemId;
              break;
            }
          }

          if (itemExistenteComDiferencas) {
            const itemData = {
              titulo: item.title,
              preco_unitario: item.price,
              cores_selecionadas: item.colors,
              quantidade: item.quantity,
              imagem: item.image
            };

            carrinhoData.itens[itemIdExistenteComDiferencas] = itemData;
            console.log(`Item '${item.title}' atualizado no carrinho com diferenças.`);
          } else {
            const itemId = `${usuarioId}_item_${proximoItemNumero}`;
            const itemData = {
              titulo: item.title,
              preco_unitario: item.price,
              cores_selecionadas: item.colors,
              quantidade: item.quantity,
              imagem: item.image
            };

            carrinhoData.itens[itemId] = itemData;
            console.log(`Novo item '${item.title}' adicionado ao carrinho.`);
            proximoItemNumero++;
          }
        }
      });

      // Atualiza a data de criação do carrinho
      carrinhoData.data_criacao = dataCriacao;

      console.log("Dados do carrinho após a atualização:", carrinhoData);

      // Envia os dados atualizados para o banco de dados
      set(carrinhoRef, carrinhoData)
        .then(() => {
          console.log("Dados enviados com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao enviar os dados:", error);
        });
    })
    .catch((error) => {
      console.error("Erro ao obter os dados do carrinho:", error);
    });
    // Função para comparar arrays
    function arraysEqual(arr1, arr2) {
     if (arr1.length !== arr2.length) {
      return false;
     }
     for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
       return false;
      }
     }
     return true;
    }
}

// Função para enviar o produto individual para o banco de dados
function enviarProdutoParaBanco() {
 // Verifica se há um produto selecionado
 if (selectedProduct) {
  // Envia o produto para o banco de dados
  enviarParaBanco([selectedProduct]);
  // Limpa o produto selecionado da variável global
  selectedProduct = null;
 } else {
  console.error('Nenhum produto selecionado para enviar para o banco de dados.');
 }
}






// Adiciona um listener de evento ao botão "addToCartButton"
var addToCartButton = document.getElementById('addToCartButton');
if (addToCartButton) {
addToCartButton.addEventListener('click', function() {
  addToCart();
});}

