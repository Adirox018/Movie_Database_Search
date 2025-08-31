document.addEventListener('DOMContentLoaded', function() {
    var passwordInput = document.getElementById('password');
    var strengthMeter = document.getElementById('passwordStrength');

    passwordInput.addEventListener('keyup', function() {
        var password = passwordInput.value;


        strengthMeter.innerHTML = '';

        if (password.length < 8) {
            strengthMeter.innerHTML = '<span style="color: red;">Password must be at least 8 characters long.</span>';
            return;
        }

        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
        var mediumRegex = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})");

        if (strongRegex.test(password)) {
            strengthMeter.innerHTML = '<span style="color: green;">Strong password!</span>';
        } else if (mediumRegex.test(password)) {
            strengthMeter.innerHTML = '<span style="color: orange;">Medium password!</span>';
        } else {
            strengthMeter.innerHTML = '<span style="color: red;">Weak password!</span>';
        }
    });
});
