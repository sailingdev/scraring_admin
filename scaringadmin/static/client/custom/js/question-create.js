/**
 * Created by narav on 5/30/2019.
 */
function addRow(e) {

    $(e.parentElement).remove();

    var time = Date.now();

    var answer = '<tr><td><div class="form-group"><textarea class="form-control answers" name="answer[]" rows="1" placeholder="Answer"></textarea></div>' +
        '<textarea class="form-control explanations mt-1" name="explanation[]" rows="1" placeholder="Explanation"></textarea></td>'
        + '<td><div class="form-group"><div class="checkbox-custom checkbox-primary mt-2">' +
        '<input type="checkbox" name="answer_type[]" id="checkboxExample'+time+'"><label for="checkboxExample'+time+'"></label></div></div></td>'
        + '<td><button type="button" class="btn btn-danger btn-block" onclick="removeRow(this)"><i class="fa fa-trash"></i> </button></td>'
        + '<td><button type="button" class="btn btn-default btn-block" onclick="addRow(this)"><i class="fa fa-plus"></i> </button></td></tr>';

    jQuery('#tb_answers').append(answer);
}

$('#btn_add_answer').click(function () {
    $(this).addClass('hidden');
    var lists = jQuery('#tb_answers');
    var time = Date.now();

    var answer = '<tr><td><div class="form-group"><textarea class="form-control answers" name="answer[]" rows="1" placeholder="Answer"></textarea></div>' +
        '<textarea class="form-control explanations mt-1" name="explanation[]" rows="1" placeholder="Explanation"></textarea></td>'
        + '<td><div class="form-group"><div class="checkbox-custom checkbox-primary mt-2">' +
        '<input type="checkbox" name="answer_type[]" id="checkboxExample'+time+'"><label for="checkboxExample'+time+'"></label></div></div></td>'
        + '<td><button type="button" class="btn btn-danger btn-block" onclick="removeRow(this)"><i class="fa fa-trash"></i> </button></td>'
        + '<td><button type="button" class="btn btn-default btn-block" onclick="addRow(this)"><i class="fa fa-plus"></i> </button></td></tr>';

    lists.append(answer);
});

function removeRow(e) {
    var tr = e.parentElement.parentElement;
    var td_count = $(tr).find('td');
    tr.remove();

    var lists = jQuery('#tb_answers');
    if (td_count.length === 4) {
        tr = lists.find('tr');
        $(tr[tr.length-1]).append('<td><button type="button" class="btn btn-default btn-block" onclick="addRow(this)"><i class="fa fa-plus"></i> </button></td>')
    }

    var answers = lists.find('.answers');

    if (answers.length === 0) {
        $('#btn_add_answer').removeClass('hidden');
    }
}

jQuery('#btn_save').click(function () {
    var lists = jQuery('#tb_answers');
    var answers = lists.find('.answers');
    var explanations = lists.find('.explanations');
    var answer_types = lists.find('input');

    var que  = jQuery('#question').val();
    var source  = jQuery('#source').val();
    var explanation  = jQuery('#explanation').val();
    var number_to_display  = jQuery('#number_to_display').val();

    if (que == "") {
        new PNotify({
            title: 'Notification',
            text: 'Please Fill Question Fields!',
            type: 'info'
        });
        return;
    }

    if (number_to_display == 0 || number_to_display == "") {
        number_to_display = 4;
    }

    var data = [];
    var question = [];
    question.push({
        'question': que,
        'source': source,
        'explanation': explanation,
        'category': jQuery('#category').val(),
        'number_to_display': number_to_display,
        'type': jQuery('#question_type').val(),
        'difficulty': jQuery('#difficulty').val(),
        'test_only': jQuery('#test_only').val()
    });

    for (var i=0; i< answers.length; i++) {
        if (jQuery(answers[i]).val() != '') {
            data.push({
                'answer': jQuery(answers[i]).val(),
                'explanation': jQuery(explanations[i]).val(),
                'type': jQuery(answer_types[i]).prop('checked')
            });
        }
    }

    var ans = JSON.stringify(data);
    var ques = JSON.stringify(question[0]);

    $.ajax({
        url: '/ctgadmin/questions/store',
        method: 'post',
        data: {
            'question': ques,
            'answers': ans
        },
        success: function (res) {
            location.href = '/ctgadmin/questions'
        }
    })
});

jQuery('#btn_save_and_continue').click(function () {
    var lists = jQuery('#tb_answers');
    var answers = lists.find('.answers');
    var explanations = lists.find('.explanations');
    var answer_types = lists.find('input');

    var que  = jQuery('#question').val();
    var source  = jQuery('#source').val();
    var explanation  = jQuery('#explanation').val();
    var number_to_display  = jQuery('#number_to_display').val();

    if (que == "") {
        new PNotify({
            title: 'Notification',
            text: 'Please Fill Question Fields!',
            type: 'info'
        });
        return;
    }

    if (number_to_display == 0 || number_to_display == "") {
        number_to_display = 4;
    }

    var data = [];
    var question = [];
    question.push({
        'question': que,
        'source': source,
        'explanation': explanation,
        'category': jQuery('#category').val(),
        'number_to_display': number_to_display,
        'type': jQuery('#question_type').val(),
        'difficulty': jQuery('#difficulty').val(),
        'test_only': jQuery('#test_only').val()
    });

    for (var i=0; i< answers.length; i++) {
        if (jQuery(answers[i]).val() != '') {
            data.push({
                'answer': jQuery(answers[i]).val(),
                'explanation': jQuery(explanations[i]).val(),
                'type': jQuery(answer_types[i]).prop('checked')
            });
        }
    }

    var ans = JSON.stringify(data);
    var ques = JSON.stringify(question[0]);

    $.ajax({
        url: '/ctgadmin/questions/store',
        method: 'post',
        data: {
            'question': ques,
            'answers': ans
        },
        success: function (res) {
            jQuery('#question').val('');
            jQuery('#explanation').val('');

            var answer = '<tr><td><div class="form-group"><textarea class="form-control answers" name="answer[]" rows="1" placeholder="Answer"></textarea></div>' +
                    '<textarea class="form-control explanations mt-1" name="explanation[]" rows="1" placeholder="Explanation"></textarea></td>'
                    + '<td><div class="form-group"><div class="checkbox-custom checkbox-primary mt-2">' +
                    '<input type="checkbox" name="answer_type[]" id="checkboxExample'+time+'"><label for="checkboxExample'+time+'"></label></div></div></td>'
                    + '<td><button type="button" class="btn btn-danger btn-block" onclick="removeRow(this)"><i class="fa fa-trash"></i> </button></td>'
                    + '<td><button type="button" class="btn btn-default btn-block" onclick="addRow(this)"><i class="fa fa-plus"></i> </button></td></tr>';

            new PNotify({
                title: 'Notification',
                text: 'Question saved Correctly!',
                type: 'success'
            });

            $('#tb_answers').html(answer);
        }
    })
});
