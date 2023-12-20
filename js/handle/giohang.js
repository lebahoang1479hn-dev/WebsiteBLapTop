var modal = document.getElementById('myModal');

var btnCart = document.querySelector('.mid__header-login .cart');
var closeHeader = document.getElementsByClassName('close')[0];
var closeFooter = document.getElementsByClassName('close-footer')[0];
var order = document.getElementsByClassName('order')[0];

// Remove cart
var remove_carts = document.getElementsByClassName("btn-danger");

for (var i = 0; i < remove_carts.length; i++) {
    var button = remove_carts[i];
    button.addEventListener("click", function (e) {
        var button_remove = e.target;

        //Xóa cart-row
        button_remove.parentElement.parentElement.remove();

        //Xóa 1 sản phẩm thì cập nhật lại total
        updateCart();
    })
}

updateCart();
// Update cart
function updateCart() {
    var cart_item = document.getElementsByClassName('cart-items')[0];
    var cart_rows = cart_item.getElementsByClassName('cart-row');
    var total = 0;
    for (var i = 0; i < cart_rows.length; i++) {
        var cart_row = cart_rows[i];
        var price_item = cart_row.getElementsByClassName('cart-price')[0];
        var quantity_item = cart_row.getElementsByClassName('cart-quantity-input')[0];

        //Chuyển 1 chuỗi string sang number để tính tổng tiền
        var price = parseFloat(price_item.innerText);

        //Lấy giá trị trong thẻ input
        var quantity = quantity_item.value;

        total += (quantity * price);
    }

    // Thay đổi text = total trong .cart-total-price. Chỉ có một .cart-total-price nên sử dụng [0].
    document.getElementsByClassName('cart-total-price')[0].innerText = total + 'TrVNĐ';
}

// Thay đổi số lượng sản phẩm
var quantity_input = document.getElementsByClassName('cart-quantity-input');
for (var i = 0; i < quantity_input.length; i++) {
    var input = quantity_input[i];
    input.addEventListener('change', function (e) {
        input = e.target;
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1;
        }
        updateCart();
    })
}

// Thêm sản phẩm vào giỏ hàng
var add_cart = document.getElementsByClassName('addtocart__button');
for (var i = 0; i < add_cart.length; i++) {
    var add = add_cart[i];
    add.addEventListener('click', function (e) {
        var button = e.target;
        var product = button.parentElement.parentElement;
        var img = product.getElementsByClassName('img-js')[0].src;
        var title = product.getElementsByClassName('render__product-item--name')[0].innerText;
        var price = product.getElementsByClassName('render__product-item--price')[0].innerText;
        addItemToCart(img, title, price);

        //Khi thêm sản phẩm vào giỏ hàng thì hiển thị modal
        modal.style.display = 'block';
        updateCart();
    })
}

function addItemToCart(img, title, price) {
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cart_title = cartItems.getElementsByClassName('cart-item-title');

    //Nếu title của sản phẩm bằng với title mà bạn thêm vào giỏ hàng thì sẽ thông báo cho user.
    for (var i = 0; i < cart_title.length; i++) {
        if (cart_title[i].innerText == title) {
            alert('Sản phẩm đã có trong giỏ hàng');
            return;
        }
    }

    var cartRowContents = `
    <div class="cart-item cart-column">
        <img class="cart-item-image" src="${img}" width="100" height="100">
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger" type="button">Xóa</button>
    </div>`;

    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', function (e) {
        var button_remove = e.target;
        button_remove.parentElement.parentElement.remove();
        updatecart();
    })

    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', function (e) {
        var input = e.target;
        if (isNaN(input.value) || input.value <= 0) {
          input.value = 1;
        }
        updatecart();
      })
}


btnCart.onclick = function (e) {
    // Obigatory e.preventDefault to be able to run
    e.preventDefault()
    modal.style.display = 'block';
}
closeHeader.onclick = function () {
    modal.style.display = 'none';
}
closeFooter.onclick = function () {
    modal.style.display = 'none';
}
order.onclick = function () {
    alert('Cảm ơn bạn đã thanh toán đơn hàng');
}
window.onclick = function (e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}