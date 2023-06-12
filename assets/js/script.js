// Função para remover um item do carrinho



const addToCartButtons = document.querySelectorAll('.add-to-cart');


addToCartButtons.forEach(button => {
  button.addEventListener('click', function() {
    const productData = {
      id: button.getAttribute('data-id'),
      image: button.getAttribute('data-image'),
      image1: button.getAttribute('data-image1'),
      image2: button.getAttribute('data-image2'),
      image3: button.getAttribute('data-image3'),
      image4: button.getAttribute('data-image4'),
      category: button.getAttribute('data-category'),
      title: button.getAttribute('data-title'),
      review: button.getAttribute('data-review'),
      price: button.getAttribute('data-price'),
      subtitle: button.getAttribute('data-subtitle'),
      details: button.getAttribute('data-details'),
      colors: button.getAttribute('data-availablecolors'),
    };

    // Obter a cor selecionada
    const selectedColors = Array.from(document.querySelectorAll('.color-option input:checked + label span'))
      .map(span => span.getAttribute('data-color'));

    productData.selectedColors = selectedColors;

    localStorage.setItem('productData', JSON.stringify(productData));
  });
});

window.addEventListener('beforeunload', function() {
  // Verificar se há dados do produto armazenados no localStorage
  if (localStorage.getItem('productData')) {
    const productData = JSON.parse(localStorage.getItem('productData'));
    sessionStorage.setItem('productData', JSON.stringify(productData));
  }
});

// Verificar se há dados do produto armazenados no sessionStorage
if (sessionStorage.getItem('productData')) {
  const productData = JSON.parse(sessionStorage.getItem('productData'));
  const availableColors = productData.colors.split(',');

  const colorOptionContainer = document.getElementById('colorOptions');
  const colors = productData.colors.split(',');

  colors.forEach((color, index) => {
    const checkboxDiv = document.createElement('div');
    checkboxDiv.classList.add('single-checkbox');

    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.id = `checkbox-${color}`;
    checkboxInput.checked = true;
    checkboxDiv.appendChild(checkboxInput);

    const checkboxLabel = document.createElement('label');
    checkboxLabel.setAttribute('for', `checkbox-${color}`);
    const span = document.createElement('span');
    span.setAttribute('data-color', color);

    checkboxLabel.appendChild(span);
    checkboxDiv.appendChild(checkboxLabel);

    const checkboxStyleClass = `checkbox-style-${index + 1}`;
    checkboxDiv.classList.add(checkboxStyleClass);

    checkboxInput.addEventListener('change', function() {
      const selectedCheckboxes = document.querySelectorAll('.single-checkbox input:checked');
      selectedCheckboxes.forEach((checkbox) => {
        checkbox.parentNode.classList.add('checked');
      });

      const uncheckedCheckboxes = document.querySelectorAll('.single-checkbox input:not(:checked)');
      uncheckedCheckboxes.forEach((checkbox) => {
        checkbox.parentNode.classList.remove('checked');
      });
    });

    const style = document.createElement('style');
    style.innerHTML = `
      .item-details .product-info .form-group.color-option .single-checkbox.${checkboxStyleClass} input[type="checkbox"]+label span {
        border: 2px solid ${color};
      }
      .item-details .product-info .form-group.color-option .single-checkbox.${checkboxStyleClass} input[type="checkbox"]+label span::before {
        background-color: ${color};
      }
    `;
    document.head.appendChild(style);

    colorOptionContainer.appendChild(checkboxDiv);
  });

  // Definir os elementos onde os dados do produto serão exibidos
  const productImage = document.getElementById('current');
  const productImage1 = document.getElementById('product-image1');
  const productImage2 = document.getElementById('product-image2');
  const productImage3 = document.getElementById('product-image3');
  const productImage4 = document.getElementById('product-image4');
  const productCategory = document.getElementById('product-category');
  const productTitle = document.getElementById('product-title');
  const productPrice = document.getElementById('product-price');
  const productDescription = document.getElementById('product-description');
  const productDetails = document.getElementById('product-details');
  const productId = document.getElementById('.data-id');

  // Atualizar os elementos com os dados do produto
  productImage.src = productData.image;
  productImage1.src = productData.image1;
  productImage2.src = productData.image2;
  productImage3.src = productData.image3;
  productImage4.src = productData.image4;
  productCategory.innerHTML += ' <a href="javascript:void(0)">' + productData.category + '</a>';
  productTitle.innerHTML = productData.title;
  productPrice.innerHTML = productData.price;
  productDescription.innerHTML = productData.subtitle;
  productDetails.innerHTML = productData.details;
  productId.setAttribute('data-IdP',  productData.id);
  // Armazenar os dados do produto no localStorage ao carregar a página
  localStorage.setItem('productData', JSON.stringify(productData));
}

// Limpar os dados do produto ao sair da página
window.addEventListener('beforeunload', function() {
  localStorage.removeItem('productData');
});
