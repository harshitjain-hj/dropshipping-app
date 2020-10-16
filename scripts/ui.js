const cateList = document.querySelector('.categories');
const cateContent = document.querySelector('.categories_content');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const sideNavName = document.querySelector('.name');
const sideNavEmail = document.querySelector('.email');
const sideNavUser = document.querySelector('.user');
const categoryOption = document.querySelector('#category_options');

const setupUI = (user) => {
    if(user) {
        // account info
        db.collection('users').doc(user.uid).get().then(doc => {
            sideNavEmail.innerHTML = user.email;
            sideNavName.innerHTML = doc.data().name;
            sideNavUser.src = 'https://media-exp1.licdn.com/dms/image/C4D03AQECCGZW4zS2NA/profile-displayphoto-shrink_400_400/0?e=1608163200&v=beta&t=zgAZVqFzY3PXPK3uxfxw21jVPFK1BhpE1pEO6DREfpw';
            const html = `
                <div>Hello ${doc.data().name}</div>
                <div>You are logged in as ${user.email}</div>
            `;
            accountDetails.innerHTML = html;
        });
        
        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');

    } else {
        // hide account info
        sideNavEmail.innerHTML = 'You are not Signed In';
        sideNavName.innerHTML = 'Guest';
        accountDetails.innerHTML = '';
        sideNavUser.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSta68gh8SBU8r4ja3Y8f1g_ikz0_1VpZNBQg&usqp=CAU'

        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}

const setupCategories = (data) => {
    let html = '';
    data.forEach(doc => {
        const category = doc.data();
        const li = `
            <li class="tab"><a href="#${doc.id}">${category.cat_name}</a></li>
        `;
        html += li;

        cateContent.innerHTML += `
            <div id="${doc.id}">
                <h5 class="center grey-text text-darken-2">Loading...</h5>
                <div class="progress" style="margin: auto; width: 40%;">
                <div class="indeterminate"></div>
                </div>
            </div>
        ` 
        // filling option in create item form
        var option = document.createElement("option");
        option.text = category.cat_name;
        option.value = doc.id;
        categoryOption.add(option);

    });
    cateList.innerHTML += html;
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
    var tab = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(tab, {onShow: onShow});
    function onShow (category){
        var catId = category.id
        // console.log(catId);
        fetchItems(catId);      
    }
}

const selectCateOption = (data) => {
    data.forEach(doc => {
        const category = doc.data();
        // filling option in create item form
        var option = document.createElement("option");
        option.text = category.cat_name;
        option.value = doc.id;
        categoryOption.add(option);
    });
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
}

const featuredItems = (cateId, data) => {
    var featuredContent = document.querySelector(`#${cateId}`);
    let html = '';
    if (data.length > 0) {
        html = `<div class="row">`;
        data.forEach(doc => {
            const item_data = doc.data();
            const item = `
            <div class="col s6 m6 l3">
                <a class="" href="/item.html?item=${doc.id}">
                    <div class="card grey lighten-4 z-depth-0">
                        <div class="card-image inverted">
                            <img src="${item_data.item_image}" style="border-radius: 5%;">
                        </div>
                        <div class="card-content" style="padding: 2px 0px 2px 0px;">
                            <p class="grey-text">${item_data.item_name}</br><span class="black-text">&#8377;${item_data.item_price}</span></p>
                        </div>
                    </div>
                </a>
            </div>
            `;
            html += item;
        });
        html += `</div>`;
    } else {
        html = `<div class="center">Nothing to show yet in this category!</br> Please check other!</div>`
    }
    featuredContent.innerHTML = html;
}


// setup materialize components
document.addEventListener('DOMContentLoaded', function() {
    var menu = document.querySelectorAll('.sidenav');
    M.Sidenav.init(menu, {});

    const closeSideNav = () => {
        const menu = document.querySelector('.sidenav');
        M.Sidenav.getInstance(menu).close();
    }

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals, {onOpenStart: closeSideNav});

  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    var floatadd = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(floatadd, {direction: 'top', hoverEnabled: false});
});

// dark theme toogle
var checkbox = document.querySelector('input[name=theme]');

checkbox.addEventListener('change', function() {
    document.documentElement.classList.toggle('dark-mode');
    document.querySelectorAll('.inverted').forEach((result) => {
        result.classList.toggle('invert');
    });
})