/**
 * Created by narav on 6/8/2019.
 */
// IP address Mask function
$(function () {
    var options =  {
        onKeyPress: function(text, event, currentField, options){
            if (text){
                var ipArray = text.split(".");
                var lastValue = ipArray[ipArray.length-1];
                if(lastValue != "" && parseInt(lastValue) > 255){
                    ipArray[ipArray.length-1] = '255';
                    var resultingValue = ipArray.join(".");
                    currentField.text(resultingValue).val(resultingValue);
                }
            }
        },
        translation: {
                'Z': {
                    pattern: /[0-9]/, optional: true
                }
        }
    };

    $("#ip-address").mask("0ZZ.0ZZ.0ZZ.0ZZ", options);
    $("#ip-address-edit").mask("0ZZ.0ZZ.0ZZ.0ZZ", options);
    $("#black-ip-address-add").mask("0ZZ.0ZZ.0ZZ.0ZZ", options);
    $("#black-ip-address-edit").mask("0ZZ.0ZZ.0ZZ.0ZZ", options);
});

$(document).ready(function () {
    var disp_whitelist = localStorage.getItem('whitelist_deleted');
    if (disp_whitelist) {
        $('#div_whitelist_active').addClass("hidden");
        $('#div_whitelist_deleted').removeClass('hidden');
    } else {
        $('#div_whitelist_active').removeClass("hidden");
        $('#div_whitelist_deleted').addClass('hidden');
        $('#showDeleted').removeAttr('checked')
    }

    var disp_blacklist = localStorage.getItem('blacklist_deleted');
    if (disp_blacklist) {
        $('#div_blacklist_active').addClass("hidden");
        $('#div_blacklist_deleted').removeClass('hidden');
    } else {
        $('#div_blacklist_active').removeClass("hidden");
        $('#div_blacklist_deleted').addClass('hidden');
        $('#showDeleted_blacklist').removeAttr('checked')
    }
});


jQuery('#btn_add_white_ip').click(function () {
    jQuery('#modal_add_white_ip').modal();
});

jQuery('#btn_add_black_ip').click(function () {
    jQuery('#modal_add_black_ip').modal();
});

function editIpAddress(id) {
    $.ajax({
        url: '/ctgadmin/settings/whitelist/update/'+id,
        method: 'get',
        success: function (res) {
            $('#ip-address-edit').val(res);
            $('#ip_id').val(id);
            $('#modal_edit_ip').modal()
        }
    })
}

function deleteIpAddress(id) {
    if (confirm("Are you sure you want to delete this IP Adress?")) {
        $.ajax({
            url: '/ctgadmin/settings/whitelist/delete/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        })
    }
}

function restoreIpAddress(id) {
    if (confirm("Are you sure you want to restore this IP Address?")) {
        $.ajax({
            url: '/ctgadmin/settings/whitelist/restore/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        })
    }
}

function editBlackIpAddress(id) {
    jQuery.ajax({
        url: '/ctgadmin/settings/blacklist/edit/'+id,
        method: 'get',
        success: function (res) {
            jQuery('#black-ip-address-edit').val(res['ip']);
            jQuery('#black_reason_edit').val(res['reason']);

            jQuery('#form_edit_black_ip').attr('action', '/ctgadmin/settings/blacklist/update/'+id);
            jQuery('#modal_edit_black_ip').modal();
        }
    });
}

function deleteBlackIpAddress(id) {
    if (confirm("Are you sure you want to remove this IP Address from Black List?")) {
        $.ajax({
            url: '/ctgadmin/settings/blacklist/remove/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        })
    }
}

function restoreBlackIpAddress(id) {
    if (confirm("Are you sure you want to restore this IP Address?")) {
        $.ajax({
            url: '/ctgadmin/settings/blacklist/restore/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        })
    }
}

$('#showDeleted').change(function () {
    if ($('#showDeleted').prop('checked') === true) {
        $('#div_whitelist_active').addClass("hidden");
        $('#div_whitelist_deleted').removeClass('hidden');
        localStorage.setItem("whitelist_deleted", true)
    } else {
        $('#div_whitelist_active').removeClass("hidden");
        $('#div_whitelist_deleted').addClass('hidden');
        localStorage.removeItem('whitelist_deleted')
    }
});

$('#showDeleted_blacklist').change(function () {
    if ($('#showDeleted_blacklist').prop('checked') === true) {
        $('#div_blacklist_active').addClass("hidden");
        $('#div_blacklist_deleted').removeClass('hidden');
        localStorage.setItem("blacklist_deleted", true)
    } else {
        $('#div_blacklist_active').removeClass("hidden");
        $('#div_blacklist_deleted').addClass('hidden');
        localStorage.removeItem('blacklist_deleted')
    }
})