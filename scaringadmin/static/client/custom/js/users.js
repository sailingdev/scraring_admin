/**
 * Created by narav on 6/8/2019.
 */
$(document).ready(function () {
    var disp_blocked = localStorage.getItem('users_blocked');
    if (disp_blocked) {
        $('#div_users_active').addClass("hidden");
        $('#div_users_blocked').removeClass('hidden');
    } else {
        $('#div_users_active').removeClass("hidden");
        $('#div_users_blocked').addClass('hidden');
        $('#showDeleted').removeAttr('checked')
    }
});


function editUser(id) {
    $.ajax({
        url: '/ctgadmin/users/edit/'+id,
        method: 'get',
        success: function (res) {
            $('#display_name').val(res['username']);
            $('#firstname').val(res['f_name']);
            $('#lastname').val(res['l_name']);
            $('#email').val(res['email']);
            $('#r_email').val(res['r_email']);
            $('#m_email').val(res['m_email']);
            $('#address1').val(res['address1']);
            $('#address2').val(res['address2']);
            $('#address3').val(res['address3']);
            $('#city').val(res['city']);
            $('#state_province').val(res['state']);
            $('#country').val(res['country']);
            $('#zip_postal').val(res['zip_postal']);
            $('#phone_number').val(res['phone_number']);
            $('#phone_codeID').val(res['phone_codeID']);
            $('#birth').val(res['birth']);

            $('#form_edit_profile').attr('action', '/ctgadmin/users/update/'+id);
            $('#modal_edit_profile').modal();
        }
    })
}

function deleteUser(id) {
    if (confirm("Are you sure you want to delete this User?")) {
        $.ajax({
            url:'/ctgadmin/users/delete/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        })
    }
}

function restoreUser(id) {
    if (confirm("Are you sure you want to restore this User?")) {
        $.ajax({
            url:'/ctgadmin/users/restore/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        })
    }
}

function blockUser(id) {
    if (confirm("Are you sure you want to block this User?")) {
        $.ajax({
            url: '/ctgadmin/users/block/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        });
    }
}

function unblockUser(id) {
    $.ajax({
        url: '/ctgadmin/users/unblock/'+id,
        method: 'get',
        success: function (res) {
            location.reload();
        }
    })
}

function changePassword(id) {
    $('#form_reset_password').attr('action', '/ctgadmin/users/password/'+id);
    $('#modal_change_password').modal();
}

function addBlackList(e) {
    var ip = $(e).data('ip');

    $.ajax({
        url: '/ctgadmin/users/ip/block/'+ip,
        method: 'get',
        success: function (res) {
            window.location.reload();
        }
    })
}

jQuery('#btn_add_user').click(function () {
    $('#modal_add_user').modal();
});

$('#showDeleted').change(function () {
    if ($('#showDeleted').prop('checked') === true) {
        $('#div_users_active').addClass("hidden");
        $('#div_users_blocked').removeClass('hidden');
        localStorage.setItem("users_blocked", true)
    } else {
        $('#div_users_active').removeClass("hidden");
        $('#div_users_blocked').addClass('hidden');
        localStorage.removeItem('users_blocked')
    }
});
