/**
 * Created by narav on 6/8/2019.
 */

 $(document).ready(function () {
    var disp_note = localStorage.getItem('usernote_deleted');
    if (disp_note) {
        $('#deleted_user_note').removeClass('hidden');
    } else {
        $('#active_user_note').removeClass("hidden");
        $('#showDeleted').removeAttr('checked');
    }
});

$('#btn_add_usernote').click(function () {
    $('#modal_user_note_create').modal();
});

function viewUserNote(id) {

}

function editUserNote(id) {
    $.ajax({
        url: '/ctgadmin/users/note/edit/'+id,
        method: 'get',
        success: function (res) {
            $('#input_note_user').val(res['user_name']);
            $('#input_note_note').val(res['note']);
            $('#form_user_note_edit').attr('action', '/ctgadmin/users/note/update/'+id);

            $('#modal_user_note_edit').modal();
        }
    })
}

function deleteUserNote(id) {
    if (confirm('Are you sure to delete this Note?')) {
        $.ajax({
            url: '/ctgadmin/users/note/delete/'+id,
            method: 'get',
            success: function (res) {
                location.reload()
            }
        })
    }
}

function restoreUserNote(id) {
    if (confirm('Are you sure to restore this Note?')) {
        $.ajax({
            url: '/ctgadmin/users/note/restore/'+id,
            method: 'get',
            success: function (res) {
                location.reload()
            }
        });
    }
}

$('#showDeleted').change(function () {
    if ($('#showDeleted').prop('checked') === true) {
        $('#active_user_note').addClass("hidden");
        $('#deleted_user_note').removeClass('hidden');
        localStorage.setItem("usernote_deleted", true)
    } else {
        $('#active_user_note').removeClass("hidden");
        $('#deleted_user_note').addClass('hidden');
        localStorage.removeItem('usernote_deleted')
    }
})
