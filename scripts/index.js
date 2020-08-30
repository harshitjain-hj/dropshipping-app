// get items data
db.collection('items').onSnapshot(snapshot => {
  featuredItems('featured', snapshot.docs);
});

// get categories data
db.collection('categories').onSnapshot(snapshot => {
  setupCategories(snapshot.docs);
});

// create category
const categoryForm = document.querySelector('#create-category-form');
categoryForm.addEventListener('submit', (e) => {
  e.preventDefault();

  db.collection('categories').add({
    cat_name: categoryForm['cat_name'].value,
    cat_description: categoryForm['cat_description'].value,
    total_items: 0
  }).then(() => {
    // close the modal and reset form
    const modal = document.querySelector('#modal-category');
    M.Modal.getInstance(modal).close();
    categoryForm.reset();
    // console.log(cat_name);
    M.toast({html: `Category is successfully created!`});
  }).catch(err => {
    console.log('Hey smarty! How you doin?');
  });
});

// get data specific to category
const fetchItems = (categoryId) => {
    if (categoryId != 'featured') {
        db.collection('items').where("item_cate", "==", categoryId).onSnapshot(snapshot => {
            featuredItems(categoryId, snapshot.docs);
        });
    }
}