
window.onload = function () {
    //  alert('Page is loaded');




    var bodyElement = document.getElementsByTagName('body')[0];
    var bodyLastClassName = bodyElement.className;
    window.setInterval(function () {
        //  console.log('hi');

        var bodyClassName = bodyElement.className;
        if (bodyClassName !== bodyLastClassName) {

            setTimeout(function(){ // check again in a second

            var checkoutDrawerButton = document.body.getElementsByClassName('btn btn--full cart__checkout drawer-button')[0];

            console.log(checkoutDrawerButton);

            checkoutDrawerButton.onclick = function() {
                alert("button was clicked");
             }​;

            // if (checkoutDrawerButton.clicked == true)
            //     alert('test');
             } , 1000);

            // bodyLastClassName = bodyClassName;
        }
    }, 10);
};