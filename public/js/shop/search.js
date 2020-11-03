var search = document.querySelector('#search-product');
var products = document.querySelectorAll('.pItem');
var searchResult = document.querySelector('#search-result');

var data = [];
products.forEach((x) => {
    data.push({
        id: x.dataset.productId,
        name: x.dataset.productName,
        image: x.dataset.imageLink,
    });
});

search.addEventListener('keyup', (e) => {
    // Clear Search Result
    searchResult.innerHTML = '';

    var query = e.target.value;

    res = [];
    data.forEach((item) => {
        if (item.name.toLowerCase().includes(query.toLowerCase())) {
            res.push(item);
        }
    });

    if (res.length === 0) {
        searchResult.innerHTML = 'No Items Found!';
    }

    // Constructing the list

    if (query === '') {
        searchResult.innerHTML = '';
    } else {
        for (var i = 0; i < res.length; i++) {
            var li = document.createElement('li');
            li.classList.add('list-group-item');

            var img = document.createElement('img');
            img.src = res[i].image;
            img.setAttribute('width', '90');
            img.setAttribute('height', '60');
            img.style.margin = '5px';

            var a = document.createElement('a');
            a.href = `/products/${res[i].id}`;
            a.innerText = res[i].name;

            li.appendChild(img);
            li.appendChild(a);
            searchResult.appendChild(li);
        }
    }
});
