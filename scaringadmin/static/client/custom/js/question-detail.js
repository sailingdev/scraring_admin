/**
 * Created by narav on 6/8/2019.
 */

$('#btn_add_answer').click(function () {
    $('#modal_add_answer').modal()
});


jQuery('#btn_answer_save_and_continue').click(function () {
    var question = jQuery('#input_question_id').val();
    var answer = jQuery('#answer').val();
    var ans_correct = jQuery('#correct_true').prop('checked');
    var type;
    if (ans_correct) {
        type = 'True';
    } else {
        type = 'False';
    }

    if (answer == "") {
        new PNotify({
            title: 'Notification',
            text: 'Please Fill answer field!',
            type: 'info'
         });
        return;
    }

    jQuery.ajax({
        url: '/ctgadmin/questions/'+question+'/answer/create',
        method: 'post',
        data: {
            'answer': answer,
            'type': type
        },
        success: function (res) {
             new PNotify({
                title: 'Notification',
                text: 'Answer successfully saved!',
                type: 'success'
             });
             jQuery('#answer').val('');
             var n_ans;
             if (ans_correct) {
                 n_ans = '<tr><td>'+ answer +'</td>' +
                     '<td><div class="checkbox-custom checkbox-primary">' +
                     '<input type="checkbox" checked onchange="updateAnswer('+ res['id'] + ')" id="correct'+ res['total'] +'">' +
                     '<label for="correct' + res['total'] +'">Correct</label></div></td>' +
                     '<td class="text-right">' +
                     '<button class="btn btn-sm btn-info" onclick="editAnswer(' + res['id'] +')" title="Edit"><i class="fa fa-edit"></i></button>' +
                     '<button class="btn btn-sm btn-secondary" onclick="deleteAnswer(' + res['id'] +')" title="Delete"><i class="fa fa-trash"></i></button>' +
                     '</td></tr>';
             } else {
                 n_ans = '<tr><td>'+ answer +'</td>' +
                     '<td><div class="checkbox-custom checkbox-primary">' +
                     '<input type="checkbox" onchange="updateAnswer('+ res['id'] + ')" id="correct'+ res['total'] +'" >' +
                     '<label for="correct' + res['total'] +'">Correct</label></div></td>' +
                     '<td class="text-right">' +
                     '<button class="btn btn-sm btn-info" onclick="editAnswer(' + res['id'] +')" title="Edit"><i class="fa fa-edit"></i></button>' +
                     '<button class="btn btn-sm btn-secondary" onclick="deleteAnswer(' + res['id'] +')" title="Delete"><i class="fa fa-trash"></i></button>' +
                     '</td></tr>';
             }
             jQuery('#tbl_answer_list').append(n_ans);
        }
    });
});

function editAnswer(id) {
   $.ajax({
        url: '/ctgadmin/questions/answer/edit/'+id,
        method: 'get',
        success: function (res) {
            $('#e_answer').val(res['answer']);

            if (res['type'] === true) {
                $('#e_correct_true').prop('checked', true);
            } else {
                $('#e_correct_false').prop('checked', true);
            }

            $('#form_edit_answer').attr('action', '/ctgadmin/questions/answer/update/'+id);
            $('#modal_edit_answer').modal()
        }
   })
}

function deleteAnswer(id) {
    if (confirm("Are you sure you want to delete this Answer?")){
        $.ajax({
            url: '/ctgadmin/questions/answer/delete/'+id,
            method: 'get',
            success: function (res) {
                location.reload();
            }
       })
    }
}

function updateAnswer(id) {
    jQuery.ajax({
        url: '/ctgadmin/questions/answer/type/'+id,
        method: 'get',
        success: function (res) {
            new PNotify({
                title: 'Notification',
                text: 'Answer successfully updated!',
                type: 'success'
            });
        }
    });
}