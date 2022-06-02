$(document).ready(function () {

    //get order cookie
    var prev_order = getCookie('order');
    var order_items = [];
    var dis = 0;
    if (prev_order != '') {
        console.log('bhara hua hai');
        var json_order = JSON.parse(prev_order);
        order_items = json_order[0];
        dis = json_order[1];

        order_items.forEach(item => {
            addItemToTableBody(item);
        });
    }


    var items = [
        {
            name: "Biryani",
            price: 200,
            image: "biryani.jpg",
        },
        {
            name: "Karhai",
            price: 400,
            image: "karhai.jpg",
        },
        {
            name: "Qorma",
            price: 600,
            image: "qorma.jpg",
        },
    ];
    var order = [];

    updateItems();
    setUpItemClickListener();

    async function updateItems() {


        //foreach on items

        await items.forEach(function (item) {

            var itemDiv = `
                <div class="p-4 item cursor-pointer transform hover:scale-105 duration-500 rounded shadow bg-white">
                <img src="assets/images/${item.image}" class="rounded-md" alt="" srcset="">
                <div class="flex justify-between">
                    <h1 class="mt-4 text-xl font-bold" id="name">${item.name}</h1>
                    <h1 class="mt-4 text-xl text-gray-400 font-bold" id="price" data-price="${item.price}">Rs.${item.price}</h1>
                </div>
            </div>
                `;
            $("#parentDiv").append(itemDiv);

        });


        $('#discount').change(function () {
            calculateTotalWithDiscount();
        });
    }

    function setUpItemClickListener() {
        $('.item').click(function () {

            var item_name = $(this).find('#name').text();
            var item_price = $(this).find('#price').data('price');

            var item_exists = checkIfItemExists(item_name);

            if (item_exists) {
                order_items.forEach(function (item) {
                    if (item.name === item_name) {
                        updateOrderItems(item.name, item.qty + 1);
                    }
                });
            } else {
                addItemToOrderItems(item_name, item_price);

                $('#qty_' + item_name).change(function () {
                    var qty = $(this).val();
                    updateOrderItems(item_name, qty);
                    calculateTotalWithDiscount();
                });
            }
            calculateTotalWithDiscount();
        });
    }

    function calculateTotalWithDiscount() {
        var dic_per = $('#discount').val() || 0;
        var total = 0;
        order_items.forEach(item => {
            total += item.total;
        });

        $("#subtotal").html("Rs." + total);
        var discount = total * dic_per / 100;
        $("#discountamount").html("Rs." + discount);
        $("#total").html("Rs." + (total - discount));
    }

    function updateOrderItems(item_name, qty) {
        order_items.forEach(function (item) {
            if (item.name == item_name) {
                item.qty = qty;
                item.total = item.qty * item.price;
                var currentItemSelected = $('#item_' + item_name);
                currentItemSelected.children()[2].children[0].value = item.qty;
                currentItemSelected.children()[4].innerHTML = "Rs." + item.total;
            }
        });
    }

    function addItemToTableBody(item) {
        var tableBody = $("#tableBody");

        var tableRow = `<tr class="bg-gray-500" id="item_${item.name}">
                        <td class="p-2">1</td>
                        <td class="p-2">${item.name}</td>
                        <td class="p-2">
                            <input type="number" id="qty_${item.name}" class="border-2  p-1 bg-transparent" value="${item.qty}" size="5" min="1" max="5">
                        </td>
                        <td class="p-2">Rs.${item.price}</td>
                        <td class="p-2">Rs.${item.price * item.qty}</td>
                        <td class="p-2 text-center"><button id="item_del_${item.name}" class="bg-red-500 text-white rounded-md shadow px-4 py-1">Delete</button></td>
                    </tr>`;



        tableBody.append(tableRow);

        $('#discount').val(parseFloat(dis));

        // $('#item_del_' + item.name).click(function () {
        //     $('#item_' + item.name).remove();

        //     order_items.forEach(function (itemm, index) {
        //         if (itemm.name == item.name) {
        //             order_items.splice(index, 1);
        //         }
        //     });

        calculateTotalWithDiscount();
        // });
    }

    function addItemToOrderItems(item_name, item_price) {
        itemObj = {
            name: item_name,
            price: item_price,
            qty: 1,
            total: item_price,
        };

        order_items.push(itemObj);

        addItemToTableBody(itemObj);

    }

    function checkIfItemExists(item_name) {
        var item_exists = false;
        order_items.forEach(function (item) {
            if (item.name == item_name) {
                item_exists = true;
            }
        });
        return item_exists;
    }

    $('#resetBtn').click(function () {
        order_items = [];
        calculateTotalWithDiscount();
        $('#tableBody').empty();
        $('#discount').val(0);

    });

    $('#confirmOrder').click(function () {

        var discount = $('#discount').val();
        order.push(order_items);
        order.push(discount || 0);
        //save order in cookie
        var order_json = JSON.stringify(order);
        //with 1 year expiry
        document.cookie = "order=" + order_json + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";

    });


    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

});