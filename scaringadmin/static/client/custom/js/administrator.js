/**
 * Created by narav on 6/8/2019.
 */
$(document).ready(function () {
    var disp_blocked = localStorage.getItem('admins_blocked');
    if (disp_blocked) {
        $('#div_administrators_active').addClass("hidden");
        $('#div_administrators_blocked').removeClass('hidden');
    } else {
        $('#div_administrators_active').removeClass("hidden");
        $('#div_administrators_blocked').addClass('hidden');
        $('#showDeleted').removeAttr('checked')
    }
});

function editAdmin(id) {
    $.ajax({
        url: '/ctgadmin/administrators/edit/'+id,
        method: 'get',
        success: function (res) {
            $('#username').val(res['username']);
            $('#f_name').val(res['f_name']);
            $('#l_name').val(res['l_name']);
            $('#email').val(res['email']);
            $('#r_email').val(res['r_email']);
            $('#m_email').val(res['m_email']);
            $('#address1').val(res['address1']);
            $('#address2').val(res['address2']);
            $('#address3').val(res['address3']);
            $('#city').val(res['city']);
            $('#state').val(res['state']);
            $('#country').val(res['country']);
            $('#zip_postal').val(res['zip_postal']);
            $('#phone_number').val(res['phone_number']);
            $('#phone_codeID').val(res['phone_codeID']);

            $('#form_edit_profile').attr('action', '/ctgadmin/administrators/update/'+id);
            $('#modal_edit_profile').modal();
        }
    })
}

function deleteAdmin(id) {
    if (confirm("Are you sure to delete this Admin?")) {
        $.ajax({
            url:'/ctgadmin/administrators/delete/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        })
    }
}

function restoreAdmin(id) {
    if (confirm("Are you sure to restore this Admin?")) {
        $.ajax({
            url:'/ctgadmin/administrators/restore/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        })
    }
}

function blockAdmin(id) {
    if (confirm("Are you sure to block this Admin?")) {
        $.ajax({
            url:'/ctgadmin/administrators/block/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        })
    }
}

jQuery('#btn_add_admin').click(function () {
    jQuery('#modal_add_admin').modal();
});

$('#showDeleted').change(function () {
    if ($('#showDeleted').prop('checked') === true) {
        $('#div_administrators_active').addClass("hidden");
        $('#div_administrators_blocked').removeClass('hidden');
        localStorage.setItem("admins_blocked", true)
    } else {
        $('#div_administrators_active').removeClass("hidden");
        $('#div_administrators_blocked').addClass('hidden');
        localStorage.removeItem('admins_blocked')
    }
});
