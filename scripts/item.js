var url_string = window.location.href;
var url = new URL(url_string);
var itemId = url.searchParams.get("item");

// get items data
db.collection('items').doc(itemId).get().then((snapshot) => {
    displayItem(snapshot.data());
})

db.collection('categories').onSnapshot(snapshot => {
    selectCateOption(snapshot.docs);
});

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
                <div class="col s12 m6" style="padding: 0;">
                    <div class="card-image inverted">
                        <img class="materialboxed" width="650" style="border-radius: 15px;" src="${data.item_image}">
                    </div>
                </div>
        
                <div class="col s12 m6 hide-on-small-only">
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
                    <div class="row" style="margin-bottom: 0px;">
                        <span class="card-title hide-on-med-and-up"><strong>${data.item_name}</strong></span>
                        <blockquote class="flow-text" style="margin: 10px 0">
                            &#8377;7484
                        </blockquote>
                    </div>
                    <div class="row inverted" style="margin-bottom:10px">
                        <a class="btn-small yellow waves-effect waves-light darken-2 z-depth-0 center-align" href="https://api.whatsapp.com/send?phone=919999999999&text=Wanted to know more about this: ${window.location.href}" style="width: 100%">Buy</a>
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
        
        // fill edit modal form
        document.getElementById("item_name").value = data.item_name; //name

        document.getElementById("item_desc").value = data.item_description; //description
        M.textareaAutoResize(document.getElementById("item_desc"));
        
        document.getElementById("item_price").value = data.item_price; //price

        document.getElementById("category_options").value = data.item_cate; //category
        M.FormSelect.init(document.getElementById("category_options"))

        // add dataId to update modal
        document.querySelector("#modal-item button").setAttribute("data-id", itemId);


        M.updateTextFields();


        
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
    db.collection('items').doc(itemId).get().then((item) => {
        const reference = storage.refFromURL(item.data().item_image);
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

// UPDATE ITEM
const updateItemForm = document.querySelector('#update-item-form');
updateItemForm.addEventListener('submit', evt => {
    evt.preventDefault();
    var data_id = document.querySelector('#update-item-form button').getAttribute('data-id');
    var item_image_url = null;
    
    db.collection('items').doc(data_id).get().then((item) => {
        
        item_image_url = item.data().item_image;
            // IF IMAGE IS REQUESTED TO BE UPDATED AS WELL
            if(updateItemForm['item_image'].value){          
            
                // DELETING OLD IMAGE
                const reference = storage.refFromURL(item.data().item_image);
                reference.delete().then(() => {
                    
                    // UPLOADING NEW IMAGE
                    file = updateItemForm['item_image'].files[0];
                    const storageRef = storage.ref(file.name);
                    storageRef.put(file).on('state_changed', (snap) => {
                        // let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
                        // for uploading animation in case
                        // setProgress(percentage);
                    }, (err) => {
                        console.log('error while uploading image');
                    }, async () => {
                        item_image_url = await storageRef.getDownloadURL();
                        db.collection('items').doc(data_id).update({
                            item_name: updateItemForm['item_name'].value,
                            item_description: updateItemForm['item_desc'].value,
                            item_price: updateItemForm['item_price'].value,
                            item_cate: updateItemForm['category_options'].value,
                            item_image: item_image_url,
                            updatedAt: firebase.firestore.Timestamp.now()
                        })

                    })
                })

            } else {
                db.collection('items').doc(data_id).update({
                    item_name: updateItemForm['item_name'].value,
                    item_description: updateItemForm['item_desc'].value,
                    item_price: updateItemForm['item_price'].value,
                    item_cate: updateItemForm['category_options'].value,
                    updatedAt: firebase.firestore.Timestamp.now()
                })
            }

        }).then(() => {

            const modal = document.querySelector('#modal-item');
            M.Modal.getInstance(modal).close();
            setTimeout(function(){
                window.location.reload();
                M.toast({html: 'Updated Succesfully!'});
            });

        })

});

        