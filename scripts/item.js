var url_string = window.location.href
var url = new URL(url_string);
var itemId = url.searchParams.get("item");

// get items data
db.collection('items').doc(itemId).get().then((snapshot) => {
    displayItem(snapshot.data());
})

var itemContent = document.querySelector('.item_content');

// show item info 
const displayItem = (data) => {

    document.head.innerHTML += `
        <meta property="og:type" content="website"/>
        <meta property="og:image" content="${data.item_image}"/>  
        <meta property="og:url" content="${window.location.href}"/>
    `

    let html = '';
    if (data) {
        html = `
            <div class="row">
                <div class="col s12 m5" style="padding: 0;">
                    <div class="card-image inverted">
                        <img class="materialboxed" width="650" style="border-radius: 15px;" src="${data.item_image}">
                    </div>
                </div>
        
                <div class="col s12 m7 hide-on-small-only">
                    <div class="card-content">
                        <div class="row">
                            <h3 class="hide-on-small-only">${data.item_name}</h3>
                            <p class="flow-text">&#8377;7484</p>
                        </div>
                        <div class="row">
                            <button class="btn-small yellow waves-effect waves-light darken-2 z-depth-0 center-align" style="width: 100%">Buy</button>
                        </div>
                        <div class="row">
                            <p>
                                ${data.item_description}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col s12 m7 hide-on-med-and-up" style="padding: 20px 10px;">
                    <div class="row">
                        <span class="card-title hide-on-med-and-up"><strong>${data.item_name}</strong></span>
                        <blockquote class="flow-text">
                            &#8377;7484
                        </blockquote>
                    </div>
                    <div class="row inverted">
                        <a class="btn-small yellow waves-effect waves-light darken-2 z-depth-0 center-align" href="https://api.whatsapp.com/send?phone=919479512111&text=Wanted to know more about this: ${window.location.href}" style="width: 100%">Buy</a>
                    </div>
                    <hr/>
                    <div class="row">
                        <p>
                            ${data.item_description}
                        </p>
                    </div>
                </div>
        
            </div>
        `;

        // add dataId to delete modal
        document.querySelector("#modal-delete button").setAttribute("data-id", itemId);
        
    } else {
        html = `<div class="center">Nothing to show yet in this category!</br> Please check other!</div>`
    }
    itemContent.innerHTML = html;
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems, {});
}

// delete item
const deleteButton = document.querySelector('#modal-delete button');
deleteButton.addEventListener('click', evt => {
    var data_id = evt.target.getAttribute('data-id');
    storage.ref("apple_airpods.jfif")
    db.collection('items').doc(itemId).get().then((item) => {
        var reference = storage.refFromURL(item.data().item_image)
        reference.delete().then(() => {
            db.collection('items').doc(data_id).delete().then(() => {
                const modal = document.querySelector('#modal-delete');
                M.Modal.getInstance(modal).close();
                window.location.replace("/");
                M.toast({html: 'Deleted Succesfully!'});
            });
        })
    });
});