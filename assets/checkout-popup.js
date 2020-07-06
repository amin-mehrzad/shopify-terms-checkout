
window.onload = function () {
    //  alert('Page is loaded');




    var bodyElement = document.getElementsByTagName('body')[0];
    var bodyLastClassName = bodyElement.className;
  	var checkoutTermModal = document.getElementById('checkout-popup-background');
    window.setInterval(function () {
        //  console.log('hi');

        var bodyClassName = bodyElement.className;
        if (bodyClassName !== bodyLastClassName) {

            setTimeout(function(){ // check again in a second

            var checkoutDrawerButton = document.body.getElementsByClassName('btn btn--full cart__checkout drawer-button')[0];

          //  console.log(checkoutDrawerButton);

            checkoutDrawerButton.onclick = function(e) {
             //  here--->  alert("button was clicked");
              e.preventDefault();
              checkoutTermModal.style.display = "block";


             }

            // if (checkoutDrawerButton.clicked == true)
            //     alert('test');
             } , 1000);

            // bodyLastClassName = bodyClassName;
        }
    }, 10);
};