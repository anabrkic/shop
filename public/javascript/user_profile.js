var $form = $('#user_profile-form');

$form.submit(function(event) {
    $form.find('button').prop('disabled', true);
    Userprofile.createToken({
        firstname: $('#firstname').val(),
        surname: $('#surname').val(),
        address: $('#address').val(),
        city: $('#city').val(),
        phone: $('#phone').val(),
    }, userprofileHandler);
    return false;
});

function userprofileHandler(status, response) {
    if (response.error) {
        $('#editprofile-errors').text(response.error.message);
        $('#editprofile-errors').removeClass('hidden');
        $form.find('button').prop('disabled', false);
    }
    else {
        var token = response.id;

        $form.append($('<input type="hidden" name="userprofileToken" />').val(token));
        $form.get(0).submit();
    }
}