/**
 * Created by narav on 6/8/2019.
 */
$(document).ready(function () {
    var disp_certification = localStorage.getItem('certification_deleted');
    if (disp_certification) {
        $('#div_certification_active').addClass("hidden");
        $('#div_certification_deleted').removeClass('hidden');
    } else {
        $('#div_certification_active').removeClass("hidden");
        $('#div_certification_deleted').addClass('hidden');
        $('#showDeleted').removeAttr('checked')
    }
});

function editCertification(id) {
    $.ajax({
        url: '/ctgadmin/certification/edit/'+id,
        method: 'get',
        success: function (res) {
            console.log(res);
            $('#e_name').val(res['name']);
            $('#e_acronym').val(res['acronym']);
            $('#e_description').val(res['description']);
            $('#e_url_to_certification').val(res['url_to_certification']);
            $('#e_governing_body').val(res['governing_body']);

            if (res['beta_available']) {
                $('#e_beta_available').prop('checked', true);
            }

            if (res['full_available'] === true) {
                $('#e_full_available').prop('checked', true);
            }

            $('#form_edit_certification').attr('action', '/ctgadmin/certification/update/'+id);
            $('#modal_edit_certification').modal();
        }
    })
}

function deleteCertification(id) {
    if (confirm("Are you sure you want to delete this Certification?")) {
        $.ajax({
            url:'/ctgadmin/certification/delete/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        })
    }
}

function restoreCertification(id) {
    if (confirm("Are you sure you want to restore this Certification?")) {
        $.ajax({
            url:'/ctgadmin/certification/restore/'+id,
            method: 'get',
            success: function (res) {
                window.location.reload();
            }
        })
    }
}

$('#btn_add_certification').click(function () {
    $('#name').val('');
    $('#acronym').val('');
    $('#description').val('');
    $('#url_to_certification').val('');
    $('#governing_body').val('');

    $('#modal_create_certification').modal();
});

$('#showDeleted').change(function () {
    if ($('#showDeleted').prop('checked') === true) {
        $('#div_certification_active').addClass("hidden");
        $('#div_certification_deleted').removeClass('hidden');
        localStorage.setItem("certification_deleted", true)
    } else {
        $('#div_certification_active').removeClass("hidden");
        $('#div_certification_deleted').addClass('hidden');
        localStorage.removeItem('certification_deleted')
    }
})
