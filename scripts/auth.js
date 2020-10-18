// offline data
db.enablePersistence()
  .catch(err => {
    if(err.code == 'failed-precondition'){
      console.log('persistence failed');
    } else if (err.code = 'unimplemented'){
      console.log('persistence is not available');
    }
  });

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    setupUI(user)
  } else {
    setupUI()
  }
});

// All Authentication Routes 
// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      name: signupForm['signup-name'].value
    });
  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    M.toast({html: 'Welcome!'});
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();

  // logout user
  auth.signOut().then(function() {
    M.toast({html: 'See you soon!'});
  }, function(error) {
    console.error('Sign Out Error', error);
  });
});

// Log In
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log in the user
  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    M.toast({html: 'Hey, Welcome back!'});
  });
});

// create item
const itemForm = document.querySelector('#create-item-form');
itemForm.addEventListener('submit', (e) => {
  e.preventDefault();

  file = itemForm['item_image'].files[0];
  const storageRef = storage.ref(file.name);
  storageRef.put(file).on('state_changed', (snap) => {
    let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
    // for uploading animation in case
    // setProgress(percentage);
  }, (err) => {
    console.log("error occur while creating item");
  }, async () => {
    const url = await storageRef.getDownloadURL();
    // storing item data to firestore
    db.collection('items').add({
      item_name: itemForm['item_name'].value,
      item_description: itemForm['item_desc'].value,
      item_price: itemForm['item_price'].value,
      item_cate: itemForm['category_options'].value,
      item_image: url,
      createdAt: firebase.firestore.Timestamp.now()
    }).then(() => {
      // close the modal and reset form
      const modal = document.querySelector('#modal-item');
      M.Modal.getInstance(modal).close();
      itemForm.reset();
      M.toast({html: `Item is successfully created!`});
    })
  })
});